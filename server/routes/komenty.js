import express from "express";
import { Comment } from "../models/Comments.js";
import { Job } from "../models/Job.js";
import authMiddleware from "../middleware/auth.js"; // Adjust the path if needed

const router = express.Router();

// Add a new comment to a job
router.post("/jobs/:jobId/comments", authMiddleware, async (req, res) => {
  const { jobId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required." });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const newComment = new Comment({
      job: jobId,
      user: req.user.id, // Use req.user.id from the decoded JWT token
      content,
    });

    await newComment.save();

    // Add the comment ID to the job's comments array
    job.comments.push(newComment._id);
    await job.save();

    res
      .status(201)
      .json({ message: "Comment added successfully.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Get all comments for a job
router.get("/jobs/:jobId/comments", async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId)
      .populate({
        path: "comments",
        populate: [
          { path: "user", select: "firstName lastName email avatar" },
          { path: "replies.user", select: "firstName lastName email avatar" },
        ],
      })
      .exec();

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(200).json({ comments: job.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Add a reply to a comment
router.post(
  "/jobs/:jobId/comments/:commentId/replies",
  authMiddleware,
  async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      const newReply = {
        user: req.user.id, // Use req.user.id from the decoded JWT token
        content,
        createdAt: new Date(),
      };

      comment.replies.push(newReply);
      await comment.save();

      res
        .status(201)
        .json({ message: "Reply added successfully.", reply: newReply });
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

router.put(
  "/jobs/:jobId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required." });
    }

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      // Check if the comment belongs to the logged-in user
      if (comment.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You can only edit your own comments." });
      }

      // Update the comment content
      comment.content = content;
      comment.updatedAt = new Date(); // Optionally add an `updatedAt` field to track changes

      await comment.save();

      res
        .status(200)
        .json({ message: "Comment updated successfully.", comment });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

export default router;
