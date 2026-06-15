import { Team, Song, BattlePair, VoteResponse, PaginatedResponse, TeamComment, CreateCommentRequest, CreateCommentResponse, DanceInvitation, CreateInvitationRequest, InvitationResponse, InvitationWithTeamNames, User, UserResponse, CreateUserRequest, VoteRecordWithDetails, TeamCommentWithTeam, TeamPost, TeamPostWithTeam, CreatePostRequest, PostResponse, ImportResult, TeamVideo, BattleRecord } from '../../shared/types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export const teamApi = {
  getTeams: (filters?: {
    district?: string;
    style?: string;
    memberCount?: string;
    hasVideo?: boolean;
    page?: number;
    pageSize?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.district) params.append('district', filters.district);
    if (filters?.style) params.append('style', filters.style);
    if (filters?.memberCount) params.append('memberCount', filters.memberCount);
    if (filters?.hasVideo) params.append('hasVideo', 'true');
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.pageSize !== undefined) params.append('pageSize', filters.pageSize.toString());
    
    return request<{ teams: Team[]; total: number; page: number; pageSize: number }>(`/teams?${params.toString()}`);
  },
  
  getTeamById: (id: number) => request<Team>(`/teams/${id}`),
  
  getTeamSongs: (teamId: number) => request<Song[]>(`/teams/${teamId}/songs`),
  
  createTeam: (data: Partial<Team>) => request<Team>('/teams', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateTeam: (id: number, data: Partial<Team>) => request<Team>(`/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  addSong: (teamId: number, data: Partial<Song>) => request<Song>(`/teams/${teamId}/songs`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  deleteSong: (id: number) => request<{ success: boolean }>(`/teams/songs/${id}`, {
    method: 'DELETE',
  }),

  importTeams: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch('/api/teams/import', {
      method: 'POST',
      body: formData,
    }).then(res => res.json()) as Promise<ImportResult>;
  },

  addVideo: (teamId: number, data: { title: string; url: string; thumbnail?: string }) => 
    request<{ success: boolean; video: TeamVideo }>(`/teams/${teamId}/videos`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateVideo: (teamId: number, videoId: number, data: Partial<TeamVideo>) =>
    request<{ success: boolean; video: TeamVideo }>(`/teams/${teamId}/videos/${videoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteVideo: (teamId: number, videoId: number) =>
    request<{ success: boolean; message: string }>(`/teams/${teamId}/videos/${videoId}`, {
      method: 'DELETE',
    }),
};

export const voteApi = {
  voteAddict: (songId: number, score: number, userId: number) => request<VoteResponse>('/votes/addict', {
    method: 'POST',
    body: JSON.stringify({ songId, score, userId }),
  }),
  
  voteCostume: (teamId: number, score: number, userId: number) => request<VoteResponse>('/votes/costume', {
    method: 'POST',
    body: JSON.stringify({ teamId, score, userId }),
  }),
};

export const userApi = {
  createUser: (data: CreateUserRequest) => request<UserResponse>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getUser: (id: number) => request<User>(`/users/${id}`),
  
  getUserVotes: (id: number) => request<VoteRecordWithDetails[]>(`/users/${id}/votes`),
  
  getUserComments: (id: number) => request<TeamCommentWithTeam[]>(`/users/${id}/comments`),
};

export const rankingApi = {
  getComprehensive: (limit?: number) => 
    request<Team[]>(`/ranking/comprehensive${limit ? `?limit=${limit}` : ''}`),
  
  getAddict: (limit?: number) => 
    request<(Song & { teamName: string })[]>(`/ranking/addict${limit ? `?limit=${limit}` : ''}`),
  
  getWeeklyAddict: (limit?: number) => 
    request<(Song & { teamName: string; weeklyAddictScore: number; weeklyAddictVotes: number })[]>(`/ranking/addict/weekly${limit ? `?limit=${limit}` : ''}`),
  
  getCostume: (limit?: number) => 
    request<Team[]>(`/ranking/costume${limit ? `?limit=${limit}` : ''}`),
};

export const mapApi = {
  getTeams: (district?: string, hasVideo?: boolean) => {
    const params = new URLSearchParams();
    if (district) params.append('district', district);
    if (hasVideo) params.append('hasVideo', 'true');
    const query = params.toString();
    return request<Team[]>(`/map/teams${query ? `?${query}` : ''}`);
  },
};

export const battleApi = {
  getPair: () => request<BattlePair>('/battle/pair'),
  recordResult: (data: { winnerSongId: number; loserSongId: number; winnerScore?: number; loserScore?: number }) => 
    request<{ success: boolean; record: BattleRecord }>('/battle/record', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSongRecords: (songId: number) => request<BattleRecord[]>(`/battle/song/${songId}`),
  getTeamRecords: (teamId: number) => request<BattleRecord[]>(`/battle/team/${teamId}`),
  getSongStats: (songId: number) => request<{ battleCount: number; battleWins: number; winRate: number }>(`/battle/song/${songId}/stats`),
  getTeamStats: (teamId: number) => request<{ totalBattles: number; totalWins: number; totalLosses: number; winRate: number }>(`/battle/team/${teamId}/stats`),
};

export const commentApi = {
  getTeamComments: (teamId: number) => request<TeamComment[]>(`/teams/${teamId}/comments`),
  
  createComment: (data: CreateCommentRequest) => request<CreateCommentResponse>(`/teams/${data.teamId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getTeamRating: (teamId: number) => request<{ avgRating: number; totalComments: number }>(`/teams/${teamId}/comments/rating`),
};

export const invitationApi = {
  getTeamInvitations: (teamId: number, type?: 'sent' | 'received' | 'pending' | 'completed') => {
    const params = type ? `?type=${type}` : '';
    return request<InvitationWithTeamNames[]>(`/invitations/team/${teamId}${params}`);
  },

  getPendingInvitations: (teamId: number) =>
    request<InvitationWithTeamNames[]>(`/invitations/team/${teamId}?type=pending`),

  getCompletedInvitations: (teamId: number) =>
    request<InvitationWithTeamNames[]>(`/invitations/team/${teamId}?type=completed`),

  createInvitation: (data: CreateInvitationRequest) =>
    request<InvitationResponse>('/invitations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  acceptInvitation: (id: number) =>
    request<InvitationResponse>(`/invitations/${id}/accept`, {
      method: 'PUT',
    }),

  rejectInvitation: (id: number) =>
    request<InvitationResponse>(`/invitations/${id}/reject`, {
      method: 'PUT',
    }),
};

export const postApi = {
  getPosts: (page?: number, pageSize?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (pageSize !== undefined) params.append('pageSize', pageSize.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ posts: TeamPostWithTeam[]; total: number; page: number; pageSize: number }>(`/posts${query}`);
  },

  getTeamPosts: (teamId: number) =>
    request<{ posts: TeamPost[] }>(`/posts/team/${teamId}`),

  createPost: (data: CreatePostRequest) =>
    request<PostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deletePost: (id: number) =>
    request<{ success: boolean; message?: string }>(`/posts/${id}`, {
      method: 'DELETE',
    }),
};
