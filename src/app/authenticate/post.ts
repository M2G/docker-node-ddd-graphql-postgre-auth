/**
 * this file will hold all the get use-case for user domain
 */
import Users from 'domain/users';
import { cleanData } from 'interfaces/http/utils';

const KEY = 'LAST_CONNECTED_AT';
const TTL = 60 * 60;

/**
 * function for authenticate user.
 */
export default ({ redis, usersRepository }: any) => {
  const authenticate = async ({ ...args }: any) => {
    try {
      const user = Users({ ...args });

      const authenticatedUser: any = await usersRepository.authenticate(cleanData(user));

      console.log('authenticatedUser authenticatedUser authenticatedUser', authenticatedUser);

      await redis.set(`${KEY}:${authenticatedUser?._id}`,
        JSON.stringify({_id: authenticatedUser?._id, last_connected_at: Math.floor(Date.now() / 1000) }), TTL);

      return authenticatedUser;
    } catch (error: any | unknown) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    authenticate,
  };
};
