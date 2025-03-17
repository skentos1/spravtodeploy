import express from "express";
import authMiddleware from "../middleware/userAuth.js";
import { Job } from "../models/Job.js";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentRouter = (stripe) => {
  router.post("/create-payment-intent", authMiddleware, async (req, res) => {
    const { amount, jobId } = req.body;

    console.log("Received request to create payment intent");
    console.log("Amount:", amount);
    console.log("Job ID:", jobId);

    try {
      // Ensure all amount calculations are rounded to the nearest integer
      const amountInCents = Math.round(amount * 100);
      const transferAmount = Math.round(amount * 0.8 * 100);
      const feeAmount = Math.round(amount * 0.2 * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents, // amount in cents
        currency: "eur",
        capture_method: "manual", // Add this to authorize the payment but not capture it
        metadata: {
          jobId,
          transferAmount: transferAmount.toString(),
          feeAmount: feeAmount.toString(),
        },
      });

      // Save paymentIntentId to the job
      const job = await Job.findById(jobId);
      if (job) {
        job.paymentIntentId = paymentIntent.id;
        job.transferAmount = transferAmount;
        job.feeAmount = feeAmount;
        await job.save();
      }

      console.log("Payment Intent created successfully:", paymentIntent);
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};

export { createPaymentRouter };
