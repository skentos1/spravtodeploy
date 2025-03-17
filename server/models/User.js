import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  psc: { type: String },
  avatar: { type: String },
  iban: { type: String, required: false }, // Can be required: true if always needed
  stripeAccountId: { type: String, default: null }, // ID of the Stripe custom account
  stripeBankAccountId: { type: String, default: null }, // Optional, depending on use case
  ratings: [
    {
      jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      rating: { type: Number, required: true },
      comment: { type: String },
    },
  ],
});

// Optional: You can add a pre-save hook to validate or normalize IBAN here

const UserModel = mongoose.model("User", userSchema);

export { UserModel as User };
