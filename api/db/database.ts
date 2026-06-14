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

export async function initDatabase(): Promise<void> {
  await db.read();
  
  if (!db.data.teams || db.data.teams.length === 0) {
    db.data.teams = mockTeams;
    db.data.songs = mockSongs;
    db.data.votes = [];
    db.data.comments = mockComments;
    await db.write();
    console.log('Database initialized with mock data');
  }
}

export async function saveDatabase(): Promise<void> {
  await db.write();
}
