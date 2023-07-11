import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  password: String,
  name: String,
  phoneNo: String,
  age: Number
});

