import { Router } from 'express';
import { RankingController } from '../controllers/RankingController.js';

const router = Router();
const rankingController = new RankingController();

router.get('/comprehensive', rankingController.getComprehensiveRanking.bind(rankingController));
router.get('/addict', rankingController.getAddictRanking.bind(rankingController));
router.get('/costume', rankingController.getCostumeRanking.bind(rankingController));

export default router;
