import container from 'container';
import {
 get, getOne, put, remove,
} from 'app/users';

export default () => {
  const { cradle } = container;
  const {
    redis,
    logger,
    repository: { usersRepository },
    response,
  } = cradle;

  const getUseCase = get({ redis, usersRepository });
  const getOneUseCase = getOne({ usersRepository });
  const putUseCase = put({ usersRepository });
  const deleteUseCase = remove({ usersRepository });

  return {
    deleteUseCase,
    getOneUseCase,
    getUseCase,
    logger,
    putUseCase,
    response,
  };
};
