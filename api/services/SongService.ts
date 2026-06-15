import { SongRepository } from '../repositories/SongRepository.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { NotificationService } from '../services/NotificationService.js';
import { UserFavoriteRepository } from '../repositories/UserFavoriteRepository.js';
import { Song, BattlePair } from '../../shared/types.js';

const songRepository = new SongRepository();
const teamRepository = new TeamRepository();
const notificationService = new NotificationService();
const userFavoriteRepository = new UserFavoriteRepository();

export class SongService {
  async getSongsByTeamId(teamId: number): Promise<Song[]> {
    return songRepository.findByTeamId(teamId);
  }

  async addSong(teamId: number, song: Omit<Song, 'id' | 'teamId' | 'createdAt' | 'addictScore' | 'addictVotes'>): Promise<Song> {
    const newSong = await songRepository.create({ ...song, teamId });

    const team = await teamRepository.findById(teamId);
    if (team) {
      const followerUserIds = await userFavoriteRepository.findFollowerUserIds(teamId);
      if (followerUserIds.length > 0) {
        await notificationService.notifyFollowers(
          teamId,
          team.name,
          team.avatar,
          newSong.id,
          newSong.title,
          followerUserIds
        );
      }
    }

    return newSong;
  }

  async deleteSong(id: number): Promise<boolean> {
    return songRepository.delete(id);
  }

  async getAddictRanking(limit?: number): Promise<Song[]> {
    return songRepository.getAddictRanking(limit);
  }

  async getWeeklyAddictRanking(limit?: number): Promise<(Song & { weeklyAddictScore: number; weeklyAddictVotes: number })[]> {
    return songRepository.getWeeklyAddictRanking(limit);
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
