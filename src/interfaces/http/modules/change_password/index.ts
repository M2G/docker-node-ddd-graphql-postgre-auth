import changePassword from 'interfaces/schema-definition/change_password';
import instance from './instance';

export default () => {
  const { logger, postUseCase } = instance();
  return {
    changePassword: changePassword({
      logger,
      postUseCase,
    }),
  };
};
