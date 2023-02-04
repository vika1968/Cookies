import mongoose from "mongoose";
import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    requierd: [true, "user must have first name"]
  },
  lastname: {
    type: String,
    requierd: [true, "user must have last name"]
  },
  email: {
    type: String,
    unique: true,
    requierd: [true, "user must have email"]
  },
  password: String
});

const UserModel = mongoose.model("cookies", UserSchema);

export default UserModel;

export const UserValidation = Joi.object({  
firstname: Joi.string().required(),
lastname: Joi.string().required(),
email: Joi.string().email().required(),
password: joiPassword
    .string()
    .min(6)
    .max(16)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required()
  });

