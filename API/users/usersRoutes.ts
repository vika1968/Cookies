import express from "express";
import { getUser, login, register, logout, updateUserByEmail, deleteUserByEmail } from "./usersCtrl";

const router = express.Router();

router
  .get("/get-user-by-cookie", getUser)
  .get("/logout", logout)
  .post("/login", login)
  .post("/register", register) 
  .post("/update/:email", updateUserByEmail)
  .delete("/:email", deleteUserByEmail)

export default router;

