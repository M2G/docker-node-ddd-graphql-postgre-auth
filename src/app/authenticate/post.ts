/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';

const KEY = 'LAST_CONNECTED_AT';
const TTL = 60 * 60;

/**
 * function for authenticate user.
 */
export default ({
  redis,
  usersRepository,
}: {
  redis: {
    set: (key: string, value: any, ttlInSeconds?: number) => boolean;
  };
  usersRepository: IUsersRepository;
}) => {
  const authenticate = ({ email }: { readonly email: string }) => {
    try {
      const user = Users({ email });
      const authenticatedUser = usersRepository.authenticate({
        email: (user as any).email,
      });

      redis.set(
        `${KEY}:${authenticatedUser?.id}`,
        JSON.stringify({
          _id: authenticatedUser?.id,
          last_connected_at: Math.floor(Date.now() / 1000),
        }),
        TTL,
      );

      return authenticatedUser;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    authenticate,
  };
};
