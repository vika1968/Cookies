"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserByEmail = exports.updateUserByEmail = exports.logout = exports.getUser = exports.login = exports.register = void 0;
const userModel_1 = __importStar(require("./userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const saltRounds = 10;
//-------User registration (server side)------------------
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstname: fname, lastname: lname, email, password } = req.body;
            if (!fname || !lname || !email || !password)
                throw new Error("Not all requered fields received from client on FUNCTION register in file userCtrl");
            const { error } = userModel_1.UserValidation.validate({
                firstname: fname,
                lastname: lname,
                email,
                password
            });
            if (error)
                throw error;
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash = bcrypt_1.default.hashSync(password, salt);
            const userDB = new userModel_1.default({ firstname: fname, lastname: lname, email: email, password: hash });
            yield userDB.save();
            const cookie = { userId: userDB._id };
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("Something wrong with loading secret from .env");
            if (!userDB)
                throw new Error("No user was created");
            const JWTCookie = jwt_simple_1.default.encode(cookie, secret);
            if (userDB) {
                res.cookie("userID", JWTCookie);
                // res.cookie("userID", cookie);
                res.send({ success: true, userDB: userDB });
            }
            else {
                res.send({ register: false });
            }
        }
        catch (error) {
            res.status(500).send({ success: false, error: error.message });
        }
    });
}
exports.register = register;
//-------User login (server side)------------------
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                throw new Error("Something wrong with email or password field in req.body");
            const userDB = yield userModel_1.default.findOne({ email });
            if (!userDB)
                throw new Error(`User with Email ${email} don't match`);
            if (!userDB.password)
                throw new Error(`Password ${password} doesn't found in DB`);
            const isMatch = yield bcrypt_1.default.compare(password, userDB.password);
            if (!isMatch)
                throw new Error("Email and Password don't match");
            const cookie = { userId: userDB._id };
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("Something wrong with loading secret from .env");
            const JWTCookie = jwt_simple_1.default.encode(cookie, secret);
            // res.cookie("userID", JWTCookie);//cookie);
            // res.send({ success: true, userDB: userDB });
            if (userDB) {
                res.cookie("userID", JWTCookie);
                // res.cookie("userID", cookie);
                res.send({ success: true, userDB: userDB });
            }
            else {
                res.send({ success: false });
            }
        }
        catch (error) {
            res.status(500).send({ success: false, error: error.message });
        }
    });
}
exports.login = login;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("No secret loaded from .env file");
            // console.log(req.cookies);
            const { userID } = req.cookies;
            //console.log(userID);
            if (!userID)
                throw new Error("Couldn't find user from cookies");
            const decodedUserId = jwt_simple_1.default.decode(userID, secret);
            const { userId } = decodedUserId;
            const userDB = yield userModel_1.default.findById(userId);
            if (!userDB)
                throw new Error(`Couldn't find user id with the id: ${userID}`);
            res.send({ userDB });
        }
        catch (error) {
            res.send({ error: error.message });
        }
    });
}
exports.getUser = getUser;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie("userID");
            res.send({ logout: true });
        }
        catch (error) {
            res.status(500).send({ error: error.message });
        }
    });
}
exports.logout = logout;
function updateUserByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.params.email;
            const findUser = yield userModel_1.default.findOne({ email });
            if (!findUser)
                throw new Error("Email do not match");
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash = bcrypt_1.default.hashSync(req.body.password, salt);
            //const userDB = new UserModel({ email: email, password: hash });
            const userDB = yield userModel_1.default.findByIdAndUpdate(findUser, { password: hash });
            res.send({ success: true, userDB: userDB });
        }
        catch (error) {
            res.status(500).send({ success: false, error: error.message });
        }
    });
}
exports.updateUserByEmail = updateUserByEmail;
function deleteUserByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.params.email;
            if (!email) {
                throw new Error(`No User found to remove!`);
            }
            const findUser = yield userModel_1.default.findOne({ email });
            if (!findUser)
                throw new Error("Email do not match");
            const userDB = yield userModel_1.default.findByIdAndDelete(findUser);
            res.send({ success: true, userDB: userDB });
        }
        catch (error) {
            res.status(500).send({ success: false, error: error.message });
        }
    });
}
exports.deleteUserByEmail = deleteUserByEmail;
function encodeUserID(req) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("No secret loaded from .env file");
        // console.log(req.cookies);
        const { userID } = req.cookies;
        console.log(userID);
        if (!userID)
            throw new Error("Couldn't find user from cookies");
        const decodedUserId = jwt_simple_1.default.decode(userID, secret);
        // const { userId } = decodedUserId;
        return { decodedUserId };
    }
    catch (error) {
        return ({ success: false, error: error.message });
    }
}
function decodeUserID(req) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("No secret loaded from .env file");
        // console.log(req.cookies);
        const { userID } = req.cookies;
        console.log(userID);
        if (!userID)
            throw new Error("Couldn't find user from cookies");
        const decodedUserId = jwt_simple_1.default.decode(userID, secret);
        // const { userId } = decodedUserId;
        return { decodedUserId };
    }
    catch (error) {
        return ({ success: false, error: error.message });
    }
}
