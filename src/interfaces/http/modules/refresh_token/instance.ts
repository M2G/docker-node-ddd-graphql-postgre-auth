import authenticate from 'app/authenticate';
import { getOne as getOneUser } from 'app/users';
import { remove, getOne, post } from 'app/tokens';
import container from '../../../../container';

export default () => {
  const { cradle } = container;
  const { redis, repository, jwt, logger } = cradle;
  const { usersRepository, tokenRepository } = repository;

  const postUseCase = authenticate({ redis, usersRepository });
  const removeUseCase = remove({ tokenRepository });
  const postUseCase2 = post({ tokenRepository });
  const getOneUseCase = getOne({ tokenRepository });
  const getOneUseCase2 = getOneUser({ usersRepository });

  return {
    removeUseCase,
    getOneUseCase,
    getOneUseCase2,
    jwt,
    logger,
    postUseCase,
    postUseCase2,
  };
};
