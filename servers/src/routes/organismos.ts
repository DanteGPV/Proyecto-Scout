import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { verificarToken } from "../middleware/auth_middleware";

const router = Router();
const prisma = new PrismaClient();

router.get("/", verificarToken, async(req,res)=>{
    try{
        const{buscar}= req.query; //  Obtener el parámetro de búsqueda de la consulta

        const where: any ={}; // Crear un objeto vacío para almacenar las condiciones de búsqueda
        
        // Filtrar por nombre de organismo si se proporciona el parámetro de búsqueda
        if(buscar){
            where.nombre = {contains: String(buscar), mode :"insensitive"};// Filtrar por nombre de organismo
        }

        // Realizar la consulta a la base de datos utilizando Prisma
        const organismos = await prisma.organismo.findMany({
            where, 
            select: {id:true, nombre:true},
            take:20,
            orderBy: {nombre:"asc"},
        });

        res.json(organismos.map(organismo => ({organismo, id: Number(organismo.id)})))// Convertir el id de BigInt a Number antes de enviarlo en la respuesta
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error al buscar organismos"});
    }
});

export default router;