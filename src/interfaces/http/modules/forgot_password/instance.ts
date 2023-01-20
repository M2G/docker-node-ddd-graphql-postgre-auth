import container from 'container';
import post from 'app/forgot_password';

export default () => {
  const { cradle } = container;
  const {
    repository: { usersRepository },
    logger,
  } = cradle;

  const postUseCase = post({ usersRepository });

  return {
    logger,
    postUseCase,
  };
};
