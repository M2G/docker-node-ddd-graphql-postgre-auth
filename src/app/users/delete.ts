/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

/**
 * function for remove user.
 */
export default ({ usersRepository }: any) => {
  const remove = ({ _id }: { readonly _id: string }) => {
    try {
      const users = Users({ _id });

      return usersRepository.remove(users);
    } catch (error: unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    remove,
  };
};
