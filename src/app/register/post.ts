/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUser from 'core/IUser';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for create user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  const register = ({
    email,
    password,
    first_name,
    last_name,
    username,
    created_at,
    deleted_at,
    last_connected_at,
  }: IUser) => {
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

      console.log("users", users);

      return usersRepository.register(users as IUser);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };
  return {
    register,
  };
};
