/*eslint-disable*/
/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';

/**
 * function for reset password user.
 */
export default ({ usersRepository }: { usersRepository: IUsersRepository }) => {
  const resetPassword = ({
    password,
    reset_password_token,
  }: {
      readonly reset_password_token: string;
      readonly password: string;
  }) => {
    try {
      const users = Users({ password, reset_password_token });

      // @ts-ignore
      return usersRepository.resetPassword(users);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    resetPassword,
  };
};
