import { create } from 'zustand';
import { Team, Song, BattlePair, TeamComment, CreateCommentRequest, InvitationWithTeamNames, CreateInvitationRequest, User, VoteRecordWithDetails, TeamCommentWithTeam, TeamPost, TeamPostWithTeam, CreatePostRequest, TeamFriendshipWithDetails, CreateFriendshipRequest, Notification, CheckInStatus, CheckInRecord } from '../../shared/types';
import { teamApi, rankingApi, battleApi, mapApi, voteApi, commentApi, invitationApi, userApi, postApi, friendshipApi, notificationApi, favoriteApi, checkInApi } from '../services/api';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FilterState {
  district: string;
  style: string;
  memberCount: string;
  hasVideo: boolean;
  setDistrict: (district: string) => void;
  setStyle: (style: string) => void;
  setMemberCount: (count: string) => void;
  setHasVideo: (hasVideo: boolean) => void;
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
  teamBattleStats: { totalBattles: number; totalWins: number; totalLosses: number; winRate: number } | null;
  fetchTeams: (filters?: { district?: string; style?: string; memberCount?: string; hasVideo?: boolean }) => Promise<void>;
  fetchTeamById: (id: number) => Promise<void>;
  fetchTeamSongs: (teamId: number) => Promise<void>;
  fetchTeamComments: (teamId: number) => Promise<void>;
  fetchPendingInvitations: (teamId: number) => Promise<void>;
  fetchCompletedInvitations: (teamId: number) => Promise<void>;
  fetchTeamBattleStats: (teamId: number) => Promise<void>;
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
  voteAddict: (songId: number, score: number, userId: number) => Promise<{ success: boolean; message?: string }>;
  recordBattleResult: (winnerSongId: number, loserSongId: number, winnerScore: number, loserScore: number) => Promise<{ success: boolean; message?: string }>;
}

interface MapState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: (district?: string, hasVideo?: boolean) => Promise<void>;
}

interface PostState {
  posts: TeamPostWithTeam[];
  teamPosts: TeamPost[];
  loading: boolean;
  error: string | null;
  total: number;
  fetchPosts: (page?: number, pageSize?: number) => Promise<void>;
  fetchTeamPosts: (teamId: number) => Promise<void>;
  createPost: (data: CreatePostRequest) => Promise<{ success: boolean; message?: string }>;
  deletePost: (id: number) => Promise<{ success: boolean; message?: string }>;
}

interface FriendshipState {
  friendships: TeamFriendshipWithDetails[];
  teamFriendships: TeamFriendshipWithDetails[];
  allFriendships: TeamFriendshipWithDetails[];
  loading: boolean;
  error: string | null;
  fetchTeamFriendships: (teamId: number) => Promise<void>;
  fetchAllFriendships: () => Promise<void>;
  createFriendship: (data: CreateFriendshipRequest) => Promise<{ success: boolean; message?: string }>;
  deleteFriendship: (id: number) => Promise<{ success: boolean; message?: string }>;
}

export const useFilterStore = create<FilterState>((set) => ({
  district: '',
  style: '',
  memberCount: '',
  hasVideo: false,
  setDistrict: (district) => set({ district }),
  setStyle: (style) => set({ style }),
  setMemberCount: (memberCount) => set({ memberCount }),
  setHasVideo: (hasVideo) => set({ hasVideo }),
  resetFilters: () => set({ district: '', style: '', memberCount: '', hasVideo: false }),
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
  teamBattleStats: null,
  
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

  fetchTeamBattleStats: async (teamId) => {
    try {
      const stats = await battleApi.getTeamStats(teamId);
      set({ teamBattleStats: stats });
    } catch (error) {
      console.error('获取舞队PK统计失败', error);
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
  
  clearSelectedTeam: () => set({ selectedTeam: null, teamSongs: [], teamComments: [], pendingInvitations: [], completedInvitations: [], teamBattleStats: null }),
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

export const useBattleStore = create<BattleState>((set, get) => ({
  battlePair: null,
  
  fetchBattlePair: async () => {
    try {
      const data = await battleApi.getPair();
      set({ battlePair: data });
    } catch (error) {
      console.error('获取PK对战失败', error);
    }
  },
  
  voteAddict: async (songId, score, userId) => {
    try {
      const result = await voteApi.voteAddict(songId, score, userId);
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

  recordBattleResult: async (winnerSongId, loserSongId, winnerScore, loserScore) => {
    try {
      const result = await battleApi.recordResult({ winnerSongId, loserSongId, winnerScore, loserScore });
      if (result.success) {
        set((state) => {
          if (!state.battlePair) return state;
          const updatedPair = { ...state.battlePair };
          if (updatedPair.song1.id === winnerSongId) {
            updatedPair.song1 = { 
              ...updatedPair.song1, 
              battleCount: updatedPair.song1.battleCount + 1,
              battleWins: updatedPair.song1.battleWins + 1
            };
            updatedPair.song2 = { 
              ...updatedPair.song2, 
              battleCount: updatedPair.song2.battleCount + 1
            };
          } else if (updatedPair.song2.id === winnerSongId) {
            updatedPair.song2 = { 
              ...updatedPair.song2, 
              battleCount: updatedPair.song2.battleCount + 1,
              battleWins: updatedPair.song2.battleWins + 1
            };
            updatedPair.song1 = { 
              ...updatedPair.song1, 
              battleCount: updatedPair.song1.battleCount + 1
            };
          }
          return { battlePair: updatedPair };
        });
      }
      return { success: result.success, message: result.success ? 'PK结果已记录' : '记录失败' };
    } catch (error) {
      return { success: false, message: '记录PK结果失败' };
    }
  },
}));

export const useMapStore = create<MapState>((set) => ({
  teams: [],
  loading: false,
  error: null,
  
  fetchTeams: async (district, hasVideo) => {
    set({ loading: true, error: null });
    try {
      const data = await mapApi.getTeams(district, hasVideo);
      set({ teams: data, loading: false });
    } catch (error) {
      set({ error: '获取地图舞队失败', loading: false });
    }
  },
}));

interface FavoriteState {
  favoriteIds: number[];
  toggleFavorite: (teamId: number, userId?: number) => Promise<void>;
  isFavorite: (teamId: number) => boolean;
  clearFavorites: () => void;
  syncToServer: (userId: number) => Promise<void>;
  loadFromServer: (userId: number) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: async (teamId, userId) => {
        const { favoriteIds } = get();
        const wasFavorited = favoriteIds.includes(teamId);
        const optimisticIds = wasFavorited
          ? favoriteIds.filter((id) => id !== teamId)
          : [...favoriteIds, teamId];
        set({ favoriteIds: optimisticIds });

        if (!userId) return;

        try {
          const result = await favoriteApi.toggleFavorite(userId, teamId);
          const serverFavorited = result.favorited;
          if (serverFavorited !== !wasFavorited) {
            const finalIds = serverFavorited
              ? [...new Set([...get().favoriteIds, teamId])]
              : get().favoriteIds.filter((id) => id !== teamId);
            set({ favoriteIds: finalIds });
          }
        } catch (error) {
          console.error('切换收藏失败，回滚状态', error);
          set({ favoriteIds: wasFavorited ? [...favoriteIds] : favoriteIds });
        }
      },
      isFavorite: (teamId) => get().favoriteIds.includes(teamId),
      clearFavorites: () => set({ favoriteIds: [] }),
      syncToServer: async (userId) => {
        try {
          await favoriteApi.syncFavorites(userId, get().favoriteIds);
        } catch (error) {
          console.error('同步收藏到服务器失败', error);
        }
      },
      loadFromServer: async (userId) => {
        try {
          const result = await favoriteApi.getFavoriteTeamIds(userId);
          set({ favoriteIds: result.teamIds });
        } catch (error) {
          console.error('从服务器加载收藏失败', error);
        }
      },
    }),
    {
      name: 'team-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface UserState {
  user: User | null;
  userVotes: VoteRecordWithDetails[];
  userComments: TeamCommentWithTeam[];
  showNicknameModal: boolean;
  loading: boolean;
  error: string | null;
  setShowNicknameModal: (show: boolean) => void;
  loginOrRegister: (nickname: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  fetchUserVotes: () => Promise<void>;
  fetchUserComments: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      userVotes: [],
      userComments: [],
      showNicknameModal: false,
      loading: false,
      error: null,
      
      setShowNicknameModal: (show) => set({ showNicknameModal: show }),
      
      loginOrRegister: async (nickname) => {
        set({ loading: true, error: null });
        try {
          const result = await userApi.createUser({ nickname });
          if (result.success && result.user) {
            set({ user: result.user, loading: false, showNicknameModal: false });
            return { success: true, message: result.message };
          }
          set({ loading: false, error: result.message });
          return { success: false, message: result.message };
        } catch (error) {
          set({ loading: false, error: '登录失败，请重试' });
          return { success: false, message: '登录失败，请重试' };
        }
      },
      
      logout: () => {
        set({ user: null, userVotes: [], userComments: [] });
      },
      
      fetchUserVotes: async () => {
        const { user } = get();
        if (!user) return;
        try {
          const votes = await userApi.getUserVotes(user.id);
          set({ userVotes: votes });
        } catch (error) {
          console.error('获取用户投票记录失败', error);
        }
      },
      
      fetchUserComments: async () => {
        const { user } = get();
        if (!user) return;
        try {
          const comments = await userApi.getUserComments(user.id);
          set({ userComments: comments });
        } catch (error) {
          console.error('获取用户留言记录失败', error);
        }
      },
    }),
    {
      name: 'user-info',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  teamPosts: [],
  loading: false,
  error: null,
  total: 0,

  fetchPosts: async (page, pageSize) => {
    set({ loading: true, error: null });
    try {
      const result = await postApi.getPosts(page, pageSize);
      set({ posts: result.posts, total: result.total, loading: false });
    } catch (error) {
      set({ error: '获取动态列表失败', loading: false });
    }
  },

  fetchTeamPosts: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const result = await postApi.getTeamPosts(teamId);
      set({ teamPosts: result.posts, loading: false });
    } catch (error) {
      set({ error: '获取舞队动态失败', loading: false });
    }
  },

  createPost: async (data) => {
    try {
      const result = await postApi.createPost(data);
      if (result.success && result.post) {
        await get().fetchPosts();
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '发布动态失败' };
    }
  },

  deletePost: async (id) => {
    try {
      const result = await postApi.deletePost(id);
      if (result.success) {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        }));
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '删除动态失败' };
    }
  },
}));

export const useFriendshipStore = create<FriendshipState>((set, get) => ({
  friendships: [],
  teamFriendships: [],
  allFriendships: [],
  loading: false,
  error: null,

  fetchTeamFriendships: async (teamId) => {
    set({ loading: true, error: null });
    try {
      const data = await friendshipApi.getFriendshipsByTeamId(teamId);
      set({ teamFriendships: data, loading: false });
    } catch (error) {
      set({ error: '获取友好关系失败', loading: false });
    }
  },

  fetchAllFriendships: async () => {
    set({ loading: true, error: null });
    try {
      const data = await friendshipApi.getAllFriendships();
      set({ allFriendships: data, loading: false });
    } catch (error) {
      set({ error: '获取友好关系图谱失败', loading: false });
    }
  },

  createFriendship: async (data) => {
    try {
      const result = await friendshipApi.createFriendship(data);
      if (result.success) {
        await get().fetchTeamFriendships(data.teamId1);
        await get().fetchAllFriendships();
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '建立友好关系失败' };
    }
  },

  deleteFriendship: async (id) => {
    try {
      const result = await friendshipApi.deleteFriendship(id);
      if (result.success) {
        set((state) => ({
          teamFriendships: state.teamFriendships.filter(f => f.id !== id),
          allFriendships: state.allFriendships.filter(f => f.id !== id),
        }));
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '解除友好关系失败' };
    }
  },
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (userId: number) => Promise<void>;
  fetchUnreadCount: (userId: number) => Promise<void>;
  markAsRead: (id: number, userId: number) => Promise<void>;
  markAllAsRead: (userId: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (userId) => {
    set({ loading: true, error: null });
    try {
      const result = await notificationApi.getNotifications(userId);
      set({ notifications: result.notifications, loading: false });
    } catch (error) {
      set({ error: '获取通知列表失败', loading: false });
    }
  },

  fetchUnreadCount: async (userId) => {
    try {
      const result = await notificationApi.getUnreadCount(userId);
      set({ unreadCount: result.count });
    } catch (error) {
      console.error('获取未读通知数量失败', error);
    }
  },

  markAsRead: async (id, userId) => {
    try {
      await notificationApi.markAsRead(id, userId);
      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('标记通知已读失败', error);
    }
  },

  markAllAsRead: async (userId) => {
    try {
      await notificationApi.markAllAsRead(userId);
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('标记全部已读失败', error);
    }
  },
}));

interface CheckInState {
  status: CheckInStatus | null;
  records: CheckInRecord[];
  monthRecords: CheckInRecord[];
  loading: boolean;
  error: string | null;
  fetchStatus: (userId: number) => Promise<void>;
  fetchRecords: (userId: number) => Promise<void>;
  fetchMonthRecords: (userId: number, year: number, month: number) => Promise<void>;
  doCheckIn: (userId: number) => Promise<{ success: boolean; message?: string }>;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  status: null,
  records: [],
  monthRecords: [],
  loading: false,
  error: null,

  fetchStatus: async (userId) => {
    try {
      const status = await checkInApi.getStatus(userId);
      set({ status });
    } catch (error) {
      console.error('获取签到状态失败', error);
    }
  },

  fetchRecords: async (userId) => {
    set({ loading: true, error: null });
    try {
      const result = await checkInApi.getRecords(userId);
      set({ records: result.records, loading: false });
    } catch (error) {
      set({ error: '获取签到记录失败', loading: false });
    }
  },

  fetchMonthRecords: async (userId, year, month) => {
    try {
      const result = await checkInApi.getMonthRecords(userId, year, month);
      set({ monthRecords: result.records });
    } catch (error) {
      console.error('获取月度签到记录失败', error);
    }
  },

  doCheckIn: async (userId) => {
    try {
      const result = await checkInApi.checkIn(userId);
      if (result.success && result.status) {
        set((state) => ({
          status: result.status!,
          records: result.record
            ? [result.record!, ...state.records]
            : state.records,
          monthRecords: result.record
            ? [result.record!, ...state.monthRecords]
            : state.monthRecords,
        }));
      }
      return { success: result.success, message: result.message };
    } catch (error) {
      return { success: false, message: '签到失败' };
    }
  },
}));
