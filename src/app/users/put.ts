/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';
import type IUser from 'core/IUser';

/**
 * function for update user.
 */
export default function ({ usersRepository }: { usersRepository: IUsersRepository }) {
  function update({ ...arg }) {
    try {
      const users = Users({
        ...arg,
      });

      return usersRepository.update(users as IUser);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { update };
}
