import {model, models, Schema} from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  cover: String,
  bio: String,
  username: String,
});

const User = models?.User || model('User', UserSchema);

export default User;