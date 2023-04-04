const { encryptPassword } = require('../../encryption');

const table = 'users';

// eslint-disable-next-line func-names
module.exports = function (
  /** @type {{ define: (arg0: string, arg1: { id: { type: any; autoIncrement: boolean; primaryKey: boolean; }; username: { type: any; allowNull: boolean; }; email: { type: any; allowNull: boolean; }; first_name: { type: any; allowNull: boolean; }; last_name: { type: any; allowNull: boolean; }; password: { type: any; allowNull: boolean; }; created_at: { type: any; allowNull: boolean; }; modified_at: { type: any; allowNull: boolean; }; reset_password_token: { type: any; allowNull: boolean; }; reset_password_expires: { type: any; allowNull: boolean; }; deleted_at: { type: any; allowNull: boolean; }; last_connected_at: { type: any; allowNull: boolean; }; }, arg2: { hooks: { beforeCreate: (user: { password_hash: string; dataValues: { password_hash: any; }; }) => void; }; freezeTableName: boolean; timestamps: boolean; classMethods: { associate(): void; }; }) => any; }} */ sequelize,
  /** @type {{ INTEGER: any; STRING: any; }} */ DataTypes,
) {
  const User = sequelize.define(
    table,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modified_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reset_password_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reset_password_expires: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_connected_at: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: (
          /** @type {{ password_hash: string; dataValues: { password_hash: any; }; }} */ user,
        ) => {
          console.log('beforeCreate dataValues', user);

          user.password_hash = encryptPassword(user.dataValues.password_hash);
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
