import type IUser from 'core/IUser';
import toEntity from 'infra/repositories/token/transform';
import { UniqueConstraintError } from 'sequelize';

export default ({ model, jwt }) => {
  console.log('model', model);

  async function findOne({ token }: { token: string }): Promise<unknown> {
    try {
      return model.findOne({ where: { token } });
    } catch (error) {
      throw new Error(error as string | undefined);
    }
  }

  async function register({
    expiryDate,
    id,
    token,
  }: {
    expiryDate: number;
    id: number;
    token: string;
  }): Promise<IUser> {
    console.log('::::::::::::::::', {
      expiryDate,
      id,
      token,
    });

    try {
      const { dataValues } = await model.create({
        expiryDate,
        id,
        token,
      });

      return toEntity({ ...dataValues }) as IUser;
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('Duplicate error');
      }

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
  return {
    remove,
    findOne,
    register,
  };
};
