import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController.js';

const router = Router();
const feedbackController = new FeedbackController();

router.get('/', feedbackController.getFeedbacks.bind(feedbackController));
router.get('/:id', feedbackController.getFeedbackById.bind(feedbackController));
router.post('/', feedbackController.createFeedback.bind(feedbackController));
router.put('/:id/status', feedbackController.updateFeedbackStatus.bind(feedbackController));
router.delete('/:id', feedbackController.deleteFeedback.bind(feedbackController));

export default router;
