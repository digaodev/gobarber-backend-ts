import { createConnections } from 'typeorm';

async function initDatabase(): Promise<void> {
  try {
    await createConnections();
  } catch (error) {
    throw new Error('Unable to connect to the database');
  }
}

initDatabase();
