import { BaseLogger, LevelWithSilentOrString, pino } from 'pino';

function getLogger(level: LevelWithSilentOrString = 'info'): BaseLogger {
  let logger: BaseLogger;

  if (!logger) {
    logger = pino({
      level: level,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  }

  return logger;
}

export { getLogger };
