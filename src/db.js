const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'ordersdb',
  port: process.env.DB_PORT || 5432,
});

const connectDb = async () => {
  logger.info('db.connect.start');

  try {
    await pool.query('SELECT NOW()');

    logger.info('db.connect.success');
  } catch (err) {
    logger.error({ err }, 'db.connect.error');
    logger.warn('db.connect.retry');
  }
};

const queryDb = async (text, params, requestLogger = logger) => {
  requestLogger.info('db.query.start');

  try {
    const res = await pool.query(text, params);

    requestLogger.info('db.query.success');

    return res;
  } catch (err) {
    requestLogger.error({ err }, 'db.query.error');

    throw err;
  }
};

module.exports = { connectDb, queryDb, pool };