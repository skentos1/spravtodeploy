import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, // new field
  address: { type: String }, // new field
  avatar: { type: String } // new field to store the path of the uploaded image
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
