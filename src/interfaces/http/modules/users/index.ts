import container from 'container';
import instance from './instance';

export default () => {
  const { cradle } = container;

  const {
    logger,
    auth,
  } = cradle;
  const app = instance();

  return {
    app,
  };
};
