var pg = require('pg');

const connectionString = process.env.DATABASE_URL
const Pool = pg.Pool
const pool = new Pool({
    connectionString,
    ssl: {
        require: true, 
        rejectUnauthorized: false
    },
    max: 1
})

module.exports = pool;
