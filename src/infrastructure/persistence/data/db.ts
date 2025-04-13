import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync(':memory:');

const initDatabase = `
CREATE TABLE IF NOT EXISTS topic (
  id TEXT NOT NULL,
  parentTopicId TEXT,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resource (
  id TEXT NOT NULL,
  topicId TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
`;

database.exec(initDatabase);

export default database;
