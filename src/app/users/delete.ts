/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';
import type IUser from 'core/IUser';

/**
 * function for remove user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  const remove = ({ id }: { readonly id: number }) => {
    try {
      const users = Users({ id });
      return usersRepository.remove(users as IUser);
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    remove,
  };
};
