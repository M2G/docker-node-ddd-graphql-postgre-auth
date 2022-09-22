import authenticate from 'interfaces/schema-definition/authenticate';
import instance from './instance';

export default () => {
  const { jwt, logger, postUseCase } = instance();
  return {
    authenticate: authenticate({ jwt, logger, postUseCase }),
  };
};
