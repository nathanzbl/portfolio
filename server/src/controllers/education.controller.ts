import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/education.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await svc.getAllEducation()); } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.createEducation({
      institution: req.body.institution,
      degree: req.body.degree,
      field: req.body.field,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = await svc.updateEducation(Number(req.params.id), req.body);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ok = await svc.deleteEducation(Number(req.params.id));
    if (!ok) { res.status(404).json({ error: 'Not found' }); return; }
    res.status(204).send();
  } catch (err) { next(err); }
}
