/*eslint-disable */
import {
 get, getOne, put, remove, post,
} from 'app/users';
import container from "../../../../container";

export default () => {
  const { cradle } = container;
  const {
    redis,
    logger,
    repository: { usersRepository },
  } = cradle;

  const getUseCase = get({ redis, usersRepository });
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
