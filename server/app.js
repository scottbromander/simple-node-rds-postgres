const express = require('express');
const app = express();
const pg = require('pg');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('server/public'));

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

app.post('/add-item', async (req,res) => {
    try{
        const result = await pool.query(`INSERT INTO "test" ("name") VALUES ($1);`, [req.body.input]);
        res.sendStatus(200);
    }
    catch(err) {
        console.warn(`*** ERROR in DB QUERY: ${err}`)
        res.sendStatus(500);
    }
})

app.get('/rds-test',  (req,res) => {
        pool.query(`SELECT * FROM "test";`)
        .then(response => {
            res.send(response.rows);
        })
        .catch(err => {
            res.sendStatus(500);
        })
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})

module.exports = pool;