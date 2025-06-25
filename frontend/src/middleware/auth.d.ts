import { Request, Response, NextFunction } from 'express';
export declare const loginLimiter: any;
export declare const registerLimiter: any;
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => any;
export declare const requireRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => any;
export declare const validatePassword: (req: Request, res: Response, next: NextFunction) => any;
export declare const sessionManager: (req: Request, res: Response, next: NextFunction) => void;
