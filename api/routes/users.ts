import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();
const userController = new UserController();

router.post('/', userController.createUser.bind(userController));
router.get('/:id', userController.getUser.bind(userController));
router.get('/:id/votes', userController.getUserVotes.bind(userController));
router.get('/:id/comments', userController.getUserComments.bind(userController));
router.get('/:id/favorites', userController.getFavoriteTeamIds.bind(userController));
router.post('/:id/favorites/sync', userController.syncFavorites.bind(userController));
router.post('/:id/favorites/toggle', userController.toggleFavorite.bind(userController));

export default router;
