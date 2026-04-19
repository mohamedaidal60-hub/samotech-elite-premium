import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_DB1xcyzek5Na@ep-misty-pine-an7v9or4-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function init() {
  try {
    console.log('Creating tables...');
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
    console.log('Tables created successfully');
  } catch (e) {
    console.error(e);
  }
}

init();
