import express from "express";
import UserModel, { UserValidation } from "./userModel";
import bcrypt from "bcrypt";
import jwt from "jwt-simple";
const saltRounds = 10;

//-------User registration (server side)------------------
export async function register(req: express.Request, res: express.Response) {
  try {
    const { firstname: fname, lastname: lname, email, password } = req.body;

    if (!fname || !lname || !email || !password) throw new Error("Not all requered fields received from client on FUNCTION register in file userCtrl");

    const { error } = UserValidation.validate({
      firstname: fname,
      lastname: lname,
      email,
      password
    });
    if (error) throw error;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const userDB = new UserModel({ firstname: fname, lastname: lname, email: email, password: hash });
    await userDB.save();

    const cookie = { userId: userDB._id };
    if (!userDB) throw new Error("No user was created");

    const JWTCookie = getUserIDfromToken(cookie, 'encode');
    if (userDB) {
      res.cookie("userID", JWTCookie);
      res.send({ success: true, userDB: userDB });
    } else {
      res.send({ register: false });
    }

  } catch (error: any) {
    res.status(500).send({ success: false, error: error.message });
  }
}

//-------User login (server side)------------------
export async function login(req: express.Request, res: express.Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Something wrong with email or password field in req.body");

    const userDB = await UserModel.findOne({ email });
    if (!userDB) throw new Error(`User with Email ${email} don't match`);
    if (!userDB.password) throw new Error(`Password ${password} doesn't found in DB`);

    const isMatch = await bcrypt.compare(password, userDB.password);
    if (!isMatch) throw new Error("Email and Password don't match");

    const cookie = { userId: userDB._id };

    const JWTCookie = getUserIDfromToken(cookie, 'encode');
    if (userDB) {
      res.cookie("userID", JWTCookie);
      res.send({ success: true, userDB: userDB });
    } else {
      res.send({ success: false });
    }

  } catch (error: any) {
    res.status(500).send({ success: false, error: error.message });
  }
}

//-------Identify User (server side)------------------
export async function getUser(req: express.Request, res: express.Response) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("No secret loaded from .env file");
    // console.log(req.cookies);
    const { userID } = req.cookies;

    if (!userID) throw new Error("Couldn't find user from cookies");

    const decodedUserId = getUserIDfromToken(userID, 'decode');
    const { userId } = decodedUserId;

    const userDB = await UserModel.findById(userId);
    if (!userDB) throw new Error(`Couldn't find user id with the id: ${userID}`);

    res.send({ userDB });

  } catch (error) {
    res.send({ error: error.message });
  }
}

//-------Logout User and clear his Cookie (server side)------------------
export async function logout(req: express.Request, res: express.Response) {
  try {
    res.clearCookie("userID");
    res.send({ logout: true });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

//-------Update User data by his email (server side)------------------
export async function updateUserByEmail(req: express.Request, res: express.Response) {
  try {

    const email = req.params.email;
    const findUser = await UserModel.findOne({ email });
    if (!findUser) throw new Error("Email do not match");

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const userDB = await UserModel.findByIdAndUpdate(findUser, { password: hash });
    res.send({ success: true, userDB: userDB });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

//-------Remove User by his email (server side)------------------
export async function deleteUserByEmail(req: express.Request, res: express.Response) {
  try {
    const email = req.params.email;

    if (!email) {
      throw new Error(`No User found to remove!`);
    }

    const findUser = await UserModel.findOne({ email });
    if (!findUser) throw new Error("Email do not match");

    const userDB = await UserModel.findByIdAndDelete(findUser);
    res.send({ success: true, userDB: userDB });

  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
}

//-------Decode / Encode UserID from Token (JWT) (server side)------------------
function getUserIDfromToken(cookie: any, action: string) {
  try {
    let userIDEnd: any;

    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("Something wrong with loading secret from .env");
    if (action == 'encode') {
      userIDEnd = jwt.encode(cookie, secret);
    }
    if (action == 'decode') {
      userIDEnd = jwt.decode(cookie, secret);
    }

    return userIDEnd;

  } catch (error) {
    return ({ success: false, error: error.message });
  }
}
