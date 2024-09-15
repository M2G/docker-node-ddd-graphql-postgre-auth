/*eslint-disable */
import { get, getOne, put, remove, post } from 'app/users';
import container from '../../../../container';

export default () => {
  const { cradle } = container;
  const {
    redisService,
    logger,
    repository: { usersRepository },
  } = cradle;

  const getUseCase = get({
    redisService,
    usersRepository,
  });
  const getOneUseCase = getOne({ usersRepository });
  const putUseCase = put({ usersRepository });
  const postUseCase = post({ usersRepository });
  const deleteUseCase = remove({ usersRepository });

  return {
    deleteUseCase,
    getOneUseCase,
    getUseCase,
    logger,
    postUseCase,
    putUseCase,
  };
};
