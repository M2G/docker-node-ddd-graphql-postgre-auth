import type IRefreshToken from 'core/IRefreshToken';

interface ITokenRepository {
  refreshToken: (email: { email: string }) => Promise<IRefreshToken>;
  register: (auth: IRefreshToken) => IRefreshToken;
}

export default ITokenRepository;
