import mongoose from "mongoose";
import User from "./User.js";
import Group from "./Group.js";


const MessageSchema = new mongoose.Schema(
 {
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  senderName: { type: String, default: "Unknown User" },
  senderPicture: { type: String, default: "" },
  text: String,
},
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
