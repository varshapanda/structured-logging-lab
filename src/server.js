const express = require('express');
const crypto = require('crypto');
const { connectDb } = require('./db');
const ordersRouter = require('./routes/orders');
const { processPayment } = require('./payment');
const logger = require('./logger');

const app = express();
const port = 3000;

app.use(express.json());

// Generate a unique request ID for every incoming request
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  req.log = logger.child({ reqId: req.id });

  next();
});

logger.info('server.starting');

connectDb();

app.get('/', (req, res) => {
  req.log.info('health.check');

  res.send('Orders API is running');
});

app.use('/orders', ordersRouter);

app.post('/payments', (req, res) => {
  req.log.info('payment.start');

  processPayment(req.log);

  res.send('Payment processed');
});

app.get('/simulate-error', (req, res) => {
  req.log.info('request.start');
  req.log.info('request.processing');

  req.log.error(
    { reason: 'simulated_failure' },
    'request.failed'
  );

  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  logger.info({ port }, 'server.started');
});