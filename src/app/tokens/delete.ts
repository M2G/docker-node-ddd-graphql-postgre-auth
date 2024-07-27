import Token from 'domain/token';
import type ITokenRepository from 'types/ITokenRepository';
import IRefreshToken from 'core/IRefreshToken';

/**
 * function for remove user.
 */
export default ({ tokenRepository }: { tokenRepository: ITokenRepository }) => {
  function remove({ id }: { readonly id: number }) {
    try {
      const token = Token({ id });
      return tokenRepository.remove(token as IRefreshToken);
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  }

  return { remove };
};
