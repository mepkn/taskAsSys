import { Request, Response } from "express";
import User from "../models/user.model";
import crypto from "crypto";
import { sendEmail } from "../services/notification.service";
import { createJWT } from "../utils/jwt";
import validator from "validator";

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
  }

  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "There is no user with that email address." });
  }

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3) Hash token and save to user document
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 4) Set expiry for 10 minutes
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  // 5) Send email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Your password reset token (valid for 10 min)",
      text: message,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: "There was an error sending the email. Try again later!" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is a user, set the new password
  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  const { password } = req.body;
  if (!password || !validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: "You must provide a password with at least 8 characters."});
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log the user in, send JWT
  const token = createJWT({ userId: user._id, role: user.role });

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};
