"use strict";
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
exports.SendEmails = exports.UploadProfilePic = exports.getSearchResults = exports.deleteLawyer = exports.deleteUser = exports.updateUser = exports.updateLawyer = exports.getUser = exports.getLawyer = exports.getUsers = exports.getLawyers = exports.createLawyer = exports.createUser = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema_js_1 = __importDefault(require("../models/userSchema.js"));
const lawyerSchema_js_1 = __importDefault(require("../models/lawyerSchema.js"));
const s3_js_1 = require("./s3.js");
const send_emails_js_1 = require("./send_emails.js");
const router = express_1.default.Router();
// create new User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new userSchema_js_1.default(req.body);
    try {
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(409).json({ message: error });
    }
});
exports.createUser = createUser;
// create new Lawyer
const createLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newLawyer = new lawyerSchema_js_1.default(req.body);
        yield newLawyer.save();
        res.status(201).json(newLawyer);
    }
    catch (error) {
        res.status(409).json({ message: error });
    }
});
exports.createLawyer = createLawyer;
// get all Lawyers
const getLawyers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lawArea } = req.query;
        const getLawyers = yield lawyerSchema_js_1.default.find();
        res.status(200).json(getLawyers);
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.getLawyers = getLawyers;
// get all Users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Hello friends");
        const getUsers = yield userSchema_js_1.default.find();
        res.status(200).json(getUsers);
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.getUsers = getUsers;
// get lawyer by id
const getLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getLawyer = yield lawyerSchema_js_1.default.findById(id);
        res.status(200).json(getLawyer);
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.getLawyer = getLawyer;
// get user by id
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getUser = yield userSchema_js_1.default.findById(id);
        res.status(200).json(getUser);
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.getUser = getUser;
const updateLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const newLawyer = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);
    const updatedLawyer = Object.assign(Object.assign({}, newLawyer), { _id: id });
    yield lawyerSchema_js_1.default.findByIdAndUpdate(id, updatedLawyer, { new: true });
    res.json(updatedLawyer);
});
exports.updateLawyer = updateLawyer;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const newUser = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);
    const updatedUser = Object.assign(Object.assign({}, newUser), { _id: id });
    yield userSchema_js_1.default.findByIdAndUpdate(id, updatedUser, { new: true });
    res.json(updatedUser);
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);
    yield userSchema_js_1.default.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully." });
});
exports.deleteUser = deleteUser;
const deleteLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`);
    yield lawyerSchema_js_1.default.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully." });
});
exports.deleteLawyer = deleteLawyer;
const getSearchResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchParam } = req.query;
        const param = searchParam.toLowerCase(); // Type assertion to string and then convert to lowercase
        let query = {}; // Initialize an empty query object
        if (param !== "*") {
            // If searchParam is not "*", apply filtering
            query = {
                $or: [
                    {
                        name: {
                            $regex: new RegExp("^" + param, "i"),
                        },
                    },
                    {
                        lawArea: {
                            $regex: new RegExp("^" + param, "i"),
                        },
                    },
                ],
            };
        }
        const lawyers = yield lawyerSchema_js_1.default.find(query);
        res.json(lawyers);
    }
    catch (error) {
        console.error("Error fetching lawyers", error);
        res.status(500).json({ message: error });
    }
});
exports.getSearchResults = getSearchResults;
// export const getUserSearchResults = async (req: Request, res: Response) => {
//   try {
//     const { names } = req.query;
//     const products = await lawyerSchema
//       .find({
//         name: {
//           $regex: new RegExp("^" + names.toLowerCase(), "i"),
//         },
//       })
//       .limit(10);
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products", error);
//     res.status(500).json({ message: error});
//   }
// };
// export const getAreaSearchResults = async (req: Request, res: Response) => {
//   try {
//     const { lawAreas } = req.query;
//     const products = await lawyerSchema
//       .find({
//         lawArea: {
//           $regex: new RegExp("^" + lawAreas.toLowerCase(), "i"),
//         },
//       })
//       .limit(10);
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products", error);
//     res.status(500).json({ message: error});
//   }
// };
// export const likePost = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No post with id: ${id}`);
//   const post = await PostMessage.findById(id);
//   const updatedPost = await PostMessage.findByIdAndUpdate(
//     id,
//     { likeCount: post.likeCount + 1 },
//     { new: true }
//   );
//   res.json(updatedPost);
// };
const UploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield (0, s3_js_1.generateUploadURL)();
        res.status(200).send({ url });
    }
    catch (_a) {
        res.status(409).json({ message: "image upload unsuccesssful" });
    }
});
exports.UploadProfilePic = UploadProfilePic;
const SendEmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming you have the necessary information in the request body
        const { userEmail, lawyerEmail, selectedDateTime } = req.body;
        // Call the function to send confirmation emails
        yield (0, send_emails_js_1.BookAppintment)(userEmail, lawyerEmail, selectedDateTime);
        res.status(200).json({ success: true, message: 'Confirmation emails sent successfully' });
    }
    catch (error) {
        console.error('Error sending confirmation emails:', error);
        res.status(500).json({ success: false, message: 'Failed to send confirmation emails' });
    }
});
exports.SendEmails = SendEmails;
exports.default = router;
