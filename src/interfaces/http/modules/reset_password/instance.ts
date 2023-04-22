import container from 'src/container';
import post from 'app/reset_password';

export default () => {
  const { cradle } = container;
  const {
    repository: { usersRepository },
    jwt,
    logger,
  } = cradle;

  const postUseCase = post({ usersRepository });

  return {
    jwt,
    logger,
    postUseCase,
  };
};
