import { Router, response } from "express";
import Expense from "../Models/Expense.js";
import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import Recent from "../Models/Recent.js";
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









const router=Router();


//Fetch expenses by groupId

router.post('/fetch',async(req,res)=>{
  try{
     
     const id=req.body.id;
     const expenses=await Expense.find({groupId:id});
     res.status(200).json(expenses);
  }
  catch(err){
   res.status(500).json(err);
  }
});



//Fetch expenses by friendId

  router.post('/fetchFriend',async (req,res)=>{
            // console.log("qwuefqwufguergfufgyuf");
   try{

       const currUser=req.body.currUser;
       const friend=req.body.friend;
       const expenses = await Expense.find({
        paidBy: { $in: [currUser._id, friend._id] },
        "splits.email":{$all:[currUser.email, friend.email]}
      });
      

        // console.log(expenses);

       res.status(200).json(expenses);



   }
   catch(err){
      res.status(500).json(err);
   }
  });






//Fetch expenses of Friends

// router.post('/fetch',async(req,res)=>{
//    try{
//       const id=req.body;
//       const expenses=await Expense.find({groupId:id});
//       res.status(200).json(expenses);
//    }
//    catch(err){
//     res.status(500).json(err);
//    }
//  });


   // add expenses

     router.post('/add',upload.single("image"), async (req,res)=>{

      

      try{
               const splits=JSON.parse(req.body.splits);
               const groupId = req.body.groupId && req.body.groupId !== "" ? req.body.groupId : undefined;
               const groupName = req.body.groupName && req.body.groupName !== "" ? req.body.groupName : undefined;
               
               const expenseData=new Expense({
                      groupId:groupId,
                     //  image:req.file.path,
                      desc:req.body.desc,
                      groupName:groupName,
                      amount:req.body.amount,
                      paidBy:req.body.paidBy,
                      splits:splits,

               });

               if (req.file) {
                  expenseData.image = req.file.path; 
                }

                const newExpense= new Expense(expenseData);
   //  console.log(req.file.path);
           const ress=    await newExpense.save();
               res.status(200).json({ message: "Expense added!"});
      }
      catch(err){
  res.status(500).json(err);
      }
    
     });


     // fetch total expenses of currUser by email


     router.post('/getallexpenses',async (req,res)=>{
     try{
        const expenses=await Expense.find({"splits.email":req.body.email});
        // console.log(expenses);
        res.status(200).json(expenses);
     }
     catch(err){
   res.status(500).json(err);
     }
     });




   export {router as expenserouter};