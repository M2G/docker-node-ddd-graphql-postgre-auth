import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';

/**
 * function for get one user.
 */
export default ({ usersRepository }: any) => {
  const getOne = ({ ...args }: any) => {
    try {
      const users = Users({ ...args });

      return usersRepository.findOne(cleanData(users));
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    getOne,
  };
};
