import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for get one user.
 */
export default function ({ usersRepository }: { usersRepository: IUsersRepository }) {
  function getOne({ id }: { readonly id: number }) {
    try {
      const user = Users({ id });
      return usersRepository.findOne(user);
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  return { getOne };
}
