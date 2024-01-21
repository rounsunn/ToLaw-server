import mongoose from "mongoose";

const LawyerModel = new mongoose.Schema({
  fullName: String,
  lawArea: [String], // An array of strings
  barCouncilNumber: String,
  region: String,
  experience: Number, // A number type
  languages: [String], // An array of strings
  lawCertificate: String, // Assuming a file path or identifier
  charges: Number,
  consultingDuration: String,
  consultingTime: String, // You can further define startTime and endTime if needed
  qualification: String,
  biography: String,
  emailId: String,
  mobileNumber: String,
  profilePic: String, // Assuming a file path or identifier
  stars: Number, // A number type for stars
  reviews: Number, // A number type for reviews
});

const lawyerSchema = mongoose.model("lawyerschemas", LawyerModel);

export default lawyerSchema;
