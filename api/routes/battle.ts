import { Router } from 'express';
import { BattleController } from '../controllers/BattleController.js';

const router = Router();
const battleController = new BattleController();

router.get('/pair', battleController.getBattlePair.bind(battleController));
router.post('/record', battleController.recordBattleResult.bind(battleController));
router.get('/song/:songId', battleController.getSongBattleRecords.bind(battleController));
router.get('/team/:teamId', battleController.getTeamBattleRecords.bind(battleController));
router.get('/song/:songId/stats', battleController.getSongStats.bind(battleController));
router.get('/team/:teamId/stats', battleController.getTeamStats.bind(battleController));

export default router;
