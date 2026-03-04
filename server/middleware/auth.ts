import { Request, Response, NextFunction } from "express";
import { verifyToken, AuthUser, getUserById } from "../auth-sqlite";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Authentication middleware
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token de acesso necessário" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: "Token inválido" });
    }

    // Get fresh user data
    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(403).json({ error: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Token inválido" });
  }
}

// Admin-only middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Autenticação necessária" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }

  next();
}

// Optional authentication (doesn't fail if no token)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await getUserById(decoded.id);
        req.user = user || undefined;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }

  next();
}