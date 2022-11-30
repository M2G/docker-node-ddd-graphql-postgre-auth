import container from 'container';
import instance from './instance';

export default () => {
  const { jwt, logger } = container.cradle;
  const app = instance();

  return {
    app,
  };
};
