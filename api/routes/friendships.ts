import { Router } from 'express';
import { FriendshipController } from '../controllers/FriendshipController.js';

const router = Router();
const friendshipController = new FriendshipController();

router.get('/', friendshipController.getAllFriendships.bind(friendshipController));
router.get('/team/:teamId', friendshipController.getFriendshipsByTeamId.bind(friendshipController));
router.post('/', friendshipController.createFriendship.bind(friendshipController));
router.delete('/:id', friendshipController.deleteFriendship.bind(friendshipController));

export default router;
