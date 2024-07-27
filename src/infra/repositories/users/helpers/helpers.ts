import { comparePassword } from 'infra/encryption';

const validatePassword = (endcodedPassword: string) => (password: string) =>
  comparePassword(password, endcodedPassword);

export { validatePassword };
