import authenticate from 'interfaces/schema-definition/authenticate';
import instance from './instance';

export default () => {
  const { jwt, logger, postUseCase, postUseCase2, localeService, i18nProvider } = instance();
  return {
    authenticate: authenticate({
      jwt,
      logger,
      postUseCase,
      // @TODO rename it to refreshTokenUseCase
      postUseCase2,
      localeService,
      i18nProvider,
    }),
  };
};
