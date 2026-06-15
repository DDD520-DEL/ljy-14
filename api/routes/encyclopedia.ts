import { Router } from 'express';
import { EncyclopediaController } from '../controllers/EncyclopediaController.js';

const router = Router();
const encyclopediaController = new EncyclopediaController();

router.get('/', encyclopediaController.getArticles.bind(encyclopediaController));
router.get('/:id', encyclopediaController.getArticleById.bind(encyclopediaController));
router.post('/', encyclopediaController.createArticle.bind(encyclopediaController));
router.put('/:id', encyclopediaController.updateArticle.bind(encyclopediaController));
router.delete('/:id', encyclopediaController.deleteArticle.bind(encyclopediaController));

export default router;
