import sql from './db';

async function initDb() {
  try {
    console.log('Initializing database tables...');

    // Create partners table
    await sql`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        prenom TEXT NOT NULL,
        nom TEXT NOT NULL,
        entite TEXT NOT NULL,
        services TEXT[] NOT NULL,
        langues TEXT[] NOT NULL,
        positions INTEGER NOT NULL,
        mail TEXT NOT NULL,
        telephone TEXT NOT NULL,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Partners table ready');

    // Create candidates table
    await sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        prenom TEXT NOT NULL,
        nom TEXT NOT NULL,
        mail TEXT NOT NULL,
        telephone TEXT NOT NULL,
        adresse TEXT,
        langues TEXT[] NOT NULL,
        ai_transcription TEXT,
        selfie TEXT,
        test_score INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Candidates table ready');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export { initDb };
