import container from 'container';
// import router from './router';
import instance from './instance';
import authenticate from '../../../schema-definition/authenticate';

export default () => {
  const {
    postUseCase,
  } = container.cradle;
  const app = instance();

  return {
    app,
    ...authenticate({ postUseCase }),
  };
};
