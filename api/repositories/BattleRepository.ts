import { db, saveDatabase } from '../db/database.js';
import { BattleRecord } from '../../shared/types.js';

export class BattleRepository {
  async findAll(limit?: number): Promise<BattleRecord[]> {
    await db.read();
    const records = [...db.data.battleRecords];
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return limit ? records.slice(0, limit) : records;
  }

  async findBySongId(songId: number): Promise<BattleRecord[]> {
    await db.read();
    return db.data.battleRecords
      .filter(r => r.song1Id === songId || r.song2Id === songId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findByTeamId(teamId: number): Promise<BattleRecord[]> {
    await db.read();
    return db.data.battleRecords
      .filter(r => r.team1Id === teamId || r.team2Id === teamId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(record: Omit<BattleRecord, 'id' | 'createdAt'>): Promise<BattleRecord> {
    await db.read();
    const newRecord: BattleRecord = {
      ...record,
      id: Math.max(0, ...db.data.battleRecords.map(r => r.id)) + 1,
      createdAt: new Date().toISOString()
    };
    db.data.battleRecords.push(newRecord);
    await saveDatabase();
    return newRecord;
  }

  async getSongStats(songId: number): Promise<{ battleCount: number; battleWins: number; winRate: number }> {
    await db.read();
    const records = db.data.battleRecords.filter(r => r.song1Id === songId || r.song2Id === songId);
    const battleCount = records.length;
    const battleWins = records.filter(r => r.winnerSongId === songId).length;
    const winRate = battleCount > 0 ? battleWins / battleCount : 0;
    return { battleCount, battleWins, winRate };
  }

  async getTeamStats(teamId: number): Promise<{ totalBattles: number; totalWins: number; totalLosses: number; winRate: number }> {
    await db.read();
    const records = db.data.battleRecords.filter(r => r.team1Id === teamId || r.team2Id === teamId);
    const totalBattles = records.length;
    const totalWins = records.filter(r => {
      if (r.team1Id === teamId) return r.winnerSongId === r.song1Id;
      if (r.team2Id === teamId) return r.winnerSongId === r.song2Id;
      return false;
    }).length;
    const totalLosses = totalBattles - totalWins;
    const winRate = totalBattles > 0 ? totalWins / totalBattles : 0;
    return { totalBattles, totalWins, totalLosses, winRate };
  }
}
