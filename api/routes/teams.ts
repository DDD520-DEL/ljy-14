import { Router } from 'express';
import { TeamController } from '../controllers/TeamController.js';
import { SongController } from '../controllers/SongController.js';

const router = Router();
const teamController = new TeamController();
const songController = new SongController();

router.get('/', teamController.getTeams.bind(teamController));
router.get('/:id', teamController.getTeamById.bind(teamController));
router.post('/', teamController.createTeam.bind(teamController));
router.put('/:id', teamController.updateTeam.bind(teamController));

router.get('/:teamId/songs', songController.getSongsByTeamId.bind(songController));
router.post('/:teamId/songs', songController.addSong.bind(songController));
router.delete('/songs/:id', songController.deleteSong.bind(songController));

export default router;
