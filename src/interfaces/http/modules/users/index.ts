import container from 'container';
import router from './router';
import instance from './instance';

export default () => {
  const { cradle } = container;

  const {
    logger,
    response: { Success, Fail },
    auth,
  } = cradle;
  const app = instance();

  return {
    app,
    router: router({
      auth,
      logger,
      response: { Fail, Success },
      ...app,
    }),
  };
};
