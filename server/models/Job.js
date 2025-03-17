// models/Job.js

import mongoose from "mongoose";
import { Comment } from "./Comments.js"; // Named import for Comment model

const { Schema } = mongoose;

// Existing job schema
const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    estimatedTime: { type: Number, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
    jobNumber: { type: Number, required: true },
    assigned: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    canceled: { type: Boolean, default: false },
    description: { type: String, required: true },
    proposedDate: { type: Date, default: null },
    proposedTime: { type: String, default: "" },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    confirmedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    confirmationTimes: {
      // Map alebo obyčajný objekt s kľúčom = userId, hodnotou = dátum potvrdenia
      type: Map,
      of: Date,
      default: {},
    },
    paymentIntentId: {
      type: String,
      required: false,
    },
    transferAmount: { type: Number, required: false },
    feeAmount: { type: Number, required: false },
    creatorConfirmed: {
      confirmed: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      comment: { type: String, default: "" },
      confirmDate: { type: Date, default: null },
      success: { type: Boolean, default: false },
    },
    workerConfirmed: {
      confirmed: { type: Boolean, default: false },
      workDate: { type: String },
      workTime: { type: String },
      comment: { type: String, default: "" },
      success: { type: Boolean, default: false },
    },
    bothConfirmedSuccessful: { type: Boolean, default: false },
    bothConfirmedUnsuccessful: { type: Boolean, default: false },
    dispute: { type: Boolean, default: false },
    // Add comments field
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // Reference the Comment model
      },
    ],
    photos: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    hasNewActivity: { type: Boolean, default: false }

  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model("Job", jobSchema);

export { JobModel as Job };
