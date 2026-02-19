import client from './client';
import type { AuthUser, LoginResponse } from '../types/auth';

export async function login(username: string, password: string): Promise<string> {
  const { data } = await client.post<LoginResponse>('/auth/login', { username, password });
  return data.token;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await client.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}
