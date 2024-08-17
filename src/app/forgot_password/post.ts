/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for forgot password user.
 */
export default function ({ usersRepository }: IUsersRepository) {
  function forgotPassword({ email }: { readonly email: string }) {
    try {
      const users = Users({ email });
      return usersRepository.forgotPassword(users);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { forgotPassword };
}
