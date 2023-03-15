/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

/**
 * function for remove user.
 */
export default ({ usersRepository }: any) => {
  const remove = ({ id }: { readonly id: string }) => {
    try {
      const users = Users({ _id: id });

      return usersRepository.remove(users);
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    remove,
  };
};
