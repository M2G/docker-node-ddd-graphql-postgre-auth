/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';

/**
 * function for forgot password user.
 */
export default ({ usersRepository }: any) => {

  console.log('usersRepository');

  const forgotPassword = ({ email }: { readonly email: string }) => {
    try {
      const users = Users({ email });
      return usersRepository.forgotPassword(cleanData(users));
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    forgotPassword,
  };
};
