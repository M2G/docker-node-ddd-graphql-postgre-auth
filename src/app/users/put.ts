/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';
import type IUser from 'core/IUser';

/**
 * function for update user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  const update = ({
    id,
    email,
    password,
    first_name,
    last_name,
    username,
    created_at,
    deleted_at,
 }: {
    readonly id: string;
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
        created_at,
        deleted_at,
        email,
        first_name,
        id,
        last_name,
        password,
        username,
      });

      return usersRepository.update(users as IUser);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    update,
  };
};
