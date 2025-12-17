import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create evaluations table
    await sql`
      CREATE TABLE IF NOT EXISTS evaluations (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
        client_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT evaluations_client_id_clients_id_fk 
          FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        CONSTRAINT evaluations_user_id_users_id_fk 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_evaluations_client_id ON evaluations(client_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_evaluations_uuid ON evaluations(uuid)
    `;

    return NextResponse.json({
      success: true,
      message: 'Evaluations table created successfully'
    });
  } catch (error) {
    console.error('Evaluations table creation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Evaluations table creation failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
