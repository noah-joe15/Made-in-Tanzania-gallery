import { sql } from '@vercel/postgres';
import { put, del } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);

  if (request.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM gallery_products ORDER BY created_at DESC`;
      return new Response(JSON.stringify(result.rows), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type');
      
      if (contentType && contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const titleEn = formData.get('title_en');
        const titleSw = formData.get('title_sw');
        const category = formData.get('category');
        const descEn = formData.get('description_en');
        const descSw = formData.get('description_sw');
        const mediaType = formData.get('media_type');
        const file = formData.get('media_file');
        const youtubeUrl = formData.get('youtube_url');

        let mediaUrl = '';

        if (mediaType === 'youtube') {
          mediaUrl = youtubeUrl;
        } else if (file && file.size > 0) {
          const blob = await put(`${category}/${Date.now()}-${file.name}`, file, { access: 'public' });
          mediaUrl = blob.url;
        }

        await sql`
          INSERT INTO gallery_products (title_en, title_sw, category, description_en, description_sw, media_type, media_url)
          VALUES (${titleEn}, ${titleSw}, ${category}, ${descEn}, ${descSw}, ${mediaType}, ${mediaUrl})
        `;

        return new Response(JSON.stringify({ success: true }), { status: 200 });
      } else {
        const body = await request.json();
        await sql`
          INSERT INTO gallery_products (title_en, title_sw, category, description_en, description_sw, media_type, media_url)
          VALUES (${body.title_en}, ${body.title_sw}, ${body.category}, ${body.description_en}, ${body.description_sw}, ${body.media_type}, ${body.media_url})
        `;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const body = await request.json();
      const { id, media_url, media_type } = body;

      if (media_type !== 'youtube' && media_url) {
        try { await del(media_url); } catch (e) { console.log('File deletion failed:', e); }
      }

      await sql`DELETE FROM gallery_products WHERE id = ${id}`;
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
