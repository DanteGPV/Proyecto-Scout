import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { verificarToken } from "../middleware/auth_middleware";

const router = Router();
const prisma = new PrismaClient();

// Ruta para buscar miembros con filtros opcionales
router.get("/", verificarToken, async(req,res)=>{
    try{ 
        const{nombre, apellido, id_rama, id_organismo, estado, pagina, porPagina}= req.query;

        const where: any = {}; // crear un objeto vacío para almacenar las condiciones de búsqueda

        if (nombre) {where.nombre = {contains: String(nombre), mode: "insensitive"};}

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
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    activo: true,
                    Rama: { select: { nombre: true } },
                    organismo: { select: { nombre: true } }
                },
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
        console.error(error);
        res.status(500).json({ error: "Error al buscar miembros" });
    }
});

export default router;
