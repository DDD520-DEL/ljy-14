import { Router } from 'express';
import { InvitationController } from '../controllers/InvitationController.js';

const router = Router();
const invitationController = new InvitationController();

router.get('/', invitationController.getAllInvitations.bind(invitationController));
router.get('/:id', invitationController.getInvitationById.bind(invitationController));
router.get('/team/:teamId', invitationController.getTeamInvitations.bind(invitationController));
router.post('/', invitationController.createInvitation.bind(invitationController));
router.put('/:id/accept', invitationController.acceptInvitation.bind(invitationController));
router.put('/:id/reject', invitationController.rejectInvitation.bind(invitationController));

export default router;
