import { create } from 'zustand';
import { Team, Song, BattlePair } from '../../shared/types';
import { teamApi, rankingApi, battleApi, mapApi, voteApi } from '../services/api';

interface FilterState {
  district: string;
  style: string;
  memberCount: string;
  setDistrict: (district: string) => void;
  setStyle: (style: string) => void;
  setMemberCount: (count: string) => void;
  resetFilters: () => void;
}

interface TeamState {
  teams: Team[];
  selectedTeam: Team | null;
  teamSongs: Song[];
  loading: boolean;
  error: string | null;
  fetchTeams: (filters?: { district?: string; style?: string; memberCount?: string }) => Promise<void>;
  fetchTeamById: (id: number) => Promise<void>;
  fetchTeamSongs: (teamId: number) => Promise<void>;
  clearSelectedTeam: () => void;
}

interface RankingState {
  comprehensiveRanking: Team[];
  addictRanking: (Song & { teamName: string })[];
  costumeRanking: Team[];
  loading: {
    comprehensive: boolean;
    addict: boolean;
    costume: boolean;
  };
  error: {
    comprehensive: string | null;
    addict: string | null;
    costume: string | null;
  };
  fetchComprehensiveRanking: (limit?: number) => Promise<void>;
  fetchAddictRanking: (limit?: number) => Promise<void>;
  fetchCostumeRanking: (limit?: number) => Promise<void>;
  fetchAllRankings: () => Promise<void>;
}

interface BattleState {
  battlePair: BattlePair | null;
  fetchBattlePair: () => Promise<void>;
  voteAddict: (songId: number, score: number) => Promise<{ success: boolean; message?: string }>;
}

interface MapState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: (district?: string) => Promise<void>;
}

export const useFilterStore = create<FilterState>((set) => ({
  district: '',
  style: '',
  memberCount: '',
  setDistrict: (district) => set({ district }),
  setStyle: (style) => set({ style }),
  setMemberCount: (memberCount) => set({ memberCount }),
  resetFilters: () => set({ district: '', style: '', memberCount: '' }),
}));

export const useTeamStore = create<TeamState>((set) => ({
  teams: [],
  selectedTeam: null,
  teamSongs: [],
  loading: false,
  error: null,
  
  fetchTeams: async (filters) => {
    set({ loading: true, error: null });
    try {
      const response = await teamApi.getTeams(filters);
      set({ teams: response.teams, loading: false });
    } catch (error) {
      set({ error: '获取舞队列表失败', loading: false });
    }
  },
  
  fetchTeamById: async (id) => {
    set({ loading: true, error: null });
    try {
      const team = await teamApi.getTeamById(id);
      set({ selectedTeam: team, loading: false });
    } catch (error) {
      set({ error: '获取舞队详情失败', loading: false });
    }
  },
  
  fetchTeamSongs: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const songs = await teamApi.getTeamSongs(teamId);
      set({ teamSongs: songs, loading: false });
    } catch (error) {
      set({ error: '获取歌单失败', loading: false });
    }
  },
  
  clearSelectedTeam: () => set({ selectedTeam: null, teamSongs: [] }),
}));

export const useRankingStore = create<RankingState>((set, get) => ({
  comprehensiveRanking: [],
  addictRanking: [],
  costumeRanking: [],
  loading: {
    comprehensive: false,
    addict: false,
    costume: false,
  },
  error: {
    comprehensive: null,
    addict: null,
    costume: null,
  },
  
  fetchComprehensiveRanking: async (limit) => {
    set({ loading: { ...get().loading, comprehensive: true }, error: { ...get().error, comprehensive: null } });
    try {
      const data = await rankingApi.getComprehensive(limit);
      set({ comprehensiveRanking: data, loading: { ...get().loading, comprehensive: false } });
    } catch (error) {
      set({ error: { ...get().error, comprehensive: '获取综合排行榜失败' }, loading: { ...get().loading, comprehensive: false } });
    }
  },
  
  fetchAddictRanking: async (limit) => {
    set({ loading: { ...get().loading, addict: true }, error: { ...get().error, addict: null } });
    try {
      const data = await rankingApi.getAddict(limit);
      set({ addictRanking: data, loading: { ...get().loading, addict: false } });
    } catch (error) {
      set({ error: { ...get().error, addict: '获取歌单排行榜失败' }, loading: { ...get().loading, addict: false } });
    }
  },
  
  fetchCostumeRanking: async (limit) => {
    set({ loading: { ...get().loading, costume: true }, error: { ...get().error, costume: null } });
    try {
      const data = await rankingApi.getCostume(limit);
      set({ costumeRanking: data, loading: { ...get().loading, costume: false } });
    } catch (error) {
      set({ error: { ...get().error, costume: '获取服装排行榜失败' }, loading: { ...get().loading, costume: false } });
    }
  },
  
  fetchAllRankings: async () => {
    await Promise.all([
      get().fetchComprehensiveRanking(),
      get().fetchAddictRanking(),
      get().fetchCostumeRanking(),
    ]);
  },
}));

export const useBattleStore = create<BattleState>((set) => ({
  battlePair: null,
  
  fetchBattlePair: async () => {
    try {
      const data = await battleApi.getPair();
      set({ battlePair: data });
    } catch (error) {
      console.error('获取PK对战失败', error);
    }
  },
  
  voteAddict: async (songId, score) => {
    try {
      const result = await voteApi.voteAddict(songId, score);
      if (result.success) {
        set((state) => {
          if (!state.battlePair) return state;
          const updatedPair = { ...state.battlePair };
          if (updatedPair.song1.id === songId) {
            updatedPair.song1 = { ...updatedPair.song1, addictScore: result.newScore, addictVotes: result.totalVotes };
          } else if (updatedPair.song2.id === songId) {
            updatedPair.song2 = { ...updatedPair.song2, addictScore: result.newScore, addictVotes: result.totalVotes };
          }
          return { battlePair: updatedPair };
        });
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '投票失败' };
    }
  },
}));

export const useMapStore = create<MapState>((set) => ({
  teams: [],
  loading: false,
  error: null,
  
  fetchTeams: async (district) => {
    set({ loading: true, error: null });
    try {
      const data = await mapApi.getTeams(district);
      set({ teams: data, loading: false });
    } catch (error) {
      set({ error: '获取地图舞队失败', loading: false });
    }
  },
}));
