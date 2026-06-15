import { BattleRepository } from '../repositories/BattleRepository.js';
import { SongRepository } from '../repositories/SongRepository.js';
import { TeamRepository } from '../repositories/TeamRepository.js';
import { BattleRecord, Song, Team } from '../../shared/types.js';

const battleRepository = new BattleRepository();
const songRepository = new SongRepository();
const teamRepository = new TeamRepository();

export interface RecordBattleRequest {
  winnerSongId: number;
  loserSongId: number;
  winnerScore: number;
  loserScore: number;
}

export class BattleService {
  async getBattleRecords(limit?: number): Promise<BattleRecord[]> {
    return battleRepository.findAll(limit);
  }

  async getSongBattleRecords(songId: number): Promise<BattleRecord[]> {
    return battleRepository.findBySongId(songId);
  }

  async getTeamBattleRecords(teamId: number): Promise<BattleRecord[]> {
    return battleRepository.findByTeamId(teamId);
  }

  async recordBattleResult(request: RecordBattleRequest): Promise<BattleRecord | null> {
    const { winnerSongId, loserSongId, winnerScore, loserScore } = request;

    const winnerSong = await songRepository.findById(winnerSongId);
    const loserSong = await songRepository.findById(loserSongId);

    if (!winnerSong || !loserSong) {
      return null;
    }

    const winnerTeam = await teamRepository.findById(winnerSong.teamId);
    const loserTeam = await teamRepository.findById(loserSong.teamId);

    if (!winnerTeam || !loserTeam) {
      return null;
    }

    const record = await battleRepository.create({
      song1Id: winnerSongId,
      song2Id: loserSongId,
      song1Title: winnerSong.title,
      song2Title: loserSong.title,
      team1Id: winnerSong.teamId,
      team2Id: loserSong.teamId,
      team1Name: winnerTeam.name,
      team2Name: loserTeam.name,
      winnerSongId,
      song1Score: winnerScore,
      song2Score: loserScore
    });

    await songRepository.incrementBattleWin(winnerSongId);
    await songRepository.incrementBattleLoss(loserSongId);

    return record;
  }

  async getSongStats(songId: number): Promise<{ battleCount: number; battleWins: number; winRate: number }> {
    return battleRepository.getSongStats(songId);
  }

  async getTeamStats(teamId: number): Promise<{ totalBattles: number; totalWins: number; totalLosses: number; winRate: number }> {
    return battleRepository.getTeamStats(teamId);
  }
}
