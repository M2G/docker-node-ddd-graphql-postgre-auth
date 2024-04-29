import { UniqueConstraintError, Op } from 'sequelize';
import type IUser from 'core/IUser';
import toEntity from './transform';
import { comparePassword, encryptPassword } from 'infra/encryption';

const validatePassword = (endcodedPassword: string) => (password: string) =>
  comparePassword(password, endcodedPassword);

export default ({ model, jwt }) => {
  async function getAll({
    filters,
    pageSize,
    page,
    attributes,
  }: {
    filters: string;
    pageSize: number;
    page: number;
    attributes: string[] | undefined;
  }): Promise<unknown> {
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

      const currPage = +page || 1;

      const data = await model.findAll({
        ...query,
        attributes,
        raw: true,
        nest: true,
        limit: pageSize,
        offset: pageSize * (currPage - 1),
      });

      const pages = Math.ceil(data.length / pageSize);
      const prev = currPage > 1 ? currPage - 1 : null;
      const next = pages < currPage ? currPage + 1 : null;
      return {
        pageInfo: {
          count: data.length,
          next,
          pages,
          prev,
        },
        results: data?.length ? data.map((d) => toEntity({ ...d })) : [],
      };
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async function register({
    created_at,
    email,
    password,
    deleted_at,
  }: {
    created_at: number;
    deleted_at: number;
    email: string;
    password: string;
  }): Promise<IUser> {
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
  }

  async function changePassword({
    id,
    password,
    oldPassword,
  }: {
    id: string;
    password: string;
    oldPassword: string;
  }): Promise<unknown> {
    try {
      const dataValues = await model.findOne({ where: { id } }, { raw: true });

      if (
        dataValues?.dataValues?.password &&
        validatePassword(dataValues.dataValues.password)(oldPassword)
      ) {
        const hashPassword = encryptPassword(password);
        return update({ id, password: hashPassword });
      }

      return null;
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async function forgotPassword({ email }: { email: string }): Promise<unknown> {
    try {
      const data = await model.findOne({ where: { email } }, { raw: true });

      if (!data?.dataValues) return null;

      const payload = {
        email: data?.dataValues.email,
        id: data?.dataValues.id,
        password: data?.dataValues.password,
      };
      const options = {
        audience: [],
        expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
        subject: data?.dataValues.email,
      };
      const token: string = jwt.signin(options)(payload);

      return update({
        id: data?.dataValues.id,
        reset_password_expires: Date.now() + 86400000,
        reset_password_token: token,
      });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async function resetPassword({
    password,
    reset_password_token,
  }: {
    password: string;
    reset_password_token: string;
  }): Promise<unknown | null> {
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
  }

  async function findOne({ id }: { id: number }): Promise<unknown | null> {
    try {
      const data = await model.findByPk(id, { raw: true });
      if (!data) return null;
      return toEntity({ ...data });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  function remove({ id }: { id: number }): number {
    try {
      return model.destroy({ where: { id } });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  function update({ id, ...params }: { id: number; params: IUser }): unknown | null {
    try {
      return model.update({ ...params }, { where: { id } }, { raw: true });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async function authenticate({ email }: { email: string }): Promise<unknown | null> {
    try {
      const user = await model.findOne({ where: { email } }, { raw: true });

      console.log('authenticate', user);
      if (!user) return null;
      return toEntity(user);
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  function destroy(...args: any[]) {
    return model.destroy(...args);
  }

  return {
    authenticate,
    changePassword,
    destroy,
    findOne,
    forgotPassword,
    getAll,
    register,
    remove,
    resetPassword,
    update,
  };
};
