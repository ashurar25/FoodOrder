import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { User } from '../shared/schema';

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Verify password utility
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).session?.user;
  
  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Attach user to request object
  (req as any).user = user;
  next();
}

// Admin middleware
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).session?.user;
  
  if (!user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  (req as any).user = user;
  next();
}

// Check if user exists middleware
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).session?.user;
  
  if (user) {
    (req as any).user = user;
  }
  
  next();
}