import { UniqueConstraintError, Op } from 'sequelize';
import type IUser from 'core/IUser';
import { comparePassword } from 'infra/encryption';
import toEntity from './transform';

export default ({ model, jwt }: any) => {
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
  }): Promise<unknown> => {
    try {
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
        model.findAndCountAll(
          {
            ...query,
            attributes,
            limit: pageSize,
            offset: pageSize * (page - 1),
          },
          { raw: true },
        ),
      ]);

      const pages = Math.ceil(total / pageSize);
      const prev = page > 1 ? page - 1 : null;
      const next = page < pages ? page + 1 : null;

      return {
        pageInfo: {
          count: total,
          next,
          pages,
          prev,
        },
        results: (data.rows || [])?.map((data: { dataValues: unknown }) =>
          toEntity({ ...(data.dataValues as any) }),
        ),
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

  const forgotPassword = async ({ email }: { email: string }): Promise<unknown> => {
    try {
      const { dataValues } = await model.findOne({ where: { email } }, { raw: true });

      if (!dataValues) return null;

      const payload = {
        email: dataValues.email,
        id: dataValues.id,
        password: dataValues.password,
      };
      const options = {
        audience: [],
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
        subject: dataValues.email,
      };
      const token: string = jwt.signin(options)(payload);

      return update({
        id: dataValues.id,
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
    try {
      const dataValues = await model.findOne(
        {
          where: {
            reset_password_expires: {
              [Op.gt]: Date.now(),
            },
            reset_password_token,
          },
        },
        { raw: true },
      );

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
    try {
      return model.update({ ...params }, { where: { id } }, { raw: true });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  };

  const authenticate = async ({ email }: { email: string }): Promise<unknown | null> => {
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
    authenticate,
    destroy,
    findOne,
    forgotPassword,
    getAll,
    register,
    remove,
    resetPassword,
    update,
    validatePassword,
  };
};
