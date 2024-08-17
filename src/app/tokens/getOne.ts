import type ITokenRepository from 'types/ITokenRepository';
import Token from 'domain/token';

/**
 * function for get one user.
 */
export default function ({ tokenRepository }: { tokenRepository: ITokenRepository }) {
  function getOne({ token }: { readonly token: string }) {
    try {
      const token2 = Token({ token });
      return tokenRepository.findOne(token2);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  return { getOne };
}
