import { Router } from "express";
import Recent from "../Models/Recent.js";

const router = Router();

// fetch activity

router.get("/getActivity/:email", async (req, res) => {
  try {
    const response = await Recent.find({ "members.email": req.params.email });

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as recentRouter };
