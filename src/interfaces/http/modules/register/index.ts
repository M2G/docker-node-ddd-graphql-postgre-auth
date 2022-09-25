import register from 'interfaces/schema-definition/register';
import instance from './instance';

export default () => {
  const { jwt, logger, postUseCase } = instance();
  return {
    register: register({ jwt, logger, postUseCase }),
  };
};
