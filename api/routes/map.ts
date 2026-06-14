import { Router } from 'express';
import { MapController } from '../controllers/MapController.js';

const router = Router();
const mapController = new MapController();

router.get('/teams', mapController.getMapTeams.bind(mapController));

export default router;
