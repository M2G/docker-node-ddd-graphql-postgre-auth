import morgan from 'morgan';

export default (logger: any) => morgan('common', {
    stream: {
      write: (message: any[] | string) => {
        logger.info(message.slice(0, -1));
      },
    },
  });
