import { Router } from 'express';
import { VoteController } from '../controllers/VoteController.js';

const router = Router();
const voteController = new VoteController();

router.post('/addict', voteController.voteAddict.bind(voteController));
router.post('/costume', voteController.voteCostume.bind(voteController));

export default router;
