import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM registrations ORDER BY created_at DESC`;
      return response.status(200).json(result.rows);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        request.on('data', chunk => data += chunk);
        request.on('end', () => resolve(JSON.parse(data)));
        request.on('error', reject);
      });

      const { full_name, phone, business_name, region } = body;
      
      await sql`
        INSERT INTO registrations (full_name, phone, business_name, region)
        VALUES (${full_name}, ${phone}, ${business_name}, ${region})
      `;
      
      return response.status(200).json({ success: true, message: 'Registration submitted' });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        request.on('data', chunk => data += chunk);
        request.on('end', () => resolve(JSON.parse(data)));
        request.on('error', reject);
      });

      const { id } = body;
      await sql`DELETE FROM registrations WHERE id = ${id}`;
      return response.status(200).json({ success: true });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
