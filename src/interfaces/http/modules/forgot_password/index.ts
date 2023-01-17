import forgotPassword from 'interfaces/schema-definition/forgot_password';
import instance from './instance';

export default () => {
  const { jwt, logger } = instance();
  return {
    forgotPassword: forgotPassword({
      jwt,
      logger,
    }),
  };
};
