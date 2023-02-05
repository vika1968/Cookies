"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
const mongodb_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(mongodb_uri).then(res => {
    console.log("Connected to DB `test_DB`");
}).catch((err) => {
    console.log("At mongoose.connect:");
    console.log(err.message);
});
const usersRoutes_1 = __importDefault(require("./API/users/usersRoutes"));
app.use("/api/v1/users", usersRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is active on port : ${PORT}`);
});
