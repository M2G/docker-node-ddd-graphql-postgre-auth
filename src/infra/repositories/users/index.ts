/*eslint-disable*/
import { IRead, IWrite } from 'core/IRepository';
import IUser from 'core/IUser';
import toEntity from './transform';

const convertNodeToCursor = (node: { _id: string; }) => {
  return new Buffer(node._id, 'binary').toString('base64')
}

const convertCursorToNodeId = (cursor: string) => {
  return new Buffer(cursor, 'base64').toString('binary')
}


export default ({ model, jwt }: any) => {
  const getAll = async (...args: any[]) => {
    try {
      const [{ filters, pageSize, page, first, afterCursor }]: any = args;

      let afterIndex = 0;

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
      const data: any[] = await m
        .find(query)
        //.skip(pageSize * (page - 1))
        //.limit(pageSize)
        .sort({ email: 1 })
        .lean();

      console.log('data?.length', data?.length)


      if (typeof afterCursor === 'string') {
        /* Extracting nodeId from afterCursor */
        let nodeId = convertCursorToNodeId(afterCursor)
        /* Finding the index of nodeId */
        let nodeIndex = data?.findIndex((datum: { id: string; }) => datum.id === nodeId)
        if (nodeIndex >= 0) {
          afterIndex = nodeIndex + 1 // 1 is added to exclude the afterIndex node and include items after it
        }
      }

      console.log('afterIndex', afterIndex)
      console.log('first', first)

      const slicedData = data?.slice(afterIndex, afterIndex + first)

      console.log('slicedData', slicedData)

      const edges = slicedData?.map((node: { _id: string; }) => {

        console.log('node node node node', node)
        console.log('convertNodeToCursor(node)', convertNodeToCursor(node))
        return {
          node,
          cursor: convertNodeToCursor(node)
        }
      });

      let startCursor, endCursor = null;
      if (edges.length > 0) {
        startCursor = convertNodeToCursor(edges[0].node)
        endCursor = convertNodeToCursor(edges[edges.length - 1].node)
      }
      let hasNextPage = data.length > afterIndex + first;

      console.log('------------', {
        totalCount: data.length,
        edges,
        pageInfo: {
          startCursor,
          endCursor,
          hasNextPage,
          hasPrevPage: null
        }
      })

      return {
        totalCount: data.length,
        edges,
        pageInfo: {
          startCursor,
          endCursor,
          hasNextPage,
          hasPrevPage: null
        }
      }

    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const register = async (...args: any[]) => {
    try {
      const [{ ...params }] = args;
      const m: IWrite<any> = model;

      console.log('register register', { ...params })

      return m.create({ ...params });
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

      return update({
        _id,
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000
      });
    } catch (error) {
      console.log('forgotPassword error error ', error);

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

      return update({ ...data });
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

      console.log('authenticate params params', params);

      const m: IRead<any> = model;
      const user = await m.findOne({ ...params }).lean();

      console.log('authenticate authenticate authenticate', user);

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
