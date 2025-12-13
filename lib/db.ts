import { sql } from '@vercel/postgres';

export { sql };

// Example query function
export async function query(text: string, params?: any[]) {
  const result = await sql.query(text, params);
  return result;
}
