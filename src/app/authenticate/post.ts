/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';

const KEY = 'LAST_CONNECTED_AT';
const TTL = 60 * 60;

/**
 * function for authenticate user.
 */
export default ({ redis, usersRepository }: any) => {
  const authenticate = async ({ email }: { readonly email: string }) => {
    try {
      const user = Users({ email });
      const authenticatedUser = await usersRepository.authenticate({
        email: user.email,
      });

      await redis.set(
        `${KEY}:${authenticatedUser?._id}`,
        JSON.stringify({
          _id: authenticatedUser?._id,
          last_connected_at: Math.floor(Date.now() / 1000),
        }),
        TTL,
      );

      return authenticatedUser;
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    authenticate,
  };
};
