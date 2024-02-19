import nodemailer from "nodemailer";

export const BookAppintment = async (userEmail: string, lawyerEmail: string, selectedDateTime: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhjhawar45@gmail.com', // replace with your Gmail
      pass: 'nqxbsahbnpbrudls', // replace with your Gmail password - you have to generate app password
    },
  });

  const appointmentDate = new Date(selectedDateTime);

  // Format the appointmentDate to a readable string in IST (UTC+5:30)
  const formattedDateTime = appointmentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  
  const mailOptions = {
    from: 'shubhjhawar45@gmail.com', // replace with your Gmail email
    to: userEmail,
    subject: 'Appointment Scheduled',
    text: `An appointment has been scheduled on ${formattedDateTime}. 
We will send you a confirmation email with the meeting link 10 minutes before the scheduled meeting. 

Thank you for booking an appointment with CoLawab.`,
    cc: lawyerEmail,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};
