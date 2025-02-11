const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const { userSignupSchema } = require("../middleware/validationSchemas");

// Middleware for Zod validation
const validateSignup = (req, res, next) => {
  try {
    userSignupSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Please fill the details according to the pattern.",
      errors: error.message,
    });
  }
};

router.post(
  "/create-user",
  upload.single("file"),
  validateSignup,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Check if the file is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a profile image.",
        });
      }

      const userEmail = await User.findOne({ email });

      if (userEmail) {
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Error deleting file" });
          }
        });
        return next(new ErrorHandler("User already exists", 400));
      }

      const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "avatar",
      });

      const user = {
        name: name,
        email: email,
        password: password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };

      const activationToken = createActivationToken(user);

      const activationUrl = `https://bioplentypeps.com/activation/${activationToken}`;

      try {
        await sendMail({
          // email: user.email,
          email: "lyotex.dinkar@gmail.com",
          subject: `Request for the activation of ${user.name} accounts.-`,
          message: `
               <!DOCTYPE html>
               <html lang="en">
               <head>
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Activation</title>  
</head>
<body>

    <div align="center" style="border-radius: 8px; padding: 10px; width: 97%; height: 50vh; background-color: rgb(231, 231, 231); padding: 30px 0;">

      <div style="box-shadow: 0px 12px 28px 0px rgba(175, 175, 175, 0.3); text-align: start; background-color: white; max-width: 680px; margin-top: 30px; border-radius: 8px; padding: 20px;">
        
        <p>Hello ${user.name},</p>
        <h2 style= color: #4CAF50">Welcome to Bio Plenty</h2>
        <h4>You've just signed up for a Bio Plenty account and you can now start shopping with Bio Plenty around the world.</h4>
        <p>Please click on this Button and verify the ${user.name} accounts :- </p>
        <p><a href="${activationUrl}" style=" color:#007bff;">Click here for Activation</a></p>
      </div>
    </div>
  </body>
  </html>
                `,
        });
        res.status(201).json({
          success: true,
          message: `Your profile is under review, so please wait some time, we will inform you shortly. Thank you for connect us.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      await sendMail({
        email: user.email,
        subject: `Congratulations on Your Accepted Profile 🎉!`,
        message: `
                    <p>Hello ${user.name},</p>
                    <h4 style="margin-top: 30px">We are thrilled to inform you that your profile has been successfully accepted!</h4>
                    <p>You can now access your account using the credentials provided during registration. To log in, simply visit our website and enter your email address and password:</p>
                    <h4>Website: <a target="_blank" href="www.bioplentypeps.com/login">login</a></h4>
                    <h4>Email: ${user.email}</h4>
                    <h4>Password: *********</h4>
                    <h4>
        If you have any questions or need further assistance, please feel free
        to reach out to our support team at
        <a href="mailto:support@bioplentypeps.com">support@bioplentypeps.com</a> or <a href="tel:+91 9854 4712 12">+91
            9854 4712 12</a>. We are here to help!
      </h4>
                    <h4>Once again, congratulations on becoming a part of our community. </h4>

                    <h4 style="margin-top: 50px;">Best regards,</h4>
                    <h4>Bioplentypeps Team</h4>
                    <h4 style="margin-bottom: 15px;>Bioplentypeps Pvt Ltd</h4>
                    <h4 style="margin-bottom: 15px;><a href="mailto:support@bioplentypeps.com">support@bioplentypeps.com</a></h4>
                    <h4 style="margin-bottom: 15px;><a href="www.bioplentypeps.com">www.bioplentypeps.com</a></h4>
                `,
      });
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Check if user exists
      const existsUser = await User.findById(req.user.id);
      if (!existsUser) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Delete the existing avatar from Cloudinary
      if (existsUser.avatar && existsUser.avatar.public_id) {
        await cloudinary.uploader.destroy(existsUser.avatar.public_id);
      }

      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      // Update user with new avatar details
      existsUser.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      await existsUser.save();

      // Remove the file from local uploads if it exists
      fs.unlinkSync(req.file.path);

      // Respond with updated user data
      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      // Handle errors and return error response
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      console.log(addressId);

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post(
  "/forgot-password-request",
  catchAsyncErrors(async (req, res) => {
    const { email } = req.body;

    console.log("Request received for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate a JWT token
    // const token = jwt.sign(
    //   { email: user.email }, // Payload
    //   process.env.JWT_SECRET_KEY, // Secret key
    //   { expiresIn: "1h" } // Options
    // );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '15m',
    });

    user.resetPasswordToken = token;
    user.resetPasswordTime = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetPageLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;
    const subject = "Password Reset Request!";
    const message = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
</head>
<body>
    <div align="center" style="border-radius: 8px; padding: 10px; width: 97%; height: 50vh; background-color: rgb(231, 231, 231); padding: 30px 0;">
        <div style="box-shadow: 0px 12px 28px 0px rgba(175, 175, 175, 0.3); text-align: start; background-color: white; max-width: 680px; margin-top: 30px; border-radius: 8px; padding: 20px;">
            <p style="font-weight: bold;">Hi ${user.name},</p>
            <p>We received a request to reset the password for your account. Click the link below to reset your password:</p>
            <p>Click <a href="${resetPageLink}">here</a> to Reset Password</p>
            <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
            <p>If you have any issues, feel free to contact our support team.</p>
            <h4>Thank you,</h4>
            <p>The Bioplentypeps Team</p>
            <p style="margin-top: -10px"><a href="mailto:info@bioplentypeps.com">info@bioplentypeps.com</a></p>
            <address style="margin-top: -10px;">Suite 403, Aventura, Florida, 33180. US</address>
        </div>
    </div>
</body>
</html>
`;

    try {
      const response = await sendMail({ email, subject, message });
      return res.json({
        message: "Password reset link sent successfully",
        response,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Error sending email", error });
    }
  })
);

router.post(
  "/reset-password",
  catchAsyncErrors(async (req, res) => {
    const { email, newpassword, token } = req.body;

    try {
      const user = await User.findOne({ email, resetPasswordToken: token });

      if (!user) {
        return res.status(400).json({ message: "Invalid token or email" }); // User or token not found
      }

      // Check if token is expired
      if (user.resetPasswordTime < Date.now()) {
        return res.status(400).json({ message: "Token has expired" });
      }


      // Update user's password and clear reset token and time
      user.password = newpassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;

      await user.save();

      // Send email notification
      const subject = "Your Password Has Been Reset!";
      const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
</head>
<body style="box-sizing: border-box; padding: 0; margin: 0;">
      <div style="width: 97%; overflow: hidden; background-color: rgb(231, 231, 231); padding: 15px;">
  <div style="background-color: white; border-radius: 10px; text-align: start; padding: 20px; box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px">
    <p style="font-weight: bold;">Hi ${user.name},</p>
    <p>
      Your password has been <b style="color: green; text-decoration: underline;">successfully reset</b>. You can now log in using your new password.
    </p>
    <p>If you did not reset your password, please contact our support team immediately at info@bioplentypeps.com</p>
    <h4>Thank you,</h4>
    <p>The Bioplentypeps Team</p>
    <p style="margin-top: -10px"><a href="mailto:info@bioplentypeps.com">info@bioplentypeps.com</a></p>
    <address style="margin-top: -10px;">Suite 403, Aventura, Florida, 33180. US</address>
  </div>
</div>
</body>
</html>`;

      const response = await sendMail({ email, subject, message });
      res.json({ message: "Password reset successfully", response });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

module.exports = router;
