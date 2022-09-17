/*eslint-disable*/
import jwt from 'jsonwebtoken';

export default ({ config }: any) => ({
  decode: (options?: any) => (token: any) => {
    const opt = Object.assign({}, options);
    return jwt.decode(token, opt);
  },
  signin: (options?: any) => (payload: string | object | Buffer) => {
    const opt = Object.assign({}, options);
    return jwt.sign(payload, config.authSecret as string, opt);
  },
  verify: (options?: any) => (token: string) => {
    const opt = Object.assign({}, options, { ignoreExpiration: true });
   return jwt.verify(token, config.authSecret as string, opt);
  }
})
