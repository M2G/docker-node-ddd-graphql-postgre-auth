-- Set params

-- load the pgcrypto extension to gen_random_uuid ()
CREATE EXTENSION pgcrypto;

CREATE FUNCTION random_text(INTEGER)
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT UPPER(
    SUBSTRING(
      (SELECT string_agg(md5(random()::TEXT), '')
       FROM generate_series(
           1,
           CEIL($1 / 32.)::INTEGER)
       ), 1, $1) );
$$;

-- Filling of users
INSERT INTO users(id, username, password, email, first_name, last_name, created_at, modified_at, reset_password_token, reset_password_expires, deleted_at, last_connected_at)
VALUES(DEFAULT, random_text(10), crypt('password', gen_salt('bf')), random_text(10) || '@' || random_text(10) || '.com', random_text(10), random_text(10), statement_timestamp(), statement_timestamp(), random_text(10), statement_timestamp(), 0, 0);
