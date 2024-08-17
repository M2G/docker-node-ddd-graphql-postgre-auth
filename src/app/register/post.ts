/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUser from 'core/IUser';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for create user.
 */
export default function ({ usersRepository }: { usersRepository: IUsersRepository }) {
  function register({ ...args }: IUser) {
    try {
      const users = Users({ ...args });
      return usersRepository.register(users as IUser);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { register };
}
