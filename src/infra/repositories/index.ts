import Users from './users';
import Token from './token';

export default ({ database, jwt }: any) => {
  const { models } = database;
  const { users, tokens } = models;
  const usersModel = users;
  const tokenModel = tokens;

  return {
    tokenRepository: Token({ jwt, model: tokenModel }),
    usersRepository: Users({ jwt, model: usersModel }),
  };
};
