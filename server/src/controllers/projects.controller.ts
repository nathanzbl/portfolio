import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/projects.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await svc.getAllProjects();
    res.json(projects);
  } catch (err) { next(err); }
}

function mapBody(body: Record<string, unknown>) {
  return {
    title:       body.title       as string | undefined,
    description: body.description as string | undefined,
    techStack:   (body.tech_stack  ?? body.techStack)  as string[] | undefined,
    githubUrl:   (body.github_url  ?? body.githubUrl)  as string | undefined,
    liveUrl:     (body.live_url    ?? body.liveUrl)    as string | undefined,
    imageUrl:    (body.image_url   ?? body.imageUrl)   as string | undefined,
    isFeatured:  (body.is_featured ?? body.isFeatured) as boolean | undefined,
    sortOrder:   (body.sort_order  ?? body.sortOrder)  as number | undefined,
  };
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mapped = mapBody(req.body);
    if (!mapped.title) { res.status(400).json({ error: 'title is required' }); return; }
    const project = await svc.createProject({ ...mapped, title: mapped.title });
    res.status(201).json(project);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await svc.updateProject(Number(req.params.id), mapBody(req.body));
    if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
    res.json(project);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ok = await svc.deleteProject(Number(req.params.id));
    if (!ok) { res.status(404).json({ error: 'Project not found' }); return; }
    res.status(204).send();
  } catch (err) { next(err); }
}
