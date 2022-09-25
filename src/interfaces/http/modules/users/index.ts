import users from 'interfaces/schema-definition/users';
import instance from './instance';

export default () => {
  const {
    jwt,
    logger,
    deleteUseCase,
    getOneUseCase,
    getUseCase,
    putUseCase,
    postUseCase,
  } = instance();
  return {
    users: users({ jwt, logger, postUseCase }),
  };
};
