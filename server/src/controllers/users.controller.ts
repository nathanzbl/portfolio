import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/users.service';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await svc.getAllUsers()); } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'username and password are required' });
      return;
    }
    const user = await svc.createUser(username, password);
    res.status(201).json(user);
  } catch (err: unknown) {
    // Unique constraint violation
    if ((err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { username, password } = req.body;
    const user = await svc.updateUser(id, { username, password });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json(user);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (id === req.user!.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }
    const ok = await svc.deleteUser(id);
    if (!ok) { res.status(404).json({ error: 'User not found' }); return; }
    res.status(204).send();
  } catch (err) { next(err); }
}
