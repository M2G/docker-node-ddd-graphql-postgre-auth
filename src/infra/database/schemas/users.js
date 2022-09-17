/*eslint-disable*/
// @ts-ignore
export default ({ model, Schema }) => {
  const emailMatch = [
    /([a-z0-9_\-\.])+@([a-z0-9_\-\.])+\.([a-z0-9])+/i,
    'No email found ({VALUE})',
  ];

  /**
   * User schema for mangoose
   * @type {Schema}
   */
  const User = new Schema({
    email: {
      lowercase: true,
      match: emailMatch,
      maxlength: 255,
      minlength: 5,
      trim: true,
      type: String,
      unique: true,
    },
    first_name: {
      maxlength: 100,
      minlength: 2,
      type: String,
    },
    last_name: {
      maxlength: 100,
      minlength: 2,
      type: String,
    },
    username: {
      maxlength: 100,
      minlength: 2,
      lowercase: true,
      trim: true,
      type: String,
    },
    password: {
      maxlength: 100,
      minlength: 5,
      required: true,
      type: String,
    },
    created_at: {
      type: Number,
      default: Math.floor(Date.now() / 1000),
    },
    modified_at: {
      type: Number,
    },
    reset_password_token: {
      type: String,
    },
    reset_password_expires: {
      type: Number,
    },
    deleted_at: {
      type: Number,
    },
    last_connected_at: {
      type: Number,
    },
  });

  return model('User', User);
};
