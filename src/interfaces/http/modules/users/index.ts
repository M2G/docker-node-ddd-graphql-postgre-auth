import users from 'interfaces/schema-definition/users';
import instance from './instance';

export default () => {
  const {
    deleteUseCase, getOneUseCase, getUseCase, logger, putUseCase, response,
  } = instance();
  return {
    users: users({
      deleteUseCase,
      getOneUseCase,
      getUseCase,
      logger,
      putUseCase,
      response,
    }),
  };
};
