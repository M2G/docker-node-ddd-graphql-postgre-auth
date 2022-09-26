import users from 'interfaces/schema-definition/users';
import instance from './instance';

export default () => {
  const {
    deleteUseCase,
    getOneUseCase,
    getUseCase,
    jwt,
    logger,
    postUseCase,
    putUseCase,
  } = instance();
  return {
    users: users({
      deleteUseCase,
      getOneUseCase,
      getUseCase,
      jwt,
      logger,
      postUseCase,
      putUseCase,
}),
  };
};
