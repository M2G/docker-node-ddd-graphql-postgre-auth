/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';
import type IUser from 'core/IUser';

/**
 * function for create user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  const register = ({ ...args }: any) => {
    try {
      const users = Users({ ...args });
      return usersRepository.register(users as IUser);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };
  return {
    register,
  };
};
