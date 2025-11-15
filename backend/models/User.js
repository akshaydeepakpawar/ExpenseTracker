import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

//hash pass before storing into the db
UserSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})

//compare the pass
UserSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}   

const User = mongoose.model("User", UserSchema);
export default User;