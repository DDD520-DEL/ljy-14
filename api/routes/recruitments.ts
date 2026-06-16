import { Router } from 'express';
import { RecruitmentController } from '../controllers/RecruitmentController.js';

const router = Router();
const recruitmentController = new RecruitmentController();

router.get('/', recruitmentController.getRecruitments.bind(recruitmentController));
router.get('/latest', recruitmentController.getLatestRecruitments.bind(recruitmentController));
router.get('/:id', recruitmentController.getRecruitmentById.bind(recruitmentController));
router.get('/team/:teamId', recruitmentController.getTeamRecruitments.bind(recruitmentController));
router.post('/', recruitmentController.createRecruitment.bind(recruitmentController));
router.put('/:id', recruitmentController.updateRecruitment.bind(recruitmentController));
router.delete('/:id', recruitmentController.deleteRecruitment.bind(recruitmentController));
router.put('/:id/close', recruitmentController.closeRecruitment.bind(recruitmentController));

export default router;
