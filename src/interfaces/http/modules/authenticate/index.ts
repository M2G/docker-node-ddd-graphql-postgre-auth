import instance from './instance';
import authenticate from '../../../schema-definition/authenticate';

export default () => {
  const app = instance();
  return {
    authenticate: authenticate({ postUseCase: app }),
  };
};
