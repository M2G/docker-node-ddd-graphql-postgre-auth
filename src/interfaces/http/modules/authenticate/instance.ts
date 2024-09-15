import authenticate from 'app/authenticate';
import { post } from 'app/tokens';
import container from '../../../../container';

export default () => {
  const { cradle } = container;
  const { redisService, repository, jwt, logger, localeService, i18nProvider } = cradle;
  const { usersRepository, tokenRepository } = repository;

  const postUseCase = authenticate({
    redisService,
    usersRepository,
  });
  const postUseCase2 = post({ tokenRepository });

  return {
    jwt,
    logger,
    postUseCase,
    postUseCase2,
    localeService,
    i18nProvider,
  };
};
