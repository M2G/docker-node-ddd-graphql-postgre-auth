/*eslint-disable*/
import { IRead, IWrite } from 'core/IRepository';
import IUser from 'core/IUser';
import toEntity from './transform';

export default ({ model, jwt }: any) => {
  const getAll = async (...args: any[]) => {
    try {
      const [{ filters, pageSize, page }]: any = args;

      console.log('params params params params', args);

      const query: {
        $or?: (
          | { first_name: { $regex: string; $options: string } }
          | { last_name: { $regex: string; $options: string } }
          | { email: { $regex: string; $options: string } }
        )[];
        deleted_at: { $lte: number };
      } = {
        deleted_at: {
          $lte: 0
        }
      };

      if (filters) {
        query.$or = [
          { first_name: { $regex: filters, $options: 'i' } },
          { last_name: { $regex: filters, $options: 'i' } },
          { email: { $regex: filters, $options: 'i' } }
        ];
      }

      console.log('query query query query query', query)

      const m: IRead<any> = model;
      const users = await m
        .find(query)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ email: 1 })
        .lean();

      const count = await model.countDocuments();
      const pages = Math.ceil(count / pageSize);
      const prev = page > 1 ? page - 1 : null;
      const next = page < pages ? page + 1 : null;

      return [
        {
          results: (users || [])?.map((user) => toEntity(user)),
          pageInfo: {
            count,
            pages,
            prev,
            next
          }
        }
      ];
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const register = async (...args: any[]) => {
    try {
      const [{ ...params }] = args;
      const m: IWrite<any> = model;
      return await m.create({ ...params });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const forgotPassword = async (...args: any[]) => {
    try {
      const [{ ...params }] = args;
      const { ...user }: any = await findOne(params);

      if (!user) return null;

      const { _id, email, password } = <IUser>user;
      const payload = { _id, email, password };
      const options = {
        subject: email,
        audience: [],
        expiresIn: 60 * 60
      };
      const token: string = jwt.signin(options)(payload);

      const updatedUser = await update({
        _id,
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000
      });

      console.log('updatedUser', updatedUser);

      return toEntity(updatedUser);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const resetPassword = async (...args: any[]) => {
    try {
      const [{ ...params }] = args;

      console.log('resetPassword resetPassword ', params);

      const data: any = await findOne({
        reset_password_token: params.token,
        reset_password_expires: {
          $gt: Math.floor(Date.now() / 1000)
        }
      });

      if (!data) return null;

      console.log('resetPassword resetPassword { ...data }', { data });

      data.password = params.password;
      data.reset_password_token = undefined;
      data.reset_password_expires = undefined;

      return await update({ ...data });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const findOne = async (...args: any[]) => {
    try {
      const m: IRead<any> = model;
      const [{ ...params }] = args;
      const user = await m.findOne({ ...params }).lean();

      if (!user) return null;

      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const remove = async (...args: any) => {
    try {
      const m: IWrite<any> = model;

      const [{ ...params }] = args;
      const user = await m.findByIdAndDelete({ ...params }).lean();

      if (!user) return null;

      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const update = async (...args: any) => {
    try {
      const m: IWrite<any> = model;
      const [{ _id, ...params }] = args;
      const user = await m
        .findByIdAndUpdate(
          { _id } as any,
          { ...params },
          { upsert: true, new: true }
        )
        .lean();

      console.log('findByIdAndUpdate findByIdAndUpdate', user)

      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const authenticate = async (...args: any[]) => {
    try {
      const [{ ...params }] = args;

      const m: IRead<any> = model;
      const user = await m.findOne({ ...params }).lean();

      if (!user) return null;
      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  return {
    remove,
    update,
    findOne,
    authenticate,
    resetPassword,
    forgotPassword,
    getAll,
    register
  };
};
