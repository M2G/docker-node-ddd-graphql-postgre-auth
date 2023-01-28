import resetPassword from 'interfaces/schema-definition/reset_password';
import instance from './instance';

export default () => {
  const { logger, postUseCase } = instance();
  return {
    resetPassword: resetPassword({
      logger,
      postUseCase,
    }),
  };
};
