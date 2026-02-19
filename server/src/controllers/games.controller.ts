import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/games.service';

export async function createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { gameType = 'general' } = req.body;
    const room = await svc.createRoom(gameType, req.user!.userId);
    res.status(201).json(room);
  } catch (err) { next(err); }
}

export async function getRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await svc.getRoomByCode(req.params.code);
    if (!result) { res.status(404).json({ error: 'Room not found' }); return; }
    res.json(result);
  } catch (err) { next(err); }
}
