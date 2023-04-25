import post from 'app/reset_password';
import container from "../../../../container";

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
