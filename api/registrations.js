import { sql } from '@vercel/postgres';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
      return new Response(JSON.stringify(result.rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { full_name, phone, business_name, region } = body;
      
      await sql`
        INSERT INTO registrations (full_name, phone, business_name, region)
        VALUES (${full_name}, ${phone}, ${business_name}, ${region})
      `;
      
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const body = await request.json();
      const { id } = body;
      await sql`DELETE FROM registrations WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
