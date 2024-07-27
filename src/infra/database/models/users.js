const table = 'users';

module.exports = function (sequelize, DataTypes) {
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
        type: DataTypes.INTEGER,
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
      timestamps: false,
    },
  );

  return User;
};
