import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

// Manejador de errores para capturar errores de Prisma y otros errores en la aplicación
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction){
    console.error(error);// Loguear el error en la consola para depuración

    // Manejar errores específicos de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2025"){
            return res.status(404).json({error: "Registro no encontrado"});
        }
        if(error.code =="P2002"){
            const campo = (error.meta?.target as string[])?.join(", ") ?? "un campo unico";
            return res.status(409).json({error: 'Ya existe registro con ese valor en ${campo}'});
        }
        if(error.code == "P2003"){
            return res.status(400).json({error: "Referencia inválida, foreing key no existe"});
        }
    }
    // Manejar errores de validación de datos
    res.status(500).json({error: "Error interno del servidor"});
}