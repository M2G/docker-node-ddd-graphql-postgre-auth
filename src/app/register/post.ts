/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import IUser from 'core/IUser';

/**
 * function for create user.
 */
interface IUsersRepository {
  usersRepository: {
    register: (users: IUser) => {
      email: any;
      password: any;
      first_name: any;
      last_nameany: any;
      username: any;
      created_at: any;
      deleted_at: any;
      last_connected_at: any;
    };
  };
}

export default ({ usersRepository }: IUsersRepository) => {
  const register = ({
    email,
    password,
    first_name,
    last_name,
    username,
    created_at,
    deleted_at,
    last_connected_at,
  }: {
    readonly _id: string;
    readonly email: string;
    readonly password: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly username: string;
    readonly created_at: number;
    readonly deleted_at: number;
    readonly last_connected_at: number;
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
      return usersRepository.register(users as unknown as IUser);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };
  return {
    register,
  };
};
