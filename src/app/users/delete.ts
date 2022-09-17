/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';

/**
 * function for remove user.
 */
export default ({ usersRepository }: any) => {
  const remove = ({ ...args }: any) => {
    try {
      const users = Users({ ...args });

      return usersRepository.remove(cleanData(users));
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    remove,
  };
};
