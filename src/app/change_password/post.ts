/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for change password user.
 */
export default function ({ usersRepository }: IUsersRepository) {
  function changePassword({
    id,
    password,
    oldPassword,
  }: {
    id: string;
    readonly password: string;
    oldPassword: string;
  }) {
    try {
      const users = Users({ id, oldPassword, password });
      return usersRepository.changePassword(users);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { changePassword };
}
