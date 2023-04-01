/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

/**
 * function for update user.
 */
export default ({ usersRepository }: any) => {
  const update = ({
    _id,
    email,
    password,
    first_name,
    last_name,
    username,
    created_at,
    deleted_at,
 }: {
    readonly _id: string;
    readonly email: string;
    readonly password: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly username: string;
    readonly created_at: number;
    readonly deleted_at: number;
  }) => {
    try {
      const users = Users({
        _id,
        created_at,
        deleted_at,
        email,
        first_name,
        last_name,
        password,
        username,
      });

      return usersRepository.update(users);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    update,
  };
};
