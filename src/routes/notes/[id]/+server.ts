import { _pool } from '../+server.js';

export async function PATCH({ params, request }) {
    console.log('attempting patch');

    const noteID = params.id;
    const { coordinates: {x, y} } = await request.json();

    const client = await _pool.connect();
    const query = `
        UPDATE notes
        SET x = $1,
            y = $2
        WHERE id = $3
        RETURNING *
    `
    const values = [x, y, noteID];

    try {
        const res = await client.query(query, values);
        console.log('res:', res.rows[0]);
        return new Response(JSON.stringify(res.rows[0]), {
            status: 200,
            headers: { 'Content-Type': 'applciation/json' }
        })
    } catch(err) {

        console.error(err);
        return new Response('Error saving note', { status: 500 })
    } finally {

        client.release();
    }
}