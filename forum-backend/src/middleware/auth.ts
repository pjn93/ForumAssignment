import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import * as jwt from 'jsonwebtoken';
import { prismaClient } from "..";
import { User } from "@prisma/client";


export interface AuthenticatedRequest extends Request {
    user?: User;
}

const authMiddleware = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!token) {
            throw new UnauthorizedException('Unauthorized', 401);
        }
     
        if (!process.env.JWT_SECRET) {
                    throw new Error('JWT_SECRET is not defined in environment variables');
                }

        const payload = jwt.verify(token, process.env.JWT_SECRET) as {userId: number};
        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

        if (!user) {
            throw new UnauthorizedException('Unauthorized', 401);
        }
        req.user = user;
        next();
    } catch (error) {           
        
          next(new UnauthorizedException('Unauthorized', 401));
     
  
    }
}

export default authMiddleware; 