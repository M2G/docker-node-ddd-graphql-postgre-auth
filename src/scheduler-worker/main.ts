import cron from 'node-cron';
import container from 'container';

const { cradle } = container;
const { redis, repository, logger } = cradle;
const { usersRepository } = repository;

const KEY = 'LAST_CONNECTED_AT:*';

function subtractMonths(numOfMonths: number, date: Date = new Date()) {
  const dateCopy = new Date(date.getTime());

  dateCopy.setMonth(dateCopy.getMonth() - numOfMonths);

  return dateCopy;
}

function lastConnectedUser() {
  try {
    redis.scan(KEY, (err: any, matchingKeys: readonly any[]) => {
      if (err) throw err;
      // matchingKeys will be an array of strings if matches were found
      // otherwise it will be an empty array.
      matchingKeys?.map(async (userKey) => {
        const usersInfo: { _id: string; last_connected_at: number } = await redis.get(userKey);
        const updatedUser: any = await usersRepository.update({
          _id: usersInfo?._id,
          last_connected_at: usersInfo?.last_connected_at,
        });

        logger.info(
          '[Users.updateLastConnectedAt] users updated in mongo',
          updatedUser?._id,
        );
      });
    });
  } catch (error: unknown) {
    logger.error('[Users.updateLastConnectedAt]', error);
    throw new Error(error as string | undefined);
  }
}

async function anonymizeUser(userId: any): Promise<any> {
  try {
    const user = await usersRepository.findOne(userId);
    if (!user) throw new Error('User not found');

    const userDataToUpdate = {
      address: `anonym-address${userId}`,
      deleted_at: Math.floor(Date.now() / 1000),
      email: `anonym-${userId}@unknown.fr`,
      first_name: `unnamed-${userId}`,
      last_name: `unnamed-${userId}`,
      phone: `anonym-phone-${userId}`,
      updated_at: Math.floor(Date.now() / 1000),
    };

    const updatedUser: any = await usersRepository.update({
      _id: user?._id,
      ...userDataToUpdate,
    });

    logger.info('[Users.anonymizeInactivity]', userDataToUpdate);

    logger.info(
      `[AnonymizeUser]: user with email ${updatedUser.email} anonymized to ${userDataToUpdate.email}`,
    );
  } catch (error: unknown) {
    logger.error(`[AnonymizeUser]: Error while anonymizing user`);
    throw error;
  }
}

async function deleteInactiveUser() {
  try {
    const users: any = await usersRepository.getAll({
      last_connected_at: {
        $gt: 0,
        $lte: subtractMonths(3, new Date()).getTime(),
      },
    });

    await Promise.all(
      users?.map(async (user: { readonly _id: string }) => {
        await anonymizeUser(user._id);
      }),
    );

    logger.info('[Users.anonymizeInactivity] users anonymized successfully');
  } catch (error: unknown) {
    logger.error('[Users.anonymizeInactivity]', error);
  }
}

cron.schedule('* * * * *', () => {
  void (async () => {
    // lastConnectedUser();
    // await deleteInactiveUser();
  })();
});
