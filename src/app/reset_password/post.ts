/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';

/**
 * function for reset password user.
 */
export default ({ usersRepository }: any) => {
  const resetPassword = ({ ...args }: any) => {
    try {
      const users = Users({ ...args });

      return usersRepository.resetPassword(cleanData(users));
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    resetPassword,
  };
};
