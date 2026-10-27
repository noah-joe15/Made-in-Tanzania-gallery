import { sql } from '@vercel/postgres';
import { put, del } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const result = await sql`SELECT * FROM gallery_products ORDER BY created_at DESC`;
      return response.status(200).json(result.rows);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === 'POST') {
    try {
      const contentType = request.headers['content-type'];
      
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
          const blob = await put(`${category}/${Date.now()}-${file.name}`, file, {
            access: 'public',
          });
          mediaUrl = blob.url;
        }

        await sql`
          INSERT INTO gallery_products (title_en, title_sw, category, description_en, description_sw, media_type, media_url)
          VALUES (${titleEn}, ${titleSw}, ${category}, ${descEn}, ${descSw}, ${mediaType}, ${mediaUrl})
        `;

        return response.status(200).json({ success: true });
      } else {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          request.on('data', chunk => data += chunk);
          request.on('end', () => resolve(JSON.parse(data)));
          request.on('error', reject);
        });

        await sql`
          INSERT INTO gallery_products (title_en, title_sw, category, description_en, description_sw, media_type, media_url)
          VALUES (${body.title_en}, ${body.title_sw}, ${body.category}, ${body.description_en}, ${body.description_sw}, ${body.media_type}, ${body.media_url})
        `;

        return response.status(200).json({ success: true });
      }
    } catch (error) {
      console.error('Error:', error);
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

      const { id, media_url, media_type } = body;

      if (media_type !== 'youtube' && media_url) {
        try {
          await del(media_url);
        } catch (e) {
          console.log('File deletion failed:', e);
        }
      }

      await sql`DELETE FROM gallery_products WHERE id = ${id}`;
      return response.status(200).json({ success: true });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
