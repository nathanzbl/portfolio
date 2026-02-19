import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/experience.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await svc.getAllExperience()); } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.createExperience({
      company: req.body.company,
      role: req.body.role,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isCurrent: req.body.isCurrent,
      sortOrder: req.body.sortOrder,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.updateExperience(Number(req.params.id), req.body);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ok = await svc.deleteExperience(Number(req.params.id));
    if (!ok) { res.status(404).json({ error: 'Not found' }); return; }
    res.status(204).send();
  } catch (err) { next(err); }
}
