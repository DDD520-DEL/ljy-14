import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController.js';

const router = Router();
const notificationController = new NotificationController();

router.get('/:userId/unread-count', notificationController.getUnreadCount.bind(notificationController));
router.get('/:userId', notificationController.getNotifications.bind(notificationController));
router.put('/:userId/read-all', notificationController.markAllAsRead.bind(notificationController));
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));

export default router;
