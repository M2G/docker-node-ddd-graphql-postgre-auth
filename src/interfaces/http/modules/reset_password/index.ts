import container from 'container';
import instance from './instance';

export default () => {
  const { cradle } = container;
  const { jwt, logger } = cradle;
  const app = instance();

  return {
    app,
  };
};
