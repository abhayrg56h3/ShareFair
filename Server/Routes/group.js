import { Router } from "express";
import Recent from "../Models/Recent.js";
import Group from "../Models/Group.js";
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import User from "../Models/User.js";
const router = Router();
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









//Create Group


router.post("/create", upload.single("groupPicture"), async (req, res) => {
  try {
    // 1️⃣ Parse members array from request body
    const rawMembers = JSON.parse(req.body.members);

    const enrichedMembers = [];

    // 2️⃣ Validate and enrich each member
    for (const member of rawMembers) {
      console.log("🔍 Checking:", member.email);

      const user = await User.findOne({ email: member.email });

      if (!user) {
        console.log("❌ User with this email does not exist:", member.email);
        return res
          .status(400)
          .json({ message: `User with email ${member.email} does not exist` });
      }

      // ✅ Add enriched user info
      enrichedMembers.push({
        email: user.email,
        name: user.name, // Add any other fields you want!
        _id: user._id,
        share:  member.share , // Default share to 0 if not provided
      });
    }

    // 3️⃣ Create group document with enriched members
    const newGroup = new Group({
      name: req.body.name,
      type: req.body.type || "private",
      members: enrichedMembers,
      groupPicture:
        req.file?.path ||
        "https://res.cloudinary.com/dbhybspiw/image/upload/v1709301234/uploads/default_group.png",
      createdBy: req.body.createdBy,
      createdByEmail: req.body.createdByEmail,
    });

    const savedGroup = await newGroup.save();
    console.log("✅ New group saved:", savedGroup._id);

    // 4️⃣ Log recent activity
    const newActivity = new Recent({
      idOfEvent: savedGroup._id,
      members: savedGroup.members,
      whoEmail: savedGroup.createdByEmail,
      who: savedGroup.createdBy,
      name: savedGroup.name,
    });
    await newActivity.save();
    console.log("📝 Activity logged:", savedGroup._id);

    // 5️⃣ Send success response
    res.status(201).json({ message: "🎉 Group created!", group: savedGroup });
  } catch (err) {
    console.error("🔥 Error in /create:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});






// fetch Groups



router.post('/fetch',async (req,res)=>{
     try{
         const email=req.body.email;
         const groups = await Group.find({ "members.email": email });
        res.status(200).json(groups);
     }
     catch(err){
      res.status(500).json("Some Error Occured");
     }
});

export { router as groupRouter };
