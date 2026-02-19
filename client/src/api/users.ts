import client from './client';
import type { AuthUser } from '../types/auth';

export const getUsers = () =>
  client.get<AuthUser[]>('/users').then(r => r.data);

export const createUser = (username: string, password: string) =>
  client.post<AuthUser>('/users', { username, password }).then(r => r.data);

export const updateUser = (id: number, data: { username?: string; password?: string }) =>
  client.put<AuthUser>(`/users/${id}`, data).then(r => r.data);

export const deleteUser = (id: number) =>
  client.delete(`/users/${id}`);
