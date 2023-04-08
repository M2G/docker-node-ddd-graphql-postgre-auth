import type IUser from 'core/IUser';

interface IUsersRepository {
  authenticate: (email: { email: string }) => IUser;
  findOne: (_id: { _id: string }) => IUser;
  forgotPassword: (users: IUser) => IUser;
  getAll: (arg: { filters: string; pageSize: number; page: number, attributes: any }) => IUser;
  update: (users: IUser) => IUser;
  register: (users: IUser) => IUser;
  remove: (_id: IUser) => IUser;
  resetPassword: (email: { email: string }) => boolean;
}

export default IUsersRepository;
