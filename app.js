const express = require('express');
const app = express();
const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

const config = {
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DATABASE,
    max: 10, 
    idleTimeoutMillis: 30000, 
}

const pool = new pg.Pool(config);

pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
    console.log('Successfully connected to DB');
})

app.get('/rds-test', async (req,res) => {
    try{
        const result = await pool.query(`SELECT * FROM "test";`);
        res.send(result.rows);
    }
    catch(err) {
        console.log(`*** ERROR in DB QUERY: ${err}`)
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})

module.exports = pool;