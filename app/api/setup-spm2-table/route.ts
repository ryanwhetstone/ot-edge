import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Create table
    await sql`
      CREATE TABLE IF NOT EXISTS spm2_assessments (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_date TIMESTAMP DEFAULT NOW(),
        responses JSONB NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes separately
    await sql`CREATE INDEX IF NOT EXISTS idx_spm2_client_id ON spm2_assessments(client_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_spm2_user_id ON spm2_assessments(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_spm2_uuid ON spm2_assessments(uuid)`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'SPM-2 assessments table created successfully' 
    });
  } catch (error) {
    console.error('Error creating SPM-2 table:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create SPM-2 table',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
