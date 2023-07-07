const { Client } = require('pg');

const dbClient = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB
})

dbClient.connect();
dbClient.query('select now()').then(
    res => console.log('Connected to the db \n' + res.rows[0].now)
);

module.exports = dbClient;