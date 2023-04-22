// const { encryptPassword } = require('../../encryption');

const table = 'users';

// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes,
) {
  const User = sequelize.define(
    table,
    {
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
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
        type: DataTypes.DATE,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      reset_password_expires: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      reset_password_token: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      username: {
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

          /*user.dataValues.created_at = sequelize.fn('statement_timestamp');
          user.dataValues.modified_at = sequelize.fn('statement_timestamp');
          user.password = encryptPassword(user.dataValues.password);*/
        },
        beforeUpdate : (user, options) => {
          console.log('beforeCreate dataValues', user);
          // user.dataValues.modified_at = sequelize.fn('statement_timestamp');
        }
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
