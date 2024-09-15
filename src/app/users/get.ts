import IUsersRepository from 'types/IUsersRepository';

const KEY = 'LIST_USER';
const TTL = 1 * 60;

/**
 * function for get users.
 */
export default function ({ redisService, usersRepository }: { usersRepository: IUsersRepository }) {
  async function all({ ...arg }: { filters: string; pageSize: number; page: number }) {
    try {
      if (arg && Object.values(arg).filter(Boolean).length) {
        return usersRepository.getAll({
          attributes: {},
          ...arg,
        });
      }

      const cachingUserList = await redisService.get(KEY);

      if (cachingUserList) return cachingUserList;

      const userList = usersRepository.getAll({
        attributes: {},
        ...arg,
      });

      await redisService.setWithExpiry(KEY, JSON.stringify(userList), TTL);

      return userList;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  return { all };
}
