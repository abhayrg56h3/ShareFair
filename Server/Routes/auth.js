import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import User from "../Models/User.js";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import crypto from "crypto";
import nodemailer from "nodemailer";
const router=Router();
dotenv.config();


router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));




router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
  
      // Destroy session and clear cookie
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Session destruction failed" });
        }
  
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
        });
  
        res.status(200).json({ success: true, message: "Logged out successfully" });
      });
    });
  });

router.get('/google/callback',passport.authenticate("google"),(req,res)=>{
  res.redirect(`${process.env.CLIENT_URL}/`);
});






// manual signup


router.post('/signup',async (req,res)=>{


  try{

    
          const email=req.body.email;
          const user=await User.findOne({email:email});
          if(user){
            return res.status(400).json({ success: false, message: "User already exists" });

          }

          const hashedPassword=await bcrypt.hash(req.body.password,10);
          console.log(hashedPassword);
       const newUser= new User({
            name:req.body.username,
            email:req.body.email,
            password:hashedPassword
          });

          newUser.save();
          res.status(201).json({ success: true, message: "User created successfully" });
        }
        catch(err){
          res.status(500).json({ success: false, message: "Signup failed", error: err.message });
        }


});




//manual login

router.post('/login', passport.authenticate('local'), (req, res) => {
  // console.log(req.user);
  res.status(200).json({ success: true, message: "Login successful" });
});




passport.use(new LocalStrategy(
  { usernameField: 'email' },
 async function (email,password,done){
  
  try{
        var user=await User.findOne({email:email});

        if(!user){
          return done(null,false,{message:"User not found"});
        }

        // console.log(user);

        const isMatch =await  bcrypt.compare(password, user.password);
        //  console.log(isMatch);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong password" });
        }
      
    }
    catch(err){
     
              return done(err);
    }
        
  }
))





passport.serializeUser((user,done)=>{
 // console.log(user);
    done(null,user._id);
});
passport.deserializeUser(async(id,done)=>{
  console.log(id);
   const user=  await User.findById(id);
  // console.log(user);
   done(null,user);
  
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.VITE_API_URL}/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      // Look for the user in the database using Google profile id
      const existingUser = await User.findOne({ googleId: profile.id });
      
      if (existingUser) {
        return done(null, existingUser); // User found, return the existing user
      } else {
        // If user doesn't exist, create a new one
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos ? profile.photos[0].value : ''
        });
  
        await newUser.save(); // Wait for the user to be saved in the database
        return done(null, newUser); // Return the newly created user
      }
    } catch (err) {
      return done(err); // If there was an error, pass it to the next middleware
    }
  }));
  







  
  
  // FORGOT PASSWORD
  
  router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    console.log(email);
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: "User not found 😢" });
  
      // Generate token 🔐
      const token = crypto.randomBytes(20).toString("hex");
  
      // Set token & expiry in DB 🕒
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      // Configure mailer 📬
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        to: user.email,
        from: process.env.GMAIL_ID,
        subject: "Password Reset 🔒",
        text: `
  You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
  Click the link below to reset your password:\n\n
  ${process.env.FRONTEND_URL}/reset/${token} \n\n
  This link will expire in 1 hour. If you did not request this, please ignore this email.
        `,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ msg: "Reset link sent successfully! 💌✅" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error ⚠️" });
    }
  });
  
  
  
  
  
  router.post("/reset/:token", async (req, res) => {
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ msg: "Invalid or expired token 😓" });
      }
  
      // 🔐 Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 💾 Update user's password
      user.password = hashedPassword;
  
      // ❌ Clear reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ msg: "Password has been reset successfully! 🔒✅" });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error ⚠️" });
    }
  });
  
  



export {router as authrouter};





