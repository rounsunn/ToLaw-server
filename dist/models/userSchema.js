"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel = new mongoose_1.default.Schema({
    name: String,
    age: {
        type: Number,
        default: 18,
    },
    phone: String,
    email: String,
});
var userSchema = mongoose_1.default.model("userschemas", UserModel);
exports.default = userSchema;
