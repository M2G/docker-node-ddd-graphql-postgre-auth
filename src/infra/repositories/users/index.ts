/*eslint-disable*/
import { Types } from 'mongoose';
import { IRead, IWrite } from 'core/IRepository';
import IUser from 'core/IUser';
import toEntity from './transform';

export default ({ model, jwt }: any) => {
  const getAll = async (...args: any[]) => {
    try {
      const [{ filters, first, last, order, before, after }]: any = args;
      console.log('params params params params', args)

      const orderField = "id";

      const query = {};

      const m: IRead<any> = model;
      let users = await m.find(query).lean().sort({ email: 1 });

      if (orderField === 'id') {
        users = await limitQueryWithId(m, before, after, 1);
      } else {
        users = await limitQuery(m, orderField, order, before, after);
      }
      const pageInfo = await applyPagination(
        users, first, last
      );
      console.log('---------------------------------------------->', {
        users,
        pageInfo,
      })


      /*let query: any = {
        deleted_at: {
          $lte: 0,
        },
      };

      if (filters) {
        query.$or = [
          { first_name: { $regex: filters, $options: 'i' } },
          { last_name: { $regex: filters, $options: 'i' } },
          { email: { $regex: filters, $options: 'i' } },
        ];
      }

      const m: IRead<any> = model;
      const users = await m.find(query).lean().sort({ email: 1 });
      return users?.map((user) => toEntity(user));*/

      return [];
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };


  const limitQueryWithId = async (query, before, after, order) => {
console.log('limitQueryWithId')
    const filter = {
      _id: {},
    };

    if (before) {
      const op = order === 1 ? '$lt' : '$gt';
      filter._id[op] = new Types.ObjectId(before);
    }

    if (after) {
      const op = order === 1 ? '$gt' : '$lt';
      filter._id[op] = new Types.ObjectId(after);
    }

    console.log('limitQueryWithId 1', filter)

    const res = await query.find(filter).sort({ _id: order });

    console.log('limitQueryWithId 2', res)

    return res
  }

  async function limitQuery(query, field, order, before, after) {
    let filter = {};
    const limits = {};
    const ors = [];
    if (before) {
      const op = order === 1 ? '$lt' : '$gt';
      const beforeObject = await query.findOne({
        _id: new Types.ObjectId(before),
      }, {
        fields: {
          [field]: 1,
        },
      } as any);
      limits[op] = beforeObject[field];
      ors.push(
        {
          [field]: beforeObject[field],
          _id: { [op]: new Types.ObjectId(before) },
        },
      );
    }

    if (after) {
      const op = order === 1 ? '$gt' : '$lt';
      const afterObject = await query.findOne({
        _id: new Types.ObjectId(after),
      }, {
        fields: {
          [field]: 1,
        },
      } as any);
      limits[op] = afterObject[field];
      ors.push(
        {
          [field]: afterObject[field],
          _id: { [op]: new Types.ObjectId(after) },
        },
      );
    }

    if (before || after) {
      filter = {
        $or: [
          {
            [field]: limits,
          },
          ...ors,
        ],
      };
    }

    return query.find(filter).sort([[field, order], ['_id', order]]);
  }


  const applyPagination = async (query, first, last) => {
    let count;

    if (first || last) {
      count = await query.clone().count();
      let limit;
      let skip;

      if (first && count > first) {
        limit = first;
      }

      if (last) {
        if (limit && limit > last) {
          skip = limit - last;
          limit = limit - skip;
        } else if (!limit && count > last) {
          skip = count - last;
        }
      }

      if (skip) {
        query.skip(skip);
      }

      if (limit) {
        query.limit(limit);
      }
    }

    return {
      hasNextPage: Boolean(first && count > first),
      hasPreviousPage: Boolean(last && count > last),
    };
  }

























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
        expiresIn: 60 * 60,
      };
      const token: string = jwt.signin(options)(payload);

      const updatedUser = await update({
        _id,
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000,
      });

      console.log('updatedUser', updatedUser)

      return toEntity(updatedUser);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const resetPassword = async (...args: any[]) => {

    try {
      const [{ ...params }] = args;

      console.log('resetPassword resetPassword ', params)

      const data: any = await findOne({
        reset_password_token: params.token,
        reset_password_expires: {
          $gt: Math.floor(Date.now() / 1000),
        },
      });

      if (!data) return null;

      console.log('resetPassword resetPassword { ...data }', { data })

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

      return true;

    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const update = async (...args: any) => {
    try {
      const m: IWrite<any> = model;
      const [{ _id, ...params }] = args;
      const user = await m.findByIdAndUpdate({ _id } as any, { ...params }, { upsert: true, new: true }).lean();
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
    register,
  };
};
