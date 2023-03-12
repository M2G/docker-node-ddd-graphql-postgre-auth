import resetPassword from 'interfaces/schema-definition/reset_password';
import instance from './instance';

export default () => {
  const { logger, postUseCase, jwt } = instance();
  return {
    resetPassword: resetPassword({
      jwt,
      logger,
      postUseCase,
    }),
  };
};
