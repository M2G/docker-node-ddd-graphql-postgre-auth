const table = 'tokens';

module.exports = function (sequelize, DataTypes) {
  const Token = sequelize.define(
    table,
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.STRING,
      },
      expiryDate: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    },
  );

  return Token;
};
