import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.get('/:id/votes', userController.getUserVotes);
router.get('/:id/comments', userController.getUserComments);

export default router;
