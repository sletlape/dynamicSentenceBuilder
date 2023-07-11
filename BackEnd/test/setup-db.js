const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
});

before(async () => {
    const client = await pool.connect();

    try {
        const wordTypesSql = fs.readFileSync(path.join(__dirname, '..', 'ddl', 'wordTypes.sql'), 'utf8');
        await client.query(wordTypesSql);
        const wordsSql = fs.readFileSync(path.join(__dirname, '..', 'ddl', 'words.sql'), 'utf8');
        await client.query(wordsSql);
        const sentencesSql = fs.readFileSync(path.join(__dirname, '..', 'ddl', 'sentences.sql'), 'utf8');
        await client.query(sentencesSql);

    } catch (err) {
        console.error('Error executing SQL scripts:', err);
    } finally {
        client.release();
    }
});

after(async () => {
    await pool.end();
});
