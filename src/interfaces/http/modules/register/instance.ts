/* eslint-disable */
import post from 'app/register';
import container from '../../../../container';

export default () => {
  const { cradle } = container;
  const { redisService, repository, jwt, logger } = cradle;
  const { usersRepository } = repository;
  const postUseCase = post({
    redisService,
    usersRepository,
  });

  return {
    jwt,
    logger,
    postUseCase,
  };
};
