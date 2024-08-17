/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import type IUsersRepository from 'types/IUsersRepository';
import type IUser from 'core/IUser';

const KEY = 'LAST_CONNECTED_AT';
const TTL = 60 * 60;

/**
 * function for authenticate user.
 */
export default function ({
  redis,
  usersRepository,
}: {
  redis: {
    set: (key: string, value: any, ttlInSeconds?: number) => boolean;
  };
  usersRepository: IUsersRepository;
}) {
  async function authenticate({ email }: { readonly email: string }): Promise<IUser> {
    try {
      const user = Users({ email });
      const authenticatedUser = await usersRepository.authenticate({
        email: (user as any).email,
      });

      redis.set(
        `${KEY}:${authenticatedUser?.id}`,
        JSON.stringify({
          id: authenticatedUser?.id,
          last_connected_at: Math.floor(Date.now() / 1000),
        }),
        TTL,
      );

      return authenticatedUser;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { authenticate };
}
