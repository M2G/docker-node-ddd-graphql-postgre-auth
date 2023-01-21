import forgotPassword from 'interfaces/schema-definition/forgot_password';
import instance from './instance';

export default () => {
  const { logger, postUseCase } = instance();
  return {
    forgotPassword: forgotPassword({
      logger,
      postUseCase,
    }),
  };
};
