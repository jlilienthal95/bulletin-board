import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { Pool } from 'pg';
import { DB_URL } from '$env/static/private';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'notes.json');

export const _pool = new Pool({
	connectionString: DB_URL,
	ssl: { rejectUnauthorized: false } // Required for Neon
});


export async function GET() {
    const client = await _pool.connect();
    try {

        const res = await client.query('SELECT * FROM notes');
        
        const notesData = res.rows.map(note => ({
            id: note.id,
            noteText: note.notetext,
            color: note.color,
            coordinates: {
                x: note.x, y: note.y
            },
            tilt: note.tilt
        }));
        
        console.log('notesData:', notesData);    
        return new Response(JSON.stringify(notesData), {
            headers: {
                'Content-Type': 'application/json'
            } 
        })
    } catch (err) {
		return new Response(JSON.stringify({ error: 'Could not read notes.json. Error:', err }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	} finally {
        client.release();
    }
}

export async function POST({ request }) {
    console.log('post initiated');
    const { noteText, color, coordinates: {x, y}, tilt } = await request.json();
    // const { x, y } = coordinates;

    const client = await _pool.connect();
    const query = "INSERT into notes (noteText, color, x, y, tilt) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    const values = [noteText, color, x, y, tilt]

    try {
        const res = await client.query(query, values);
        return new Response(JSON.stringify(res.rows[0]), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error(err);
		return new Response('Error saving note', { status: 500 });
	} finally {
        client.release();
    }
}
