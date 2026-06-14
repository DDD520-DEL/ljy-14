import { SongRepository } from '../repositories/SongRepository.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { Song, BattlePair } from '../../shared/types.js';

const songRepository = new SongRepository();
const teamRepository = new TeamRepository();

export class SongService {
  async getSongsByTeamId(teamId: number): Promise<Song[]> {
    return songRepository.findByTeamId(teamId);
  }

  async addSong(teamId: number, song: Omit<Song, 'id' | 'teamId' | 'createdAt' | 'addictScore' | 'addictVotes'>): Promise<Song> {
    return songRepository.create({ ...song, teamId });
  }

  async deleteSong(id: number): Promise<boolean> {
    return songRepository.delete(id);
  }

  async getAddictRanking(limit?: number): Promise<Song[]> {
    return songRepository.getAddictRanking(limit);
  }

  async getBattlePair(): Promise<BattlePair | null> {
    const pair = await songRepository.getRandomPair();
    if (!pair) return null;

    const [song1, song2] = pair;
    const team1 = await teamRepository.findById(song1.teamId);
    const team2 = await teamRepository.findById(song2.teamId);

    if (!team1 || !team2) return null;

    return { song1, song2, team1, team2 };
  }
}
