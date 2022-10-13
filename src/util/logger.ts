import winston, { format } from 'winston';

export default winston.createLogger({
  format: format.combine(
    format.timestamp({ format: () => new Date().toLocaleString() }),
    format.json(),
  ),
  transports: [
    new winston.transports.Console({ format: format.simple() }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});
