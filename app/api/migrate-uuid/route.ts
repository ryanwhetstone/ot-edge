import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Add UUID column to clients table
    await sql`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_clients_uuid ON clients(uuid)
    `;

    return NextResponse.json({
      success: true,
      message: 'UUID column added to clients table'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Migration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
