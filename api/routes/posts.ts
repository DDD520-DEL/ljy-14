import { Router } from 'express';
import { PostController } from '../controllers/PostController.js';

const router = Router();
const postController = new PostController();

router.get('/', postController.getPosts.bind(postController));
router.get('/team/:teamId', postController.getTeamPosts.bind(postController));
router.post('/', postController.createPost.bind(postController));
router.delete('/:id', postController.deletePost.bind(postController));

export default router;
