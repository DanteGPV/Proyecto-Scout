import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { verificarToken } from "../middleware/auth_middleware";

const router = Router();
const prisma = new PrismaClient();

const miembroBasico ={
    id:true,
    nombre:true, 
    apellido:true,
    activo:true,
    apodo:true,
    Rama:{select:{nombre:true}},
    organismo:{select:{nombre:true}}
} as const; // Definir el tipo de miembroBasico como constante para que TypeScript infiera correctamente los tipos

// Ruta para buscar miembros con filtros opcionales
router.get("/", verificarToken, async(req,res, next)=>{
    try{ 
        const{nombre, apellido, id_rama, id_organismo, estado, pagina, porPagina}= req.query;

        const where: any = {}; // crear un objeto vacío para almacenar las condiciones de búsqueda

        if (nombre)  {where.nombre = {contains: String(nombre), mode: "insensitive"};}

        if(apellido){where.apellido = {contains:String(apellido), mode : "insensitive"};}

        if (id_rama) {where.id_rama = Number(id_rama);}// Filtrar por id de rama
        
        if(id_organismo){where.id_organismo = BigInt(id_organismo as string);}// Filtrar por id de organismo

        // Filtrar por estado (activo o inactivo)
        if (estado==="inactivo"){
            where.activo = false;
        }else if (estado==="activo"){
            where.activo=true;
        }

        const paginaActual = pagina ? Number(pagina) : 1; // Página actual, por defecto es 1
        const cantidadPorPagina = porPagina ? Number(porPagina): 20; // Cantidad de resultados por página, por defecto es 20

        // Realizar la consulta a la base de datos utilizando Prisma y obtener el total de resultados
        const [miembros, total] = await Promise.all([ // Ejecutar ambas consultas en paralelo para mejorar el rendimiento
            // Buscar miembros con los filtros aplicados y paginación
            prisma.miembro_Scout.findMany({
                where,
                select: miembroBasico, // Seleccionar solo los campos básicos del miembro
                skip: (paginaActual - 1) * cantidadPorPagina, // Saltar los resultados de las páginas anteriores
                take: cantidadPorPagina,// Limitar la cantidad de resultados por página
                orderBy: { apellido: "asc" }
            }),
            prisma.miembro_Scout.count({ where }) // Contar el total de resultados que cumplen con los filtros aplicados
        ]);

        res.json({
            data: miembros.map((miembro) => ({ ...miembro, id: Number(miembro.id) })),
            // Información de paginación
            paginacion: {
                paginaActual,
                cantidadPorPagina,
                totalResultados: total,// Total de resultados encontrados
                totalPaginas: Math.ceil(total / cantidadPorPagina) // Calcular el total de páginas
            }
        });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
});

router.get("/:id", verificarToken, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const miembro = await prisma.miembro_Scout.findUniqueOrThrow({
      where: { id },
      select: miembroBasico,
    });

    res.json({ ...miembro, id: Number(miembro.id) });
  } catch (error) {
    next(error);
  }
});

// Ruta para editar un miembro por su ID
router.patch("/:id", verificarToken, async(req,res, next)=>{
    try {
        const id = Number(req.params.id); // Obtener el ID del miembro de los parámetros de la ruta

        const{nombre, apellido, fecha_nacimiento, id_rama, id_organismo, promesa, apodo}= req.body;

        const data:any={};

        // Actualizar solo los campos que se proporcionan en el cuerpo de la solicitud
        if(nombre !== undefined){data.nombre = nombre;}
        if(apellido!== undefined){data.apellido = apellido;}
        if(fecha_nacimiento!== undefined){data.fecha_nacimiento = new Date(fecha_nacimiento);}
        if(id_rama!== undefined){data.id_rama = Number(id_rama);}
        if(id_organismo!== undefined){data.id_organismo = BigInt(id_organismo);}
        if(promesa !== undefined){data.promesa = promesa;}
        if(apodo!== undefined){data.apodo = apodo;}

        // Actualizar el miembro en la base de datos utilizando Prisma
        const miembroActualizado = await prisma.miembro_Scout.update({
            where: {id},
            data,
            select:miembroBasico
        });
        res.json({...miembroActualizado, id:Number(miembroActualizado.id)})
    }catch (error){
        next(error);
    }
})

// Ruta para dar de baja a un miembro por su ID
router.patch("/:id/estado", verificarToken, async(req,res, next)=>{
    try{
        const id = Number(req.params.id);
        const {activo}=req.body;
        
        if(typeof activo !=="boolean"){
            return res.status(400).json({error:"el campo 'activo' debe ser boolean"})
        }

        const miembroBaja = await prisma.miembro_Scout.update({
            where:{id},
            data : {activo},
            select: {id:true, nombre:true, apellido:true, activo:true},
        });
        res.json({...miembroBaja, id: Number(miembroBaja.id)});
    }catch(error){
        next(error);
    }
})
export default router;
