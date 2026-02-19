import client from './client';
import type { Experience, Education, Skill } from '../types/portfolio';

// Experience
export const getExperience = () =>
  client.get<Experience[]>('/experience').then(r => r.data);
export const createExperience = (data: Partial<Experience>) =>
  client.post<Experience>('/experience', data).then(r => r.data);
export const updateExperience = (id: number, data: Partial<Experience>) =>
  client.put<Experience>(`/experience/${id}`, data).then(r => r.data);
export const deleteExperience = (id: number) =>
  client.delete(`/experience/${id}`);

// Education
export const getEducation = () =>
  client.get<Education[]>('/education').then(r => r.data);
export const createEducation = (data: Partial<Education>) =>
  client.post<Education>('/education', data).then(r => r.data);
export const updateEducation = (id: number, data: Partial<Education>) =>
  client.put<Education>(`/education/${id}`, data).then(r => r.data);
export const deleteEducation = (id: number) =>
  client.delete(`/education/${id}`);

// Skills
export const getSkills = () =>
  client.get<Skill[]>('/skills').then(r => r.data);
export const createSkill = (data: Partial<Skill>) =>
  client.post<Skill>('/skills', data).then(r => r.data);
export const updateSkill = (id: number, data: Partial<Skill>) =>
  client.put<Skill>(`/skills/${id}`, data).then(r => r.data);
export const deleteSkill = (id: number) =>
  client.delete(`/skills/${id}`);
