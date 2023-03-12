/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

/**
 * function for create user.
 */
export default ({ usersRepository }: any) => {
  console.log('usersRepository usersRepository usersRepository');
  const register = ({
    input: { email },
  }: {
    readonly input: { readonly email: string; };
  }) => {
    try {
      const users = Users({ email });
      return usersRepository.register(users);
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };
  return {
    register,
  };
};
