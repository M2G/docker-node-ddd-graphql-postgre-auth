CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  -- https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
  email VARCHAR(254) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  created_at INTEGER NOT NULL,
  modified_at INTEGER,
  reset_password_token VARCHAR(255),
  reset_password_expires INTEGER DEFAULT 0,
  deleted_at INTEGER DEFAULT 0,
  last_connected_at INTEGER DEFAULT 0,
  UNIQUE (email)
);
