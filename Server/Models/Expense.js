import mongoose from "mongoose";

// Define the Expense Schema
const ExpenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the group
      ref: "Group", // Optional: Reference to a Group model
      required: false,
    },
    image: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
      maxlength: 50,
    },
    groupName: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user who paid
      ref: "User", // Optional: Reference to a User model
      required: true,
    },

    splits: [
      {
        email: {
          type: String, // Reference to the user who owes
          ref: "User", // Optional: Reference to a User model
          required: true,
        },
        share: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);

// Create the Expense model
const Expense = mongoose.model("Expense", ExpenseSchema);

// Export the Expense model
export default Expense;
