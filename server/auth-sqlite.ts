import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "./db-sqlite";
import { users } from "../shared/schema-sqlite";
import { eq } from "drizzle-orm";

const JWT_EXPIRES_IN = "24h";

// Get JWT_SECRET with validation
function getJWTSecret(): string {
  const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.error("❌ JWT_SECRET deve ter pelo menos 32 caracteres. Configure JWT_SECRET ou SESSION_SECRET no .env");
    process.exit(1);
  }
  return JWT_SECRET;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    getJWTSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJWTSecret()) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || "",
      role: decoded.role || "user"
    };
  } catch (error) {
    return null;
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<LoginResult> {
  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return { success: false, message: "E-mail ou senha incorretos" };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { success: false, message: "E-mail ou senha incorretos" };
    }

    // Create auth user object
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // Generate token
    const token = generateToken(authUser);

    return {
      success: true,
      user: authUser,
      token
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

// Register user
export async function registerUser(
  email: string, 
  password: string, 
  name: string,
  role: string = "user"
): Promise<LoginResult> {
  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return { success: false, message: "Este e-mail já está em uso" };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        role,
        isActive: true
      })
      .returning();

    // Create auth user object
    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    };

    // Generate token
    const token = generateToken(authUser);

    return {
      success: true,
      user: authUser,
      token
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Erro ao criar usuário" };
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<AuthUser | null> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}