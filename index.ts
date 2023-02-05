import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser()); 

dotenv.config();

const mongodb_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose.set('strictQuery', true);

mongoose.connect(mongodb_uri!).then(res => {
  console.log("Connected to DB `test_DB`");
}).catch((err) => {
  console.log("At mongoose.connect:");
  console.log(err.message);
})

import userRoutes from "./API/users/usersRoutes";
app.use("/api/v1/users", userRoutes)

app.listen(PORT, () => {
  console.log(`Server is active on port : ${PORT}`);
});

