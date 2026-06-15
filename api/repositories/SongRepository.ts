import { db, saveDatabase } from '../db/database.js';
import { Song } from '../../shared/types.js';
import { VoteRepository } from './VoteRepository.js';

const voteRepository = new VoteRepository();

export class SongRepository {
  async findByTeamId(teamId: number): Promise<Song[]> {
    await db.read();
    return db.data.songs.filter(s => s.teamId === teamId);
  }

  async findById(id: number): Promise<Song | undefined> {
    await db.read();
    return db.data.songs.find(s => s.id === id);
  }

  async create(song: Omit<Song, 'id' | 'createdAt' | 'addictScore' | 'addictVotes' | 'battleCount' | 'battleWins'>): Promise<Song> {
    await db.read();
    const newSong: Song = {
      ...song,
      id: Math.max(0, ...db.data.songs.map(s => s.id)) + 1,
      addictScore: 0,
      addictVotes: 0,
      battleCount: 0,
      battleWins: 0,
      createdAt: new Date().toISOString()
    };
    db.data.songs.push(newSong);
    await saveDatabase();
    return newSong;
  }

  async delete(id: number): Promise<boolean> {
    await db.read();
    const index = db.data.songs.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    db.data.songs.splice(index, 1);
    await saveDatabase();
    return true;
  }

  async updateAddictScore(id: number, score: number, votes: number): Promise<void> {
    await db.read();
    const song = db.data.songs.find(s => s.id === id);
    if (song) {
      song.addictScore = score;
      song.addictVotes = votes;
      await saveDatabase();
    }
  }

  async incrementBattleWin(id: number): Promise<void> {
    await db.read();
    const song = db.data.songs.find(s => s.id === id);
    if (song) {
      song.battleCount += 1;
      song.battleWins += 1;
      await saveDatabase();
    }
  }

  async incrementBattleLoss(id: number): Promise<void> {
    await db.read();
    const song = db.data.songs.find(s => s.id === id);
    if (song) {
      song.battleCount += 1;
      await saveDatabase();
    }
  }

  async getAddictRanking(limit: number = 10): Promise<Song[]> {
    await db.read();
    const songs = [...db.data.songs];
    return songs
      .sort((a, b) => b.addictScore - a.addictScore)
      .slice(0, limit);
  }

  async getRandomPair(): Promise<[Song, Song] | null> {
    await db.read();
    const songs = [...db.data.songs];
    if (songs.length < 2) return null;
    
    const shuffled = songs.sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }

  async getWeeklyAddictRanking(limit: number = 10): Promise<(Song & { weeklyAddictScore: number; weeklyAddictVotes: number })[]> {
    await db.read();
    const songs = [...db.data.songs];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const songsWithWeeklyData = await Promise.all(
      songs.map(async (song) => {
        const { score, votes } = await voteRepository.getAverageScoreSince('addict', song.id, sevenDaysAgo);
        return {
          ...song,
          weeklyAddictScore: score,
          weeklyAddictVotes: votes
        };
      })
    );

    return songsWithWeeklyData
      .filter(s => s.weeklyAddictVotes > 0)
      .sort((a, b) => b.weeklyAddictScore - a.weeklyAddictScore)
      .slice(0, limit);
  }
}
