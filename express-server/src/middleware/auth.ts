import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "../models/User";

export interface AuthPayload {
  sub: string;
  role: Role;
}

export type AuthedRequest = Request & { auth?: AuthPayload };

export function signToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta la variable de entorno JWT_SECRET");
  return jwt.sign(payload, secret, { expiresIn: "2h" });
}

// Ruta privada: exige un JWT válido en el header Authorization: Bearer <token>
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET ?? "") as unknown as AuthPayload;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o vencido" });
  }
}

// Ruta protegida por rol: se usa después de requireAuth
export function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ message: "No tenés permisos para acceder a este recurso" });
      return;
    }
    next();
  };
}
