const { encryptPassword } = require('../../encryption');

const table = 'users';

// eslint-disable-next-line func-names
module.exports = function (
  /** @type {{ define: (arg0: string, arg1: { created_at: { allowNull: boolean; type: any; }; deleted_at: { allowNull: boolean; type: any; }; email: { allowNull: boolean; type: any; unique: boolean; }; first_name: { allowNull: boolean; type: any; }; id: { autoIncrement: boolean; primaryKey: boolean; type: any; }; last_connected_at: { allowNull: boolean; type: any; }; last_name: { allowNull: boolean; type: any; }; modified_at: { allowNull: boolean; type: any; }; password: { allowNull: boolean; type: any; }; username: { allowNull: boolean; type: any; }; reset_password_expires: { allowNull: boolean; type: any; }; reset_password_token: { allowNull: boolean; type: any; }; }, arg2: { hooks: { beforeCreate: (user: { password_hash: string; dataValues: { password_hash: any; }; }) => void; }; freezeTableName: boolean; timestamps: boolean; classMethods: { associate(): void; }; }) => any; }} */ sequelize,
  /** @type {{ INTEGER: any; STRING: any; }} */ DataTypes,
) {
  const User = sequelize.define(
    table,
    {
      created_at: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      deleted_at: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      first_name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      last_connected_at: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      last_name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      modified_at: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      reset_password_expires: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      reset_password_token: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeCreate: (
          /** @type {{ password_hash: string; dataValues: { password_hash: any; }; }} */ user,
        ) => {
          console.log('beforeCreate dataValues', user);

          user.password = encryptPassword(user.dataValues.password);
        },
      },
      freezeTableName: true,
      timestamps: false,
      classMethods: {
        associate() {
          // associations can be defined here
        },
      },
    },
  );

  return User;
};
