import Token from 'domain/token';
import type ITokenRepository from 'types/ITokenRepository';
import type IRefreshToken from 'core/IRefreshToken';

/**
 * function for remove user.
 */
export default function ({ tokenRepository }: { tokenRepository: ITokenRepository }) {
  function remove({ id }: { readonly id: number }) {
    try {
      const token = Token({ id });
      return tokenRepository.remove(token as IRefreshToken);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  return { remove };
}
