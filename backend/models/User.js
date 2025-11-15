import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const UserSchema = new mongoose.Schema(
  {
    fullName: {
      Type: String,
      require: true,
    },
    email: {
      Type: String,
      require: true,
      unique: true,
    },
    password: {
      Type: String,
      require: true,
    },
    profileImageUrl: {
      Type: String,
      default: null,
    },
  },
  { timestamps: true }
);

//hash pass before storing into the db
UserSchema.pre("save",async (next)=>{
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})

//compare the pass
UserSchema.method.comparePassword=async(candidatePassword)=>{
    return await bcrypt.compare(candidatePassword,this.password);
}   