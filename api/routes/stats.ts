import { Router } from 'express';
import { StatsController } from '../controllers/StatsController.js';

const router = Router();
const statsController = new StatsController();

router.get('/dashboard', statsController.getDashboardStats.bind(statsController));

export default router;
