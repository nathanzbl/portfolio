import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../db/pool';
import { JwtPayload } from '../types/shared';

export async function loginUser(username: string, password: string): Promise<string> {
  const { rows } = await pool.query(
    'SELECT id, username, password_hash FROM users WHERE username = $1',
    [username]
  );

  if (rows.length === 0) {
    const err = new Error('Invalid credentials') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  const payload: JwtPayload = { userId: user.id, username: user.username };
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
}

export async function getUserById(userId: number) {
  const { rows } = await pool.query(
    'SELECT id, username, created_at FROM users WHERE id = $1',
    [userId]
  );
  return rows[0] ?? null;
}
