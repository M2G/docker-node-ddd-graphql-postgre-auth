import refreshToken from 'interfaces/schema-definition/refresh_token';
import instance from './instance';

export default () => {
  const { removeUseCase, jwt, logger, postUseCase, postUseCase2, getOneUseCase, getOneUseCase2 } =
    instance();
  return {
    refreshToken: refreshToken({
      removeUseCase,
      getOneUseCase,
      // @TODO rename it to refreshTokenUseCase
      getOneUseCase2,
      jwt,
      logger,
      postUseCase,
      postUseCase2,
    }),
  };
};
