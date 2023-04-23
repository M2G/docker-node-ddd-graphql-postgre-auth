/*eslint-disable*/
import { UniqueConstraintError, Op } from 'sequelize';
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
          deleted_at: number;
          [Op.or]?: [
            {
              email: {
                [Op.like]: string;
              };
            },
            {
              first_name: {
                [Op.like]: string;
              };
            },
            {
              last_name: {
                [Op.like]: string;
              };
            },
          ];
        };
      } = {
        where: {
          deleted_at: 0,
        },
      };

      if (filters) {
        query.where = {
          deleted_at: 0,
          [Op.or]: [
            {
              email: {
                [Op.like]: `%${filters}%`,
              },
            },
            {
              first_name: {
                [Op.like]: `%${filters}%`,
              },
            },
            {
              last_name: {
                [Op.like]: `%${filters}%`,
              },
            },
          ],
        };
      }

      const [total, data] = await Promise.all([
        model.count(),
        model.findAndCountAll({
          ...query,
          attributes,
          offset: pageSize * (page - 1),
          limit: pageSize,
        }, { raw: true }),
      ]);

      const pages = Math.ceil(total / pageSize);
      const prev = page > 1 ? page - 1 : null;
      const next = page < pages ? page + 1 : null;

      return {
        //@ts-ignore
        results: (data.rows || [])?.map(
          //@ts-ignore
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

      console.log('::::::::::::::::::::::::::::::::::', dataValues)

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
      const { dataValues } = await model.findOne({ where: { email } }, { raw: true });

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
        expiresIn: 5 * 60,
        //process.env.JWT_TOKEN_EXPIRE_TIME,
      };
      const token: string = jwt.signin(options)(payload);

      return update({
        id: dataValues.id,
        //@ts-ignore
        reset_password_expires: Date.now() + 86400000,
        reset_password_token: token,
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

    console.log('resetPassword 1', {
      password,
      reset_password_token,
    });

    try {
      const dataValues = await model.findOne(
        {
          where: {
            reset_password_token,
            reset_password_expires: {
              [Op.gt]: Date.now(),
            },
          },
        },
        { raw: true },
      );

      console.log('resetPassword 2', dataValues);

      if (!dataValues) return null;

      dataValues.password = password;
      dataValues.reset_password_token = null;
      dataValues.reset_password_expires = Date.now();

      return update({ ...dataValues });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const findOne = async ({ id }: { id: number }): Promise<unknown | null> => {
    try {
      const data = await model.findByPk(id, { raw: true });
      if (!data) return null;
      return toEntity({ ...data });
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

  const update = ({ id, ...params }: { id: number; params: IUser }) => {
    console.log('update', { id, ...params });
    try {
      return model.update({ ...params }, { where: { id } }, { raw: true });
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
      const user = await model.findOne({ where: { email } }, { raw: true });
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
