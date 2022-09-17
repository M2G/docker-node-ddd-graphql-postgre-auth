import container from 'container';
import post from 'app/authenticate';

export default () => {
  const { cradle } = container;
  const { redis, repository } = cradle;
  const { usersRepository } = repository;
  const postUseCase = post({ redis, usersRepository });

  return {
    postUseCase,
  };
};
