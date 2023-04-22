import container from 'src/container';
import post from 'app/forgot_password';

export default () => {
  const { cradle } = container;
  const {
    repository: { usersRepository },
    logger,
  } = cradle;

  // eslint-disable-next-line
  // @ts-ignore
  const postUseCase = post({ usersRepository });

  return {
    logger,
    postUseCase,
  };
};
