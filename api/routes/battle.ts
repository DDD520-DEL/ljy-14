import { Router } from 'express';
import { BattleController } from '../controllers/BattleController.js';

const router = Router();
const battleController = new BattleController();

router.get('/pair', battleController.getBattlePair.bind(battleController));

export default router;
