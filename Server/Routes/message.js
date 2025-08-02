import { Router } from "express";
import Message from "../Models/Message.js";
const router = Router();




router.get('/:groupId',async function(req,res){
   const { groupId } = req.params;
   try {
       const messages = await Message.find({ group: groupId });
       res.status(200).json(messages);
   } catch (error) {
       res.status(500).json({ error: "Error fetching messages" });
   }
});




   export {router as  messagerouter};



