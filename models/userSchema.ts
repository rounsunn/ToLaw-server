import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  name: String,
  age: {
    type: Number,
    default: 18,
  },
  phone: String,
  email: String,
});

var userSchema = mongoose.model("userschemas", UserModel);

export default userSchema;
