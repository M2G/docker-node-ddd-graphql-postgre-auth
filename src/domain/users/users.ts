import t from 'tcomb';

const Users = t.struct({
  _id: t.maybe(t.Any),
  created_at: t.maybe(t.Number),
  deleted_at: t.maybe(t.Number),
  email: t.maybe(t.String),
  first_name: t.maybe(t.String),
  last_connected_at: t.maybe(t.Number),
  last_name: t.maybe(t.String),
  modified_at: t.maybe(t.Number),
  password: t.maybe(t.String),
  reset_password_expires: t.maybe(t.Number),
  reset_password_token: t.maybe(t.String),
  token: t.maybe(t.String),
  username: t.maybe(t.String),
});

export default Users;
