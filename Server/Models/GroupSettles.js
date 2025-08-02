import mongoose from "mongoose";

const UserSubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const GroupSettleSchema = new mongoose.Schema(
  {
    who: {
      type: UserSubSchema,
      required: true,
    },
    whom: {
      type: UserSubSchema,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const GroupSettle = mongoose.model("GroupSettle", GroupSettleSchema);
export default GroupSettle;
