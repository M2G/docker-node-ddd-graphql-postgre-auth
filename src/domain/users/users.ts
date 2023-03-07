import * as t from 'io-ts';

const Users = t.type({
  _id: t.string,
  created_at: t.number,
  deleted_at: t.number,
  email: t.string,
  first_name: t.string,
  last_connected_at: t.number,
  last_name: t.string,
  modified_at: t.number,
  password: t.string,
  reset_password_expires: t.number,
  reset_password_token: t.string,
  token: t.string,
  username: t.string,
});

export default Users;
