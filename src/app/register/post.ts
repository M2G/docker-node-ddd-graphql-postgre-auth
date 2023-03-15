/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

/**
 * function for create user.
 */
export default ({ usersRepository }: any) => {
  const register = ({
    input: {
      email,
      password,
      first_name,
      last_name,
      username,
      created_at,
      deleted_at,
      last_connected_at,
    },
  }: {
    readonly input: {
      readonly email: string;
      readonly password: string;
      readonly first_name: string;
      readonly last_name: string;
      readonly username: string;
      readonly created_at: number;
      readonly deleted_at: number;
      readonly last_connected_at: number | null;
    };
  }) => {
    try {
      const users = Users({
        created_at,
        deleted_at,
        email,
        first_name,
        last_connected_at,
        last_name,
        password,
        username,
      });
      return usersRepository.register(users);
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };
  return {
    register,
  };
};
