// Updated JobRouter.js

import express from 'express';
import { Job } from '../models/Job.js';

const router = express.Router();

// Create a new job
router.post('/create', async (req, res) => {
  const { title, category, estimatedTime, address, price, firstName, lastName, phoneNumber, email, description } = req.body;

  try {
    const jobNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const newJob = new Job({
      title,
      category,
      estimatedTime,
      address,
      price,
      firstName,
      lastName,
      phoneNumber,
      email,
      jobNumber,
      description,
      completed: false,
    });

    await newJob.save();
    return res.json({ status: true, message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({ message: 'Error creating job', error: error.message });
  }
});

// Get all incomplete jobs with filters
router.get('/incomplete', async (req, res) => {
  const { category, priceRange, estimatedTime, dateCreated, completionStatus } = req.query;

  let filter = { completed: false };

  if (category) filter.category = category;
  if (completionStatus !== undefined) filter.completed = completionStatus === 'true';
  
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
    filter.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (estimatedTime) {
    const [minTime, maxTime] = estimatedTime.split('-').map(Number);
    filter.estimatedTime = { $gte: minTime, $lte: maxTime };
  }

  let sort = {};
  if (dateCreated === 'newest') {
    sort = { createdAt: -1 };
  } else if (dateCreated === 'oldest') {
    sort = { createdAt: 1 };
  }

  try {
    const jobs = await Job.find(filter).sort(sort);
    return res.json({ status: true, jobs });
  } catch (error) {
    console.error('Error fetching incomplete jobs:', error);
    return res.status(500).json({ message: 'Error fetching incomplete jobs', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.json({ status: true, job });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching job', error });
  }
});

export { router as JobRouter };
