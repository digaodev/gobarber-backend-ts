import { createConnection } from 'typeorm';

async function initDatabase(): Promise<void> {
  try {
    await createConnection();
  } catch (error) {
    throw new Error('Unable to connect to the database');
  }
}

initDatabase();
