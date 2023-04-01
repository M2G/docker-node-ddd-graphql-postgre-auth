/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for forgot password user.
 */
export default ({ usersRepository }: IUsersRepository) => {
  const forgotPassword = ({ email }: { readonly email: string }) => {
    try {
      const users = Users({ email });
      return usersRepository.forgotPassword(cleanData(users));
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    forgotPassword,
  };
};
