import client from './client';
import type { Project } from '../types/portfolio';

export const getProjects = () =>
  client.get<Project[]>('/projects').then(r => r.data);

export const createProject = (data: Partial<Project>) =>
  client.post<Project>('/projects', data).then(r => r.data);

export const updateProject = (id: number, data: Partial<Project>) =>
  client.put<Project>(`/projects/${id}`, data).then(r => r.data);

export const deleteProject = (id: number) =>
  client.delete(`/projects/${id}`);
