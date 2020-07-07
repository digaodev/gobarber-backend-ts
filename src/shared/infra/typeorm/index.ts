import { createConnections } from 'typeorm';

async function initDatabase(): Promise<void> {
  try {
    await createConnections();
  } catch (error) {
    console.error('error', error);
    throw new Error('Unable to connect to the database');
  }
}

initDatabase();
