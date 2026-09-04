import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function verificarToken(req:Request, res:Response,next:NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: "Token no provisto"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).usuario =payload;
        next();
    }catch{
        return res.status(401).json({error: "Token invalido o expirado"});
    }
}