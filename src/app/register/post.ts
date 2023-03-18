/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUser from 'core/IUser';

/**
 * function for create user.
 */
export default ({ usersRepository }) => {
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
    readonly input: IUser;
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
