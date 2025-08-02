import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    type: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true
    },
    createdByEmail: {
      type: String,
      required: true,
    },

    groupPicture: {
      type: String,
      default: "",
    },

    members: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
