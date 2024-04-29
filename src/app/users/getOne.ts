/* eslint-disable */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for get one user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  function getOne({ id }: { readonly id: number }) {
    try {
      console.log('getOne getOne', id);
      const user = Users({ id });
      console.log('user user', user);
      return usersRepository.findOne(user);
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  }

  return { getOne };
};
