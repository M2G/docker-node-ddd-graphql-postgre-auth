import container from 'container';
import post from 'app/register';

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
