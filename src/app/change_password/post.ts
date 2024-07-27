/*eslint-disable*/
/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';
import console from 'console';

/**
 * function for change password user.
 */
// @ts-ignore
export default ({ usersRepository }: IUsersRepository) => {
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
      const users = Users({ id, password, oldPassword });
      return usersRepository.changePassword(users);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  return { changePassword };
};
