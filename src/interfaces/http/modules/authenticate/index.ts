import authenticate from 'interfaces/schema-definition/authenticate';
import instance from './instance';

export default () => {
  const app = instance();
  return {
    authenticate: authenticate({ postUseCase: app }),
  };
};
