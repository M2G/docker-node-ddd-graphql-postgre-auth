import resetPassword from 'interfaces/schema-definition/reset_password';
import instance from './instance';

export default () => {
  const { jwt, logger, postUseCase } = instance();
  return {
    resetPassword: resetPassword({
      postUseCase,
      jwt,
      logger,
    }),
  };
};
