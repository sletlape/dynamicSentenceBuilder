const { Client } = require('pg');

const dbClient = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB
})

dbClient.connect()
    .then(() => console.log('Connected to the database'))
    .catch((err) => console.error('Error connecting to the database:', err));

module.exports = dbClient;
