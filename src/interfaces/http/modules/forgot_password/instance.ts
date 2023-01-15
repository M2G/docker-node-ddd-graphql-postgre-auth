import container from 'container';
import post from 'app/forgot_password';

export default () => {
  const { cradle } = container;
  const {
    repository: { usersRepository },
    jwt,
    logger,
  } = cradle;

  const postUseCase = post({
    usersRepository,
  });

  return {
    jwt,
    logger,
    postUseCase,
  };
};
