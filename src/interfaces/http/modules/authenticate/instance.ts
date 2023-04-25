import post from 'app/authenticate';
import container from "../../../../container";

export default () => {
  const { cradle } = container;
  const { redis, repository, jwt, logger } = cradle;
  const { usersRepository } = repository;
  const postUseCase = post({ redis, usersRepository });

  return {
    jwt,
    logger,
    postUseCase,
  };
};
