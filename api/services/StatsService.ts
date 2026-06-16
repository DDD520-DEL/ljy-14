import { db } from '../db/database.js';

export interface DistrictStats {
  district: string;
  count: number;
  percentage: number;
}

export interface DailyVoteStats {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalTeams: number;
  totalSongs: number;
  todayVotes: number;
  districtStats: DistrictStats[];
  last7DaysVotes: DailyVoteStats[];
}

export class StatsService {
  async getDashboardStats(): Promise<DashboardStats> {
    await db.read();

    const totalTeams = db.data.teams.length;
    const totalSongs = db.data.songs.length;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const todayVotes = db.data.votes.filter(v => {
      const voteDate = new Date(v.createdAt);
      return voteDate >= todayStart && voteDate < todayEnd;
    }).length;

    const districtCount: Record<string, number> = {};
    db.data.teams.forEach(team => {
      districtCount[team.district] = (districtCount[team.district] || 0) + 1;
    });
    const districtStats: DistrictStats[] = Object.entries(districtCount)
      .map(([district, count]) => ({
        district,
        count,
        percentage: Math.round((count / totalTeams) * 10000) / 100
      }))
      .sort((a, b) => b.count - a.count);

    const last7DaysVotes: DailyVoteStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      const count = db.data.votes.filter(v => {
        const voteDate = new Date(v.createdAt);
        return voteDate >= dayStart && voteDate < dayEnd;
      }).length;
      last7DaysVotes.push({ date: dateStr, count });
    }

    return {
      totalTeams,
      totalSongs,
      todayVotes,
      districtStats,
      last7DaysVotes
    };
  }
}
