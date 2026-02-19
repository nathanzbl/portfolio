import { Router } from 'express';
import { createRoom, getRoom } from '../controllers/games.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.post('/rooms', verifyToken, createRoom);
router.get('/rooms/:code', getRoom);

export default router;
