import { Router } from 'express';
import authRoutes from './auth.routes';
import projectsRoutes from './projects.routes';
import experienceRoutes from './experience.routes';
import educationRoutes from './education.routes';
import skillsRoutes from './skills.routes';
import gamesRoutes from './games.routes';
import usersRoutes from './users.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/skills', skillsRoutes);
router.use('/games', gamesRoutes);
router.use('/users', usersRoutes);

export default router;
