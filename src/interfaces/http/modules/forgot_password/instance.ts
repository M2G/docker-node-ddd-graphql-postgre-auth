import container from 'container';
import post from 'app/forgot_password';

export default () => {
  const { cradle } = container;
  const {
    repository: { usersRepository },
  } = cradle;

  const postUseCase = post({ usersRepository });

  return {
    postUseCase,
  };
};
