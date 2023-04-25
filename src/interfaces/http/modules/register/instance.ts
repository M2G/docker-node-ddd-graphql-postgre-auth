/* eslint-disable */
import post from 'app/register';
import container from "../../../../container";

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
