import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User extends Document {
  profilePicture: {
    url: string;
    fileId: string;
  };
  fullName: string;
  email: string;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpiry: Date;
  userRole: UserRole;
  password: string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    profilePicture: {
      url: {
        type: String,
        required: true,
      },
      fileId: {
        type: String,
        required: true,
      },
    },
    fullName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      match: [/^.+\@.+\..+$/, "Please use a valid email"],
    },
    userRole: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationCodeExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", userSchema);

export default UserModel;
