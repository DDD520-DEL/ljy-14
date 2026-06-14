import { Team, Song, BattlePair, VoteResponse, PaginatedResponse } from '../../shared/types';

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
    page?: number;
    pageSize?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.district) params.append('district', filters.district);
    if (filters?.style) params.append('style', filters.style);
    if (filters?.memberCount) params.append('memberCount', filters.memberCount);
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
};

export const voteApi = {
  voteAddict: (songId: number, score: number) => request<VoteResponse>('/votes/addict', {
    method: 'POST',
    body: JSON.stringify({ songId, score }),
  }),
  
  voteCostume: (teamId: number, score: number) => request<VoteResponse>('/votes/costume', {
    method: 'POST',
    body: JSON.stringify({ teamId, score }),
  }),
};

export const rankingApi = {
  getComprehensive: (limit?: number) => 
    request<Team[]>(`/ranking/comprehensive${limit ? `?limit=${limit}` : ''}`),
  
  getAddict: (limit?: number) => 
    request<(Song & { teamName: string })[]>(`/ranking/addict${limit ? `?limit=${limit}` : ''}`),
  
  getCostume: (limit?: number) => 
    request<Team[]>(`/ranking/costume${limit ? `?limit=${limit}` : ''}`),
};

export const mapApi = {
  getTeams: (district?: string) => 
    request<Team[]>(`/map/teams${district ? `?district=${district}` : ''}`),
};

export const battleApi = {
  getPair: () => request<BattlePair>('/battle/pair'),
};
