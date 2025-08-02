import { Router, response } from "express";
import Settle from "../Models/Settle.js";











const router=Router();



// addexpense

router.post('/add',async (req,res)=>{
     try{
        const newSettle= new Settle({
         who:req.body.who.email,
         whom:req.body.whom.email,
         whoName:req.body.who.name,
         whomName:req.body.whom.name,
         amount:req.body.amount,
         groupName:req.body.groupName
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

      console.log(req.body.email);
      try{
         const response=await Settle.find({$or:[
            {who:req.body.email},
            {whom:req.body.email}
         ]});
         // console.log(response.length);
         res.status(200).json(response);
      }
      catch(err){
      res.status(500).json(err);
      }
    });



   export {router as  settlerouter};