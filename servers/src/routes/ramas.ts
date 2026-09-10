import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { verificarToken } from "../middleware/auth_middleware";

const router = Router();
const prisma = new PrismaClient();

// Ruta para buscar ramas
router.get("/", verificarToken, async(req,res)=>{
    try{
        // Realizar la consulta a la base de datos utilizando Prisma
        const ramas = await prisma.rama.findMany({
            select: {id:true, nombre:true},
            orderBy: {id: "asc"},
        });

        // Enviar la respuesta con las ramas encontradas
        res.json(ramas);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error al buscar ramas"});
    }
});
export default router;