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
exports.BookAppintment = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const BookAppintment = (userEmail, lawyerEmail, selectedDateTime) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: 'shubhjhawar45@gmail.com',
            pass: 'nqxbsahbnpbrudls', // replace with your Gmail password - you have to generate app password
        },
    });
    const appointmentDate = new Date(selectedDateTime);
    // Format the appointmentDate to a readable string in IST (UTC+5:30)
    const formattedDateTime = appointmentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const mailOptions = {
        from: 'shubhjhawar45@gmail.com',
        to: userEmail,
        subject: 'Appointment Scheduled',
        text: `An appointment has been scheduled on ${formattedDateTime}. 
We will send you a confirmation email with the meeting link 10 minutes before the scheduled meeting. 

Thank you for booking an appointment with Tolaw.`,
        cc: lawyerEmail,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully');
    }
    catch (error) {
        console.error('Error sending confirmation email:', error);
    }
});
exports.BookAppintment = BookAppintment;
