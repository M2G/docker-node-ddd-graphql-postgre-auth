interface IRefreshToken {
  id: number;
  token?: string;
  expiryDate?: Date;
}

export default IRefreshToken;
