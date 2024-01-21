"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LawyerModel = new mongoose_1.default.Schema({
    fullName: String,
    lawArea: [String],
    barCouncilNumber: String,
    region: String,
    experience: Number,
    languages: [String],
    lawCertificate: String,
    charges: Number,
    consultingDuration: String,
    consultingTime: String,
    qualification: String,
    biography: String,
    emailId: String,
    mobileNumber: String,
    profilePic: String,
    stars: Number,
    reviews: Number, // A number type for reviews
});
const lawyerSchema = mongoose_1.default.model("lawyerschemas", LawyerModel);
exports.default = lawyerSchema;
