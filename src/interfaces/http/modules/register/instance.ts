/* eslint-disable */
import container from '../../../../container';
import post from 'app/register';

export default () => {
  const { cradle } = container;
  const {
 redis, repository, jwt, logger,
} = cradle;
  const { usersRepository } = repository;
  //@ts-ignore
  const postUseCase = post({ redis, usersRepository });

  return {
    jwt,
    logger,
    postUseCase,
  };
};
