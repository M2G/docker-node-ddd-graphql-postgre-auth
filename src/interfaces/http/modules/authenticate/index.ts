import authenticate from 'interfaces/schema-definition/authenticate';
import instance from './instance';

export default () => {
  const { jwt, logger, postUseCase, postUseCase2 } = instance();
  return {
    authenticate: authenticate({ jwt, logger, postUseCase, postUseCase2 }),
  };
};
