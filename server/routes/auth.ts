import { Router, Request, Response } from "express";
import { z } from "zod";
import { loginUser, registerUser } from "../auth-sqlite";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória")
});

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["user", "admin"]).optional().default("user")
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const result = await loginUser(email, password);
    
    if (result.success) {
      res.json({
        success: true,
        user: result.user,
        token: result.token
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    } else {
      console.error("Login route error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  }
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = registerSchema.parse(req.body);
    
    const result = await registerUser(email, password, name, role);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        user: result.user,
        token: result.token
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors
      });
    } else {
      console.error("Register route error:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
      });
    }
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

// POST /api/auth/logout (client-side handles token removal)
router.post("/logout", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Logout realizado com sucesso"
  });
});

export default router;