import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { memoryDb } from "./db-memory";

// Require JWT_SECRET from environment - no fallback for security
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required for authentication");
}

if (!process.env.REFRESH_SECRET) {
  // Use a derived secret if REFRESH_SECRET is not set
  process.env.REFRESH_SECRET = crypto
    .createHash('sha256')
    .update(process.env.SESSION_SECRET + '-refresh')
    .digest('hex');
}

const JWT_SECRET = process.env.SESSION_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_EXPIRES_IN = "15m"; // Short-lived access token
const REFRESH_EXPIRES_IN = "7d"; // Long-lived refresh token

// In-memory refresh token storage (use Redis in production)
const refreshTokens = new Map<string, { userId: number; expiresAt: Date }>();

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  tokens?: TokenPair;
  message?: string;
}

// Hash password with increased rounds for better security
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate access token (short-lived)
export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      type: 'access'
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'ippax-api',
      audience: 'ippax-client'
    }
  );
}

// Generate refresh token (long-lived)
export function generateRefreshToken(user: AuthUser): string {
  const tokenId = crypto.randomBytes(32).toString('hex');
  const token = jwt.sign(
    { 
      id: user.id,
      tokenId,
      type: 'refresh'
    },
    REFRESH_SECRET,
    { 
      expiresIn: REFRESH_EXPIRES_IN,
      issuer: 'ippax-api',
      audience: 'ippax-client'
    }
  );

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  refreshTokens.set(tokenId, { userId: user.id, expiresAt });

  // Clean up expired tokens periodically
  cleanupExpiredTokens();

  return token;
}

// Generate both tokens
export function generateTokenPair(user: AuthUser): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    expiresIn: 900 // 15 minutes in seconds
  };
}

// Verify access token
export function verifyAccessToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'ippax-api',
      audience: 'ippax-client'
    }) as any;
    
    if (decoded.type !== 'access') {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || '',
      role: decoded.role || 'user'
    };
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): { userId: number; tokenId: string } | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET, {
      issuer: 'ippax-api',
      audience: 'ippax-client'
    }) as any;
    
    if (decoded.type !== 'refresh') {
      return null;
    }

    // Check if token exists in storage
    const storedToken = refreshTokens.get(decoded.tokenId);
    if (!storedToken || storedToken.userId !== decoded.id) {
      return null;
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      refreshTokens.delete(decoded.tokenId);
      return null;
    }

    return {
      userId: decoded.id,
      tokenId: decoded.tokenId
    };
  } catch (error) {
    return null;
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
  const tokenData = verifyRefreshToken(refreshToken);
  if (!tokenData) {
    return null;
  }

  // Get user from database
  const user = memoryDb.users.find(u => u.id === tokenData.userId);
  if (!user) {
    refreshTokens.delete(tokenData.tokenId);
    return null;
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user'
  };

  // Revoke old refresh token
  refreshTokens.delete(tokenData.tokenId);

  // Generate new token pair
  return generateTokenPair(authUser);
}

// Revoke refresh token
export function revokeRefreshToken(tokenId: string): boolean {
  return refreshTokens.delete(tokenId);
}

// Revoke all refresh tokens for a user
export function revokeAllUserTokens(userId: number): void {
  for (const [tokenId, data] of refreshTokens.entries()) {
    if (data.userId === userId) {
      refreshTokens.delete(tokenId);
    }
  }
}

// Clean up expired tokens
function cleanupExpiredTokens(): void {
  const now = new Date();
  for (const [tokenId, data] of refreshTokens.entries()) {
    if (data.expiresAt < now) {
      refreshTokens.delete(tokenId);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

// Login function with token pair generation
export async function login(email: string, password: string): Promise<LoginResult> {
  // Find user
  const user = memoryDb.users.find(u => u.email === email);
  if (!user) {
    return {
      success: false,
      message: "Invalid email or password"
    };
  }

  // Verify password
  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) {
    return {
      success: false,
      message: "Invalid email or password"
    };
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'user'
  };

  // Generate token pair
  const tokens = generateTokenPair(authUser);

  return {
    success: true,
    user: authUser,
    tokens,
    message: "Login successful"
  };
}

// Register function with token pair generation
export async function register(email: string, password: string, name: string): Promise<LoginResult> {
  // Check if user exists
  const existingUser = memoryDb.users.find(u => u.email === email);
  if (existingUser) {
    return {
      success: false,
      message: "Email already registered"
    };
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = {
    id: memoryDb.users.length + 1,
    email,
    password: hashedPassword,
    name,
    role: 'user',
    createdAt: new Date()
  };

  memoryDb.users.push(newUser);

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role
  };

  // Generate token pair
  const tokens = generateTokenPair(authUser);

  return {
    success: true,
    user: authUser,
    tokens,
    message: "Registration successful"
  };
}

// Logout function
export async function logout(refreshToken?: string): Promise<void> {
  if (refreshToken) {
    const tokenData = verifyRefreshToken(refreshToken);
    if (tokenData) {
      revokeRefreshToken(tokenData.tokenId);
    }
  }
}

export default {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  login,
  register,
  logout
};