import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import {
  getUsers,
  getLawyers,
  createUser,
  createLawyer,
  getUser,
  getLawyer,
  updateLawyer,
  updateUser,
  deleteLawyer,
  deleteUser,
  getSearchResults,
  UploadProfilePic,
  SendEmails,
  PayByRazorPay,
  ValidatePayByRazorPay,
} from "./controllers/apis.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOLAB_URI as string);

app.get("/", (req, res) => {
  res.send("Hello Word from express ts mongoose");
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}!`);
});

app.get("/users", getUsers);
app.post("/users", createUser);
app.get("/lawyers", getLawyers);
app.post("/lawyers", createLawyer);
app.get("/lawyers/:id", getLawyer);
app.get("/users/:id", getUser);
app.patch("/users/:id", updateUser);
app.patch("/lawyers/:id", updateLawyer);
app.delete("/lawyers/:id", deleteLawyer);
app.patch("/users/:id", deleteUser);
app.get("/search", getSearchResults);
// app.get("/search/name", getUserSearchResults);
// app.get("/search/area", getAreaSearchResults);
app.get("/s3Url", UploadProfilePic);
app.post("/sendemails", SendEmails);
app.post("/order", PayByRazorPay);
app.post("/order/validate", ValidatePayByRazorPay);
