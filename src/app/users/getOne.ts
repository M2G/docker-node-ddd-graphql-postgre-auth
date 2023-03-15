import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';

/**
 * function for get one user.
 */
export default ({ usersRepository }: any) => {
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
