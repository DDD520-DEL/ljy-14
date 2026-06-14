import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Team, Song, VoteRecord, TeamComment } from '../../shared/types.js';
import { mockTeams, mockSongs, mockComments } from './mockData.js';

export interface DatabaseSchema {
  teams: Team[];
  songs: Song[];
  votes: VoteRecord[];
  comments: TeamComment[];
}

const file = './data/db.json';
const adapter = new JSONFile<DatabaseSchema>(file);

const defaultData: DatabaseSchema = {
  teams: [],
  songs: [],
  votes: [],
  comments: []
};

export const db = new Low<DatabaseSchema>(adapter, defaultData);

function generateMockVotes(songs: Song[]): VoteRecord[] {
  const votes: VoteRecord[] = [];
  let voteId = 1;
  const now = new Date();

  songs.forEach((song) => {
    const totalVotes = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < totalVotes; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const voteDate = new Date(now);
      voteDate.setDate(voteDate.getDate() - daysAgo);
      voteDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      votes.push({
        id: voteId++,
        type: 'addict',
        targetId: song.id,
        userIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        score: Math.floor(Math.random() * 2) + 4,
        createdAt: voteDate.toISOString()
      });
    }
  });

  mockTeams.forEach((team) => {
    const totalVotes = Math.floor(Math.random() * 15) + 8;
    for (let i = 0; i < totalVotes; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const voteDate = new Date(now);
      voteDate.setDate(voteDate.getDate() - daysAgo);
      voteDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      votes.push({
        id: voteId++,
        type: 'costume',
        targetId: team.id,
        userIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        score: Math.floor(Math.random() * 2) + 4,
        createdAt: voteDate.toISOString()
      });
    }
  });

  return votes;
}

export async function initDatabase(): Promise<void> {
  await db.read();
  
  if (!db.data.teams || db.data.teams.length === 0) {
    db.data.teams = mockTeams;
    db.data.songs = mockSongs;
    db.data.votes = generateMockVotes(mockSongs);
    db.data.comments = mockComments;
    await db.write();
    console.log('Database initialized with mock data');
  }
}

export async function saveDatabase(): Promise<void> {
  await db.write();
}
