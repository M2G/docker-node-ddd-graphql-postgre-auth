import authenticate from 'interfaces/schema-definition/authenticate';
import instance from './instance';

export default () => {
  const { postUseCase } = instance();
  return {
    authenticate: authenticate({ postUseCase }),
  };
};
