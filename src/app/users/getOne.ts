import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for get one user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  const getOne = ({ id }: { readonly id: string }) => {
    try {
      const users = Users({ _id: id });

      return usersRepository.findOne(cleanData(users));
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    getOne,
  };
};
