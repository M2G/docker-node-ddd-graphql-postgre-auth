/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

/**
 * function for update user.
 */
export default ({ usersRepository }: any) => {
  const update = ({ ...args }: any) => {
    try {
      const users = Users({ ...args });

      return usersRepository.update(users);
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    update,
  };
};
