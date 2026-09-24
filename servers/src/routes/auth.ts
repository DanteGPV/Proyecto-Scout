import { Prisma, PrismaClient } from "@prisma/client"; //importo el cliente de prisma para poder hacer consultas a la base de datos
import bcrypt from "bcrypt"; //para hashear contraseñas
import crypto from "crypto";
import { Router } from "express"; //importo el router de express para poder crear rutas
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken"; //para generar tokens de autenticación
import QRcode from "qrcode";
import speakeasy from "speakeasy";
import { verificarToken } from "../middleware/auth_middleware"; //importo el middleware para verificar el token de autenticación
import { calcularFortalezaPassword, hashearPassword, validarFortalezaPassword, validarNuevaPassword } from "../utils/auth_utils";
import { enviarEmailRecuperacion } from "../utils/email";
import { validarEdadParaRama } from "../utils/validarEdadRama";


const router = Router(); //creo el router de express para poder crear rutas
const prisma = new PrismaClient(); //creo el cliente de prisma para poder hacer consultas a la base de datos
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos en esa ventana
  message: { error: "Demasiados intentos, probá de nuevo en unos minutos" },
});

router.post("/usuarios", async(req, res, next)=>{
    try{
        //indico los datos del body del request (Después usamos fetch aparentemente)
        const {
        dni,
        nombre,
        apellido,
        fecha_nacimiento,
        id_rama,
        id_organismo,
        promesa,
        email,
        contraseñaTemporal,
        } = req.body;

        const errorEdad = await validarEdadParaRama(Number(id_rama), new Date(fecha_nacimiento));
        if (errorEdad) {
          return res.status(400).json({ error: errorEdad });
        }
        
        //Creo el hash para la contraseña temporal que dió el Jefe Scout al usuario
        const hash = await hashearPassword(contraseñaTemporal);

        //Creo el Usuario y el miembro scout usando Prisma ORM que se conecta con PostgreSQL. uso el metodo $transaction de prisma que asegura que al crear las dos instancias en este caso no haya ningun error, y así seguir con el proceso. indicó tambien que debe cambiar contraseña.
        const resultado = await prisma.$transaction(async(tx : Prisma.TransactionClient) =>{
        //creo el miembro scout:
        const miembro = await tx.miembro_Scout.create({
            data:{
                DNI: dni,
                nombre,
                apellido,
                fecha_nacimiento: new Date(fecha_nacimiento),
                id_rama,
                id_organismo,
                promesa,
            }
        });
        //creo el usuario:
        const usuario = await tx.usuario.create({
            data: {
            id_miembro: miembro.id,
            email,
            hash_contrasena: hash,
            debe_cambiar_contrasena: true,
            },

        });
        return {miembro, usuario};
        
        });
        res.status(201).json({
            id_miembro: Number(resultado.miembro.id),
            nombre: resultado.miembro.nombre,
            apellido: resultado.miembro.apellido,
            email: resultado.usuario.email,
        });

    }catch(error){
        next(error);
    }
    

});

router.post("/login", loginLimiter ,async(req, res, next)=>{
    try{
        const {email, password, codigoTotp} = req.body; //obtengo el email y la contraseña del body del request

        const usuario = await prisma.usuario.findUnique({where:{email}});

        if(!usuario){
            return res.status(401).json({error:"Credenciales invalidas"});
        }

        const contraseñaValida = await bcrypt.compare(password, usuario.hash_contrasena);

        if(!contraseñaValida){
            return res.status(401).json({error: "Credenciales invalidas"});
        }

        if (usuario.totp_activado) {
            if (!codigoTotp) {
            return res.status(200).json({ requiere2FA: true });
            }

            const esValido = speakeasy.totp.verify({
                secret: usuario.totp_secret!,
                encoding: "base32",
                token:codigoTotp,
                window: 1,
            });

            if(!esValido){
                return res.status(401).json({error: "Código de autenticación incorrecto"});
            }
        }

        const token = jwt.sign({id:Number(usuario.id), id_miembro:Number(usuario.id_miembro)}, process.env.JWT_SECRET!, {expiresIn: "7d"});

        await prisma.usuario.update({
            where: {id: usuario.id},
            data: {ultimo_login: new Date()},
        });

        res.json({
            token,
            debeCambiarContraseña: usuario.debe_cambiar_contrasena,
        })
    }catch(error){
        next(error);
    }
});

router.post("/cambiar-clave",verificarToken, async(req,res, next)=>{
    try{    
    const {id} = (req as any).usuario;
    const {contraseñaActual, nuevaContraseña, confirmarContraseña}= req.body;

    const errorPassword = validarNuevaPassword(nuevaContraseña, confirmarContraseña);
    if (errorPassword) {
     return res.status(400).json({ error: errorPassword });
    }   

    const usuario = await prisma.usuario.findUnique({where: {id}});

    if(!usuario){
        return res.status(404).json({error: "Usuario no encontrado."});
    }

    if (!usuario.debe_cambiar_contrasena){
        const contraseñaValida = await bcrypt.compare(contraseñaActual, usuario.hash_contrasena);
        if(!contraseñaValida){
            return res.status(401).json({error:"La contraseña actual es incorrecta."});
        }
    }  
    const hash= await hashearPassword(nuevaContraseña);

    await prisma.usuario.update({
        where: {id},
        data: {
            hash_contrasena: hash,
            debe_cambiar_contrasena: false,
        }
    });

    res.json({ok:true});
}catch(error){
    next(error);
}

});


router.post("/verificar-fortaleza", (req, res, next)=>{
    try{
        const {contraseña} = req.body

        const errorContraseña= validarFortalezaPassword(contraseña);

        const puntajeContraseña = calcularFortalezaPassword(contraseña);

        return res.status(200).json({puntajeContraseña,  errorContraseña, valida: errorContraseña===null})
}catch(error){
    next(error);
}
}
)

router.post("/2fa/generar", async(req, res, next)=>{
    try {
        const{id}= (req as any).usuario;

        const usuario = await prisma.usuario.findUniqueOrThrow({where: {id}});

        const secreto = speakeasy.generateSecret({
            name: `Scout (${usuario.email})`
        });

        await prisma.usuario.update({
            where: {id},
            data: { totp_secret: secreto.base32},
        });

        const qrImageUrl = await QRcode.toDataURL(secreto.otpauth_url!);

        res.json({qrImageUrl, secretoManual: secreto.base32})
    }catch(error){
        next(error);
    }
})


router.post("/2fa/confirmar", verificarToken, async (req, res, next,)=>{
    try{
        const{id} = (req as any).usuario;
        const {codigo} = req.body;

        const usuario = await prisma.usuario.findUniqueOrThrow({where:{id}});

        if (!usuario.totp_secret){
            return res.status(400).json({error:"Primero tenés que generar el código"});
        }

        const esValido = speakeasy.totp.verify({
            secret: usuario.totp_secret,
            encoding: "base32",
            token: codigo,
            window: 1, // tolera 1 intervalo de 30s antes/después, por desincronización de reloj
        });

        if(!esValido){
            return res.status(400).json({error: "Codigo incorrecto"});
        }

        await prisma.usuario.update({
            where: {id},
            data: {totp_activado: true},
        });

        res.json({ok: true, mensaje:"2FA activado correctamente"});
    }catch(error){
        next(error);
    }
})

router.post("/2fa/desactivar", verificarToken, async (req, res, next) => {
  try {
    const {id} = (req as any).usuario;
    const {contraseñaActual, confirmarContraseñaActual} = req.body;
    
    if(contraseñaActual !== confirmarContraseñaActual){
        return res.status(400).json({error: "Las contraseñas no coinciden."});
    }
    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id } });

    const passwordValida = await bcrypt.compare(contraseñaActual, usuario.hash_contrasena);
    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    await prisma.usuario.update({
      where: { id },
      data: { totp_activado: false, totp_secret: null },
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/recuperar-clave", async(req, res, next)=>{
    try{
    const {email}= req.body;
    const usuario = await prisma.usuario.findUnique({where: {email}});

    if(!usuario){
        return res.json({ok: true, mensaje: "si el mail existe, se envió un correo"});
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expira = new Date(Date.now() + 60*60*100);

    await prisma.tokenRecuperacion.create({
        data: {id_usuario: usuario.id, token, expira}
    })

    const link =`https://app.com/resetar?token=${token}`;

    await enviarEmailRecuperacion(email, link);

    res.json({ ok: true, mensaje: "Si el email existe, se envió un correo" });
    }catch (error) {
    next(error);
  }
})

router.post("/resetear-clave", async (req, res, next) => {
  try {
    const { token, nuevaContraseña, confirmarContraseña } = req.body;

    const errorPassword = validarNuevaPassword(nuevaContraseña, confirmarContraseña);
    if (errorPassword) {
     return res.status(400).json({ error: errorPassword });
    }

    const registro = await prisma.tokenRecuperacion.findUnique({ where: { token } });

    if (!registro || registro.usado || registro.expira < new Date()) {
      return res.status(400).json({ error: "El enlace de recuperación es inválido o expiró" });
    }

    const hash = await hashearPassword(nuevaContraseña);

    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: registro.id_usuario },
        data: { hash_contrasena: hash, debe_cambiar_contrasena: false },
      }),
      prisma.tokenRecuperacion.update({
        where: { id: registro.id },
        data: { usado: true },
      }),
    ]);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
export default router;
