import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import User from "../Models/User.js";
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const router=Router();



cloudinary.config({ 
  cloud_name: 'dbhybspiw', 
  api_key: '421839447324853', 
  api_secret: '70yV5gki9gZiW8kQbw8LmW1THN4' // Click 'View API Keys' above to copy your API secret
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    format: async () => "png", // Convert all images to PNG
    public_id: (req, file) => file.originalname.split(".")[0], // Set file name
  },
});

const upload = multer({ storage });



//getCurrUser


router.get('/getCurrUser',(req,res)=>{
       if(!req.user){
        res.status(200).json("");
       }
       else{
        res.status(200).json(req.user);
       }
});

// add friend by id

router.post('/addFriend/:id', async (req, res) => {
   try {
     const newFriend = await User.findOne({ email: req.body.email });
 
     if (newFriend._id.toString() === req.params.id) {
      return res.status(202).json("You can't be a friend of yourself");
    }
    
 
     if (newFriend) {
       const currUser = await User.findOne({ _id: req.params.id });
 
       if (!currUser.friends.includes(newFriend._id)) {
         currUser.friends.push(newFriend._id);
         newFriend.friends.push(currUser._id);
         await newFriend.save();
         await currUser.save();
         return res.status(200).json("Friend added successfully");
       } else {
         return res.status(201).json({ message: 'User is already a friend' });
       }
     } else {
       return res.status(401).json('Wrong email');
     }
   } catch (err) {
     return res.status(500).json(err);
   }
 });




 // add friend by email

router.post('/addFriendByEmail/:email', async (req, res) => {
   try {
     const newFriend = await User.findOne({ email: req.body.email });
 
     if (newFriend._id.toString() === req.params.id) {
      return res.status(202).json("You can't be a friend of yourself");
    }
    
 
     if (newFriend) {
       const currUser = await User.findOne({email:req.params.email });
 
       if (!currUser.friends.includes(newFriend._id)) {
         currUser.friends.push(newFriend._id);
         newFriend.friends.push(currUser._id);
         await newFriend.save();
         await currUser.save();
         return res.status(200).json("Friend added successfully");
       } else {
         return res.status(201).json({ message: 'User is already a friend' });
       }
     } else {
       return res.status(401).json('Wrong email');
     }
   } catch (err) {
     return res.status(500).json(err);
   }
 });
 




//getname

router.get('/getname/:id',async (req,res)=>{
   try{
   const user=await User.findOne({_id:req.params.id});
     res.status(200).json(user);
   }
   catch(err){
    res.status(500).json(err);
   }
});

   // getId from Email

   router.get('/emailtoid/:email',async (req,res)=>{

   
    try{
      // console.log(req.params.email);
       const user=await User.findOne({email:req.params.email});
       
       res.status(200).json(user);
    }
    catch(err){
   res.status(500).json(err);
    }
   });


// get user from ID

router.get('/idtoemail/:id',async (req,res)=>{
   try{
     // console.log(req.params.email);

   //   console.log("uyfuriqieugfu0g013",req.params.id);
      const user=await User.findOne({_id:req.params.id});
      
      res.status(200).json(user);
   }
   catch(err){
  res.status(500).json(err);
   }
  });



//   get users from email

router.get('/usersfromemail/:email',async (req,res)=>{
   try{
     // console.log(req.params.email);

   //   console.log("uyfuriqieugfu0g013",req.params.id);
      const user=await User.findOne({email:req.params.email});
      
      res.status(200).json(user);
   }
   catch(err){
  res.status(500).json(err);
   }
  });




  // update user info

  router.post('/updateInfo/:id',upload.single("image"),async (req,res)=>{
    // console.log(req.body);
     try{
         const user=await User.findOne({_id:req.params.id});
       if(req.body.newPassword){
         const isMatch =await  bcrypt.compare(req.body.currPassword, user.password);
         if(!isMatch){
       return   res.status(202).json("Password does't matched");
         }


         else{
          const hashedPassword=await bcrypt.hash(req.body.newPassword,10);
          user.password=hashedPassword;
         
         }
        }

        user.name = req.body.name;
user.email = req.body.email;
user.phone = req.body.phone;
if (req.file) {
  user.profilePicture = req.file.path;
}
await user.save();

        
        


        res.status(200).json("Success");
         
         
     }
     catch(err){
       res.status(500).json(err);
     }
  });

export {router as userRouter}