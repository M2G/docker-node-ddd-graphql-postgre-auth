/*eslint-disable*/
import { QueryTypes, UniqueConstraintError } from 'sequelize';
import type { Types } from 'mongoose';
import { IRead, IWrite } from 'core/IRepository';
import IUser from 'core/IUser';
import toEntity from './transform';
// import { convertNodeToCursor, convertCursorToNodeId } from './helpers';

export default ({ model, jwt }: any) => {
  //@TODO working but use in another context
  /*
  const getAll = async (
    ...args: any[]
  ): Promise<{
    edges: { cursor: string; node: { _id: string } }[];
    pageInfo: {
      hasPrevPage: boolean;
      hasNextPage: boolean;
      endCursor: any;
      startCursor: any;
    };
    totalCount: number;
  }> => {
    try {
      const [{ filters, first, afterCursor }]: any = args;
      if (first < 0) {
        throw new Error('First must be positive');
      }
      let afterIndex = 0;

      const query: {
        $or?: (
          | { first_name: { $regex: string; $options: string } }
          | { last_name: { $regex: string; $options: string } }
          | { email: { $regex: string; $options: string } }
        )[];
        deleted_at: { $lte: number };
      } = {
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
      const data: any[] = await m.find(query).sort({ email: 1 }).lean();

      if (afterCursor) {
        /* Extracting nodeId from afterCursor */

  /*
        let nodeId = convertCursorToNodeId(afterCursor);

        const nodeIndex = data?.findIndex(
          (datum: { _id: string }) => datum._id.toString() === nodeId,
        );
        if (nodeIndex === -1) {
          throw new Error('After does not exist');
        }

        if (nodeIndex >= 0) {
          afterIndex = nodeIndex + 1; // 1 is added to exclude the afterIndex node and include items after it
        }
      }

      const slicedData = data?.slice(afterIndex, afterIndex + first);

      const edges = slicedData?.map((node: { _id: string }) => ({
        node,
        cursor: convertNodeToCursor(node),
      }));

      let startCursor = null;
      let endCursor = null;
      if (edges.length > 0) {
        startCursor = convertNodeToCursor(edges[0].node);
        endCursor = convertNodeToCursor(edges[edges.length - 1].node);
      }

      const hasNextPage = data.length > afterIndex + first;
      const hasPrevPage = !!afterIndex;

      return {
        totalCount: data.length,
        edges,
        pageInfo: {
          startCursor,
          endCursor,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };*/

  const getAll = async (...args: any[]) => {
    try {
      const [{ filters, pageSize, page, attributes }]: any = args;

      console.log('args args args args', args);

      /* const query: {
        $or?: (
          | { first_name: { $regex: string; $options: string } }
          | { last_name: { $regex: string; $options: string } }
          | { email: { $regex: string; $options: string } }
        )[];
        deleted_at: { $lte: number };
      } = {
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
      }*/

      // size
      // limit
      // offset

      /*
      const m: IRead<any> = model;
      const users = await m
        .find(query)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ email: 1 })
        .lean();

      console.log('users', users);

      const count = await model.countDocuments();
      const pages = Math.ceil(count / pageSize);
      const prev = page > 1 ? page - 1 : null;
      const next = page < pages ? page + 1 : null;

      return {
        results: (users || [])?.map((user) => toEntity(user)),
        pageInfo: {
          count,
          pages,
          prev,
          next,
        },
      };*/

      const [total, data] = await Promise.all([
        model.count(),
        model.findAndCountAll({
          attributes,
          offset: pageSize * (page - 1),
          limit: pageSize,
        }),
      ]);

      const count = await model.count();

      const pages = Math.ceil(count / pageSize);
      const prev = page > 1 ? page - 1 : null;
      const next = page < pages ? page + 1 : null;

      return {
        results: (data.rows || [])?.map((data: { dataValues: any }) =>
          toEntity({ ...data.dataValues }),
        ),
        pageInfo: {
          count: total,
          pages,
          prev,
          next,
        },
      };
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const register = async (...args: any[]): Promise<any> => {
    try {
      const [{ ...params }] = args;
      const m: IWrite<any> = model;
      return m.create({ ...params });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const forgotPassword = async (...args: any[]): Promise<unknown> => {
    try {
      const [{ ...params }] = args;
      const { ...user }: any = await findOne(params);

      if (!user) return null;

      const { _id, email, password } = <IUser>user;
      const payload = { _id, email, password };
      const options = {
        subject: email,
        audience: [],
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
      };
      const token: string = jwt.signin(options)(payload);

      return update({
        _id,
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000,
      });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const resetPassword = async ({
    password,
    token,
  }: {
    password: string;
    token: string;
  }): Promise<unknown | null> => {
    try {
      const { ...user } = await findOne({
        reset_password_token: token,
        reset_password_expires: {
          $gt: Math.floor(Date.now() / 1000),
        },
      });

      if (!user) return null;

      user.password = password;
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;

      return update({ ...user });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const findOne = async (...args: any[]): Promise<unknown | null> => {
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

  const remove = async ({ _id }: { _id: string }): Promise<unknown | null> => {
    try {
      const m: IWrite<any> = model;

      const user = await m.findByIdAndDelete({ _id }).lean();

      if (!user) return null;

      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const update = async (...args: any) => {
    console.log('------------------------------', args);

    try {
      const m: IWrite<any> = model;
      const [{ _id, ...params }] = args;
      const user = await m
        .findByIdAndUpdate(
          { _id } as unknown as Types.ObjectId,
          { ...params },
          { upsert: true, new: true },
        )
        .lean();

      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const authenticate = async (...args: any[]): Promise<unknown | null> => {
    try {
      const [{ email }] = args;
      const m: IRead<any> = model;
      const user = await m.findOne({ email }).lean();
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
