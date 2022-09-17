/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
// import { cleanData } from 'interfaces/http/utils';

/**
 * function for create user.
 */
export default ({ usersRepository }: any) => {
  const register = ({ ...args }: any) => {
    try {
      const users = Users({ ...args });

      console.log('users', users);

      return usersRepository.register(users);
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };
  return {
    register,
  };
};
