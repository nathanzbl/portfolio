import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/skills.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await svc.getAllSkills()); } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.createSkill({
      name: req.body.name,
      category: req.body.category,
      proficiencyLevel: req.body.proficiencyLevel,
      sortOrder: req.body.sortOrder,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.updateSkill(Number(req.params.id), req.body);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ok = await svc.deleteSkill(Number(req.params.id));
    if (!ok) { res.status(404).json({ error: 'Not found' }); return; }
    res.status(204).send();
  } catch (err) { next(err); }
}
