const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}


// Create a logger factory function
const createLogger = (logType, options = {}) => {
  const defaultOptions = {
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { 
      service: 'overclocked-api', 
      logType: logType 
    }
  };

  const config = { ...defaultOptions, ...options };
  
  return winston.createLogger({
    level: config.level,
    format: config.format,
    defaultMeta: config.defaultMeta,
    transports: [
      new winston.transports.File({ 
        filename: path.join(logsDir, `${logType}.log`), 
        level: config.level,
        maxsize: config.maxsize,
        maxFiles: config.maxFiles,
      }),
    ],
  });
};

// Main logger for general application logs
const logger = createLogger('general', {
  maxFiles: 5,
  defaultMeta: { service: 'overclocked-api', logType: 'general' }
});

// Payment logs - all payment-related activities
const paymentLogger = createLogger('payments', {
  maxFiles: 10,
  defaultMeta: { service: 'overclocked-api', logType: 'payments' }
});

// User authentication logs - login, signup, logout
const authLogger = createLogger('auth', {
  maxFiles: 5,
  defaultMeta: { service: 'overclocked-api', logType: 'auth' }
});

// Order logs - order creation, updates, retrieval
const orderLogger = createLogger('orders', {
  maxFiles: 10,
  defaultMeta: { service: 'overclocked-api', logType: 'orders' }
});

// Product management logs
const productLogger = createLogger('products', {
  maxFiles: 10,
  defaultMeta: { service: 'overclocked-api', logType: 'products' }
});

// Error logs
const errorLogger = createLogger('errors', {
  level: 'error',
  maxFiles: 5,
  defaultMeta: { service: 'overclocked-api', logType: 'errors' }
});

// Security logs - security events, failed attempts
const securityLogger = createLogger('security', {
  maxFiles: 5,
  defaultMeta: { service: 'overclocked-api', logType: 'security' }
});

// API logs - API requests and responses
const apiLogger = createLogger('api', {
  maxFiles: 5,
  defaultMeta: { service: 'overclocked-api', logType: 'api' }
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  );

  // Add console transport to all loggers for development
  [logger, paymentLogger, authLogger, orderLogger, productLogger, errorLogger, securityLogger, apiLogger].forEach(log => {
    log.add(new winston.transports.Console({
      format: consoleFormat
    }));
  });
}

// Helper functions for easy logging
const logPayment = (level, message, meta = {}) => {
  paymentLogger.log(level, message, { ...meta, logType: 'payments' });
};

const logAuth = (level, message, meta = {}) => {
  authLogger.log(level, message, { ...meta, logType: 'auth' });
};

const logOrder = (level, message, meta = {}) => {
  orderLogger.log(level, message, { ...meta, logType: 'orders' });
};

const logProduct = (level, message, meta = {}) => {
  productLogger.log(level, message, { ...meta, logType: 'products' });
};

const logError = (level, message, meta = {}) => {
  errorLogger.log(level, message, { ...meta, logType: 'errors' });
  // Also log to general logger for visibility
  logger.log(level, message, { ...meta, logType: 'errors' });
};

const logSecurity = (level, message, meta = {}) => {
  securityLogger.log(level, message, { ...meta, logType: 'security' });
};

const logApi = (level, message, meta = {}) => {
  apiLogger.log(level, message, { ...meta, logType: 'api' });
};

module.exports = { 
  logger,
  paymentLogger,
  authLogger,
  orderLogger,
  productLogger,
  errorLogger,
  securityLogger,
  apiLogger,
  logPayment,
  logAuth,
  logOrder,
  logProduct,
  logError,
  logSecurity,
  logApi
};
