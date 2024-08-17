/**
 * this file will hold all the get use-case for user domain
 */
import Token from 'domain/token';
import type IUser from 'core/IUser';
import type ITokenRepository from 'types/ITokenRepository';
/**
 * function for create user.
 */
export default function ({ tokenRepository }: { tokenRepository: ITokenRepository }) {
  function register({ ...args }: IUser) {
    try {
      const token = Token({ ...args });
      return tokenRepository.register(token as IUser);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { register };
}
