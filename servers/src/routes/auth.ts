import { Prisma, PrismaClient } from "@prisma/client"; //importo el cliente de prisma para poder hacer consultas a la base de datos
import bcrypt from "bcrypt"; //para hashear contraseñas
import { Router } from "express"; //importo el router de express para poder crear rutas
import jwt from "jsonwebtoken"; //para generar tokens de autenticación
import { verificarToken } from "../middleware/auth_middleware"; //importo el middleware para verificar el token de autenticación

const router = Router(); //creo el router de express para poder crear rutas
const prisma = new PrismaClient(); //creo el cliente de prisma para poder hacer consultas a la base de datos

router.post("/usuarios", async(req, res)=>{
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

        //Creo el hash para la contraseña temporal que dió el Jefe Scout al usuario
        const hash = await bcrypt.hash(contraseñaTemporal, 10);

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
        console.error(error);
        res.status(400).json({error: "No se pudo crear el Miembro Scout"});
    }
    

});

router.post("/login", async(req, res)=>{
    try{
        const {email, password} = req.body; //obtengo el email y la contraseña del body del request

        const usuario = await prisma.usuario.findUnique({where:{email}});

        if(!usuario){
            return res.status(401).json({error:"Credenciales invalidas"});
        }

        const contraseñaValida = await bcrypt.compare(password, usuario.hash_contrasena);

        if(!contraseñaValida){
            return res.status(401).json({error: "Credenciales invalidas"});
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
        res.status(500).json({error: "Error en el servidor"});
    }
});

router.post("/cambiar-clave",verificarToken, async(req,res)=>{
    try{    
    const {id} = (req as any).usuario;
    const {contraseñaActual, nuevaContraseña}= req.body;

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
    const hash= await bcrypt.hash(nuevaContraseña, 10);

    await prisma.usuario.update({
        where: {id},
        data: {
            hash_contrasena: hash,
            debe_cambiar_contrasena: false,
        }
    });

    res.json({ok:true});
}catch(error){
    console.error(error);
    res.status(500).json({error: "Error al cambiar la contraseña"});
}

});

export default router;
