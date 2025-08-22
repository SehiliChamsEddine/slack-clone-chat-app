import mongoose from "mongoose";

type UserType = {
  email: string;
  name: string;
  imageUrl: string;
  clerkId: string;
};

const userSchema = new mongoose.Schema<UserType>({
  email: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  clerkId: { type: String, required: true, unique: true }
},{timestamps:true});

const User = mongoose.model("User", userSchema);

export default User;
