import { create } from 'zustand';
import { Team, Song, BattlePair, TeamComment, CreateCommentRequest, InvitationWithTeamNames, CreateInvitationRequest } from '../../shared/types';
import { teamApi, rankingApi, battleApi, mapApi, voteApi, commentApi, invitationApi } from '../services/api';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  teamComments: TeamComment[];
  commentsLoading: boolean;
  commentsError: string | null;
  loading: boolean;
  error: string | null;
  pendingInvitations: InvitationWithTeamNames[];
  completedInvitations: InvitationWithTeamNames[];
  invitationsLoading: boolean;
  invitationsError: string | null;
  fetchTeams: (filters?: { district?: string; style?: string; memberCount?: string }) => Promise<void>;
  fetchTeamById: (id: number) => Promise<void>;
  fetchTeamSongs: (teamId: number) => Promise<void>;
  fetchTeamComments: (teamId: number) => Promise<void>;
  fetchPendingInvitations: (teamId: number) => Promise<void>;
  fetchCompletedInvitations: (teamId: number) => Promise<void>;
  createInvitation: (data: CreateInvitationRequest) => Promise<{ success: boolean; message?: string }>;
  acceptInvitation: (invitationId: number, teamId: number) => Promise<{ success: boolean; message?: string }>;
  rejectInvitation: (invitationId: number, teamId: number) => Promise<{ success: boolean; message?: string }>;
  addTeamComment: (data: CreateCommentRequest) => Promise<{ success: boolean; message?: string }>;
  clearSelectedTeam: () => void;
}

interface RankingState {
  comprehensiveRanking: Team[];
  addictRanking: (Song & { teamName: string })[];
  weeklyAddictRanking: (Song & { teamName: string; weeklyAddictScore: number; weeklyAddictVotes: number })[];
  costumeRanking: Team[];
  loading: {
    comprehensive: boolean;
    addict: boolean;
    weeklyAddict: boolean;
    costume: boolean;
  };
  error: {
    comprehensive: string | null;
    addict: string | null;
    weeklyAddict: string | null;
    costume: string | null;
  };
  fetchComprehensiveRanking: (limit?: number) => Promise<void>;
  fetchAddictRanking: (limit?: number) => Promise<void>;
  fetchWeeklyAddictRanking: (limit?: number) => Promise<void>;
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
  teamComments: [],
  commentsLoading: false,
  commentsError: null,
  loading: false,
  error: null,
  pendingInvitations: [],
  completedInvitations: [],
  invitationsLoading: false,
  invitationsError: null,
  
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
  
  fetchTeamComments: async (teamId) => {
    set({ commentsLoading: true, commentsError: null });
    try {
      const comments = await commentApi.getTeamComments(teamId);
      set({ teamComments: comments, commentsLoading: false });
    } catch (error) {
      set({ commentsError: '获取评论列表失败', commentsLoading: false });
    }
  },
  
  addTeamComment: async (data) => {
    try {
      const result = await commentApi.createComment(data);
      if (result.success && result.comment) {
        set((state) => ({
          teamComments: [result.comment!, ...state.teamComments]
        }));
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '发布留言失败' };
    }
  },

  fetchPendingInvitations: async (teamId) => {
    set({ invitationsLoading: true, invitationsError: null });
    try {
      const invitations = await invitationApi.getPendingInvitations(teamId);
      set({ pendingInvitations: invitations, invitationsLoading: false });
    } catch (error) {
      set({ invitationsError: '获取待处理约舞失败', invitationsLoading: false });
    }
  },

  fetchCompletedInvitations: async (teamId) => {
    set({ invitationsLoading: true, invitationsError: null });
    try {
      const invitations = await invitationApi.getCompletedInvitations(teamId);
      set({ completedInvitations: invitations, invitationsLoading: false });
    } catch (error) {
      set({ invitationsError: '获取已完成约舞失败', invitationsLoading: false });
    }
  },

  createInvitation: async (data) => {
    try {
      const result = await invitationApi.createInvitation(data);
      if (result.success && result.invitation) {
        set((state) => ({
          pendingInvitations: [...state.pendingInvitations, {
            ...result.invitation!,
            fromTeamName: state.teams.find(t => t.id === data.fromTeamId)?.name || '',
            toTeamName: state.teams.find(t => t.id === data.toTeamId)?.name || ''
          }]
        }));
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '发送约舞邀请失败' };
    }
  },

  acceptInvitation: async (invitationId, teamId) => {
    try {
      const result = await invitationApi.acceptInvitation(invitationId);
      if (result.success) {
        set((state) => {
          const updatedInvitation = result.invitation!;
          const pendingIdx = state.pendingInvitations.findIndex(i => i.id === invitationId);
          const newPending = pendingIdx !== -1 
            ? [...state.pendingInvitations.slice(0, pendingIdx), ...state.pendingInvitations.slice(pendingIdx + 1)]
            : state.pendingInvitations;
          const newCompleted = [{ ...updatedInvitation,
            fromTeamName: state.pendingInvitations.find(i => i.id === invitationId)?.fromTeamName || '',
            toTeamName: state.pendingInvitations.find(i => i.id === invitationId)?.toTeamName || ''
          }, ...state.completedInvitations];
          return { pendingInvitations: newPending, completedInvitations: newCompleted };
        });
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '接受邀请失败' };
    }
  },

  rejectInvitation: async (invitationId, teamId) => {
    try {
      const result = await invitationApi.rejectInvitation(invitationId);
      if (result.success) {
        set((state) => {
          const updatedInvitation = result.invitation!;
          const pendingIdx = state.pendingInvitations.findIndex(i => i.id === invitationId);
          const newPending = pendingIdx !== -1 
            ? [...state.pendingInvitations.slice(0, pendingIdx), ...state.pendingInvitations.slice(pendingIdx + 1)]
            : state.pendingInvitations;
          const newCompleted = [{ ...updatedInvitation,
            fromTeamName: state.pendingInvitations.find(i => i.id === invitationId)?.fromTeamName || '',
            toTeamName: state.pendingInvitations.find(i => i.id === invitationId)?.toTeamName || ''
          }, ...state.completedInvitations];
          return { pendingInvitations: newPending, completedInvitations: newCompleted };
        });
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '拒绝邀请失败' };
    }
  },
  
  clearSelectedTeam: () => set({ selectedTeam: null, teamSongs: [], teamComments: [], pendingInvitations: [], completedInvitations: [] }),
}));

export const useRankingStore = create<RankingState>((set, get) => ({
  comprehensiveRanking: [],
  addictRanking: [],
  weeklyAddictRanking: [],
  costumeRanking: [],
  loading: {
    comprehensive: false,
    addict: false,
    weeklyAddict: false,
    costume: false,
  },
  error: {
    comprehensive: null,
    addict: null,
    weeklyAddict: null,
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
  
  fetchWeeklyAddictRanking: async (limit) => {
    set({ loading: { ...get().loading, weeklyAddict: true }, error: { ...get().error, weeklyAddict: null } });
    try {
      const data = await rankingApi.getWeeklyAddict(limit);
      set({ weeklyAddictRanking: data, loading: { ...get().loading, weeklyAddict: false } });
    } catch (error) {
      set({ error: { ...get().error, weeklyAddict: '获取本周热门排行榜失败' }, loading: { ...get().loading, weeklyAddict: false } });
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
      get().fetchWeeklyAddictRanking(),
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

interface FavoriteState {
  favoriteIds: number[];
  toggleFavorite: (teamId: number) => void;
  isFavorite: (teamId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (teamId) => {
        const { favoriteIds } = get();
        if (favoriteIds.includes(teamId)) {
          set({ favoriteIds: favoriteIds.filter((id) => id !== teamId) });
        } else {
          set({ favoriteIds: [...favoriteIds, teamId] });
        }
      },
      isFavorite: (teamId) => get().favoriteIds.includes(teamId),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'team-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
