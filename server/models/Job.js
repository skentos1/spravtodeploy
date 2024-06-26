import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  jobNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  description: {type: String, required: true},
});

const JobModel = mongoose.model('Job', jobSchema);

export { JobModel as Job };
