/*eslint-disable*/
import fs from 'fs';
import * as winston from 'winston';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export default ({ config }: any) =>
  winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File(
        Object.assign(config.logging, {
          filename: `logs/${config.env}.log`,
        }),
      ),
    ],
  });
