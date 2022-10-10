import users from 'interfaces/schema-definition/users';
import instance from './instance';

export default () => {
  const { auth, deleteUseCase, getOneUseCase, getUseCase, logger, putUseCase, verify } = instance();
  return {
    users: users({
      auth,
      deleteUseCase,
      getOneUseCase,
      getUseCase,
      logger,
      putUseCase,
      verify,
    }),
  };
};
