import { Router, response } from "express";
import GroupSettle from "../Models/GroupSettles.js";











const router=Router();



// addexpense

router.post('/add',async (req,res)=>{
     try{
        const newSettle= new GroupSettle({
         who:req.body.who,
         whom:req.body.whom,
         amount:req.body.amount,
         groupId:req.body.groupId
        });

        newSettle.save();

           res.status(200).json("Success");
     }
     catch(err){
     res.status(500).json(err);
     }
});

//  fetchExpenses

    router.post('/fetch',async (req,res)=>{

    
      try{
         const response=await GroupSettle.find({groupId:req.body.groupId});
         // console.log(response.length);
         console.log(response);
         res.status(200).json(response);
      }
      catch(err){
      res.status(500).json(err);
      }
    });



   export {router as  groupsettlerouter};