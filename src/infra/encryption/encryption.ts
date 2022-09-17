import * as bcrypt from 'bcrypt';

const encryptPassword = (password: any) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password: any, encodedPassword: string) =>
  bcrypt.compareSync(password, encodedPassword);

export {
  encryptPassword,
  comparePassword,
};
