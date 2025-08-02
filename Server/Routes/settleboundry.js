import { Router, response } from "express";
import SettleBoundry from "../Models/SettleBoundry.js";











const router=Router();

//add
router.post('/add', async (req, res) => {
    console.log("Received Data:", req.body.firstUser, req.body.secondUser);
    try {
        const newSettleUp = new SettleBoundry({
            members: [req.body.firstUser, req.body.secondUser] // ✅ Correct
        });

        await newSettleUp.save();  // ✅ Await save()
        res.status(200).json({ message: "Success", data: newSettleUp });
    } catch (err) {
        console.error("Error saving to DB:", err);
        res.status(500).json(err);
    }
});


// get 

router.post('/fetch',async (req,res)=>{
    try {
        const { firstUser, secondUser } = req.body;
        console.log("wkdgcvqewuufve",firstUser,secondUser);

        const result = await SettleBoundry.findOne({
            members: { $all: [firstUser, secondUser] }  // ✅ Ensures both users exist
        }).sort({ createdAt: -1 }); // Sort by latest date
        
        //    console.log(result);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error });
    }
});



   export {router as  settleboundryrouter};