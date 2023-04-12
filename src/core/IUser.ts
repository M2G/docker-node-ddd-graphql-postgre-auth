interface IUser {
  id: number;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  password: string;
  created_at?: number;
  modified_at?: number;
  reset_password_token?: string;
  reset_password_expires?: number;
  token?: string;
  deleted_at?: number;
  last_connected_at: number;
}

export default IUser;
