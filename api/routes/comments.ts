import { Router } from 'express';
import { CommentController } from '../controllers/CommentController.js';

const router = Router();
const commentController = new CommentController();

router.get('/teams/:teamId/comments', commentController.getTeamComments.bind(commentController));
router.post('/teams/:teamId/comments', commentController.createComment.bind(commentController));
router.get('/teams/:teamId/comments/rating', commentController.getTeamRating.bind(commentController));

export default router;
