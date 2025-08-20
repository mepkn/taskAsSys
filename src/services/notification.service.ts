import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// In a real app, these values would come from process.env
const EMAIL_HOST = "smtp.ethereal.email";
const EMAIL_PORT = 587;
const EMAIL_USER = "your_ethereal_user@ethereal.email"; // Replace with your Ethereal user
const EMAIL_PASSWORD = "your_ethereal_password"; // Replace with your Ethereal password

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: '"Task Assignment System" <noreply@tasksystem.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};
