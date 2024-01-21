import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import userSchema from "../models/userSchema.js";
import lawyerSchema from "../models/lawyerSchema.js";
import { generateUploadURL } from "./s3.js";
import { BookAppintment } from "./send_emails.js";

const router = express.Router();

// create new User
export const createUser = async (req: Request, res: Response) => {
  const newUser = new userSchema(req.body);
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

// create new Lawyer
export const createLawyer = async (req: Request, res: Response) => {
  try {
    const newLawyer = new lawyerSchema(req.body);
    await newLawyer.save();
    res.status(201).json(newLawyer);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

// get all Lawyers
export const getLawyers = async (req: Request, res: Response) => {
  try {
    const { lawArea } = req.query;
    const getLawyers = await lawyerSchema.find();
    res.status(200).json(getLawyers);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

// get all Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    console.log("Hello friends");
    const getUsers = await userSchema.find();
    res.status(200).json(getUsers);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

// get lawyer by id
export const getLawyer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getLawyer = await lawyerSchema.findById(id);
    res.status(200).json(getLawyer);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

// get user by id
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const getUser = await userSchema.findById(id);
    res.status(200).json(getUser);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const updateLawyer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newLawyer = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedLawyer = { ...newLawyer, _id: id };

  await lawyerSchema.findByIdAndUpdate(id, updatedLawyer, { new: true });

  res.json(updatedLawyer);
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newUser = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedUser = { ...newUser, _id: id };

  await userSchema.findByIdAndUpdate(id, updatedUser, { new: true });

  res.json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await userSchema.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

export const deleteLawyer = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await lawyerSchema.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

export const getSearchResults = async (req: Request, res: Response) => {
  try {
    const { searchParam } = req.query;
    const param: string = (searchParam as string).toLowerCase(); // Type assertion to string and then convert to lowercase

    let query: any = {}; // Initialize an empty query object

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

    const lawyers = await lawyerSchema.find(query);
    res.json(lawyers);
  } catch (error) {
    console.error("Error fetching lawyers", error);
    res.status(500).json({ message: error });
  }
};

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

export const UploadProfilePic = async (req: Request, res: Response) => {
  try {
    const url = await generateUploadURL();
    res.status(200).send({url});
  } catch {
    res.status(409).json({ message: "image upload unsuccesssful" });
  }
};

export const SendEmails = async (req: Request, res: Response) => {
  try {
    // Assuming you have the necessary information in the request body
    const { userEmail, lawyerEmail, selectedDateTime } = req.body;

    // Call the function to send confirmation emails
    await BookAppintment(userEmail, lawyerEmail, selectedDateTime);

    res.status(200).json({ success: true, message: 'Confirmation emails sent successfully' });
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    res.status(500).json({ success: false, message: 'Failed to send confirmation emails' });
  }
}

export default router;
