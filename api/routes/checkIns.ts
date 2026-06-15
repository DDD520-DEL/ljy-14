import { Router } from 'express';
import { CheckInController } from '../controllers/CheckInController.js';

const router = Router();
const checkInController = new CheckInController();

router.get('/:userId/status', checkInController.getStatus.bind(checkInController));
router.get('/:userId/records', checkInController.getRecords.bind(checkInController));
router.get('/:userId/month', checkInController.getMonthRecords.bind(checkInController));
router.post('/:userId/check-in', checkInController.checkIn.bind(checkInController));

export default router;
