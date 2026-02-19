import { Router } from 'express';
import { list, create, update, remove } from '../controllers/users.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.use(verifyToken); // all users routes require JWT

router.get('/', list);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
