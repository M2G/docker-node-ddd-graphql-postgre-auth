/*eslint-disable*/
import { QueryTypes, UniqueConstraintError, Op } from 'sequelize';
import IUser from 'core/IUser';
import toEntity from './transform';
import { comparePassword } from '../../encryption';
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

  const getAll = async ({
    filters,
    pageSize,
    page,
    attributes,
  }: {
    filters: string;
    pageSize: number;
    page: number;
    attributes: string[] | undefined;
  }): Promise<IUser[]> => {
    try {
      console.log('args args args args', {
        filters,
        pageSize,
        page,
        attributes,
      });

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

      const query: {
        where: {
          [Op.or]: [
            {
              deleted_at: number;
              first_name?: string;
              last_name?: string;
              email?: string;
            },
          ];
        };
      } = {
        where: {
          [Op.or]: [{ deleted_at: 0 }],
        },
      };

      if (filters) {
        query.where = {
          [Op.or]: query.where[Op.or].concat([
            { first_name: filters },
            { last_name: filters },
            { email: filters },
          ]),
        };
      }

      console.log('query', query);

      const [total, data] = await Promise.all([
        model.count(),
        model.findAndCountAll({
          ...query,
          attributes,
          offset: pageSize * (page - 1),
          limit: pageSize,
        }),
      ]);

      const pages = Math.ceil(total / pageSize);
      const prev = page > 1 ? page - 1 : null;
      const next = page < pages ? page + 1 : null;

      return {
        results: (data.rows || [])?.map(
          (data: { dataValues }) => toEntity({ ...data.dataValues }) as IUser,
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

  const register = async ({
    created_at,
    email,
    password,
    deleted_at,
  }: {
    created_at: number;
    deleted_at: number;
    email: string;
    password: string;
  }): Promise<IUser> => {
    try {
      const { dataValues } = await model.create({
        created_at,
        deleted_at,
        email,
        password,
      });

      return toEntity({ ...dataValues }) as IUser;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('Duplicate error');
      }

      throw new Error(error as string | undefined);
    }
  };

  const forgotPassword = async ({
    email,
  }: {
    email: string;
  }): Promise<unknown> => {
    try {
      const { dataValues } = await model.findOne({ where: { email } });

      console.log('forgotPassword', dataValues);

      if (!dataValues) return null;

      const payload = {
        id: dataValues.id,
        email: dataValues.email,
        password: dataValues.password,
      };
      const options = {
        subject: dataValues.email,
        audience: [],
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
      };
      const token: string = jwt.signin(options)(payload);

      return update({
        id: dataValues.id,
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000,
      });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const resetPassword = async ({
    password,
    reset_password_token,
  }: {
    password: string;
    reset_password_token: string;
  }): Promise<unknown | null> => {
    try {
      const user = await model.findOne({
        where: {
          reset_password_token,
          reset_password_expires: {
            [Op.gt]: Date.now(),
          }
        },
      });

      console.log('resetPassword', user);

      if (!user) return null;

      user.password = password;
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;

      return update({ ...user });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const findOne = async ({ id }: { id: number }): Promise<unknown | null> => {
    try {
      const { dataValues } = await model.findByPk(id);
      if (!dataValues) return [];
      return toEntity({ ...dataValues });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const remove = ({ id }: { id: number }): number => {
    try {
      return model.destroy({ where: { id } });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const update = ({ id, ...params }: { id: number; params: any }) => {
    console.log('update', { id, ...params });
    try {
      return model.update({ ...params }, { where: { id } });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const authenticate = async ({
    email,
  }: {
    email: string;
  }): Promise<unknown | null> => {
    try {
      const user = await model.findOne({ where: { email } });
      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const validatePassword = (endcodedPassword: string) => (password: string) =>
    comparePassword(password, endcodedPassword);

  const destroy = (...args: any[]) => model.destroy(...args);

  return {
    remove,
    update,
    findOne,
    authenticate,
    resetPassword,
    forgotPassword,
    getAll,
    register,
    validatePassword,
    destroy,
  };
};
