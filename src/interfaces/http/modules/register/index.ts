import register from 'interfaces/schema-definition/register';
import instance from './instance';

export default () => {
  const { jwt, logger, postUseCase } = instance();
  return {
    authenticate: register({ jwt, logger, postUseCase }),
  };
};
