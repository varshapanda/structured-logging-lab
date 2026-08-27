const pino = require('pino');

const logger = pino({
  level: 'info',

  base: {
    service: 'orders-api'
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  formatters: {
    level(label) {
      return { level: label };
    }
  }
});

module.exports = logger;