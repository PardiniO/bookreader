import { Request, Response, NextFunction } from "express";
import { IAuthenticatedRequest } from "../interfaces/index";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
    public static authenticate = (req: IAuthenticatedRequest, res: Response, next: NextFunction): void => {
        try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            res.status(401).json({
            success: false,
            message: 'Token de acceso requerido',
            error: 'No authorization header provided'
            });
            return;
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            res.status(401).json({
            success: false,
            message: 'Token de acceso inválido',
            error: 'No token provided'
            });
            return;
        }

        const secret = process.env.JWT_SECRET || 'default_secret_key';
        const decoded = jwt.verify(token, secret) as any;
        
        req.user = {
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name
        };

        next();
        } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
            success: false,
            message: 'Token inválido',
            error: error.message
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
            success: false,
            message: 'Token expirado',
            error: 'Token has expired'
            });
        } else {
            res.status(500).json({
            success: false,
            message: 'Error de autenticación',
            error: 'Authentication error'
            });
        }
        }
    };

    public static optional = (req: IAuthenticatedRequest, res: Response, next: NextFunction): void => {
        try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            next();
            return;
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            next();
            return;
        }

        const secret = process.env.JWT_SECRET || 'default_secret_key';
        const decoded = jwt.verify(token, secret) as any;
        
        req.user = {
            id: decoded.id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name
        };

        next();
        } catch (error) {
        // En modo opcional, continuamos sin autenticación si hay error
        next();
        }
    };
}