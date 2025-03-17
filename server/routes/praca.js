import express from "express";
import jwt from "jsonwebtoken";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import authMiddleware from "../middleware/userAuth.js";
import {
  sendCompletionStatusEmail,
  sendCreatorCompletionConfirmationEmail,
  sendCreatorNotificationEmail,
  sendJobCreationEmail,
  sendWorkerCompletionConfirmationEmail,
  sendWorkerCompletionNotificationEmail,
  sendWorkerConfirmationEmail,
  sendWorkerConfirmedAndPaymentIntentEmail,
  sendWorkerSignupNotificationToCreator,
  sendWorkerTimeUpdateEmail,
} from "../mailer.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { sendWorkerSignupEmail } from "../mailer.js";
import mongoose from "mongoose";
import Stripe from "stripe";

// Nastavenie adresára pre fotky práce
const jobPicturesDir = path.join(path.resolve(), "job_pictures");
if (!fs.existsSync(jobPicturesDir)) {
  fs.mkdirSync(jobPicturesDir, { recursive: true });
}

// Konfigurácia Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, jobPicturesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max. veľkosť 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValid = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Povolené sú iba .jpeg, .jpg a .png súbory."));
    }
  },
});
// Definuj __dirname, ak používaš ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobRouter = (stripe) => {
  const router = express.Router();

  router.post(
    "/create",
    authMiddleware,
    upload.array("photos", 5),
    async (req, res) => {
      const {
        title,
        category,
        estimatedTime,
        address,
        city,
        district,
        price,
        firstName,
        lastName,
        phoneNumber,
        email,
        description,
      } = req.body;

      try {
        const jobNumber = Math.floor(1000000000 + Math.random() * 9000000000);

        const photos = req.files
          ? req.files.map((file) => ({
              url: `/job_pictures/${file.filename}`,
              filename: file.filename,
            }))
          : []; // Ak nie sú fotky, pole zostane prázdne

        const newJob = new Job({
          title,
          category,
          estimatedTime,
          address,
          city,
          district,
          price,
          firstName,
          lastName,
          phoneNumber,
          email,
          jobNumber,
          description,
          photos, // Prázdne pole alebo pole s fotkami
          createdBy: req.user._id,
        });

        await newJob.save();

        // Odoslanie notifikačného emailu
        await sendJobCreationEmail({
          email,
          title,
          category,
          estimatedTime,
          address,
          city,
          district,
          price,
          firstName,
          lastName,
          phoneNumber,
          jobNumber,
          description,
        });

        return res.json({
          status: true,
          message: "Práca bola úspešne vytvorená.",
          job: newJob,
        });
      } catch (error) {
        console.error("Chyba pri vytváraní práce:", error);
        return res.status(500).json({
          message: "Chyba pri vytváraní práce",
          error: error.message,
        });
      }
    }
  );

  // /jobs/summary
  router.get("/summary", authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
  
      // 1) Nájdeme počet jobov, kde je používateľ = createdBy a job má hasNewActivity
      const creatorActivityQuery = await Job.find({
        createdBy: userId,
        hasNewActivity: true,
      });
      const creatorActivityCount = creatorActivityQuery.length;
  
      // 2) Nájdeme počet jobov, kde je používateľ v assignedUsers a job má hasNewActivity
      const workerActivityQuery = await Job.find({
        assignedUsers: userId,
        hasNewActivity: true,
      });
      const workerActivityCount = workerActivityQuery.length;
  
      // Prípadne ďalšie dopyty (napr. "accountNotificationsCount")
      // Tu by si mohol hľadať iné typy notifikácií, ak chceš zobraziť pri "Môj Účet"
      let accountNotificationsCount = workerActivityCount + creatorActivityCount; 
      // Napr. keby existujú joby bez ohľadu na rolu, ale user je mentionovaný? 
      // V tomto príklade to nechávame tak.
  
      // Poslať frontendu
      return res.json({
        creatorActivityCount,
        workerActivityCount,
        accountNotificationsCount,
      });
    } catch (error) {
      console.error("Error in /jobs/summary endpoint:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });


  // Get user jobs

  router.get("/myjobs", authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 12 } = req.query; // Get page and limit from query params
      const skip = (page - 1) * limit;

      const jobs = await Job.find({ createdBy: userId })
        .sort({ updatedAt: -1 }) // Sort by last updated date, newest first
        .populate("assignedUsers") // Make sure to populate assigned users
        .populate("confirmedUsers") // Make sure to populate confirmed users
        .skip(skip)
        .limit(parseInt(limit));

      const totalJobs = await Job.countDocuments({ createdBy: userId });

      res.json({ status: true, jobs, totalJobs });
    } catch (error) {
      console.error("Error fetching user jobs:", error);
      res
        .status(500)
        .json({ message: "Error fetching user jobs", error: error.message });
    }
  });
  // Update a job
  router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const {
      title,
      category,
      estimatedTime,
      city,
      district,
      address,
      price,
      firstName,
      lastName,
      phoneNumber,
      email,
      description,
    } = req.body;

    try {
      const job = await Job.findOne({ _id: id, createdBy: req.user._id });
      if (!job) {
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized" });
      }

      job.title = title || job.title;
      job.category = category || job.category;
      job.estimatedTime = estimatedTime || job.estimatedTime;
      job.district = district || job.district;
      job.city = city || job.city;
      job.address = address || job.address;
      job.price = price || job.price;
      job.firstName = firstName || job.firstName;
      job.lastName = lastName || job.lastName;
      job.phoneNumber = phoneNumber || job.phoneNumber;
      job.email = email || job.email;
      job.description = description || job.description;

      await job.save();
      return res.json({
        status: true,
        message: "Job updated successfully",
        job,
      });
    } catch (error) {
      console.error("Error updating job:", error);
      return res
        .status(500)
        .json({ message: "Error updating job", error: error.message });
    }
  });
  // Endpoint pre nahrávanie fotiek
  router.post(
    "/:id/photos",
    authMiddleware,
    upload.single("photo"),
    async (req, res) => {
      const { id } = req.params;
      try {
        const job = await Job.findById(id);
        if (!job || job.createdBy.toString() !== req.user._id.toString()) {
          return res
            .status(404)
            .json({ message: "Job not found or unauthorized" });
        }

        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const photo = {
          filename: req.file.filename,
          url: `${process.env.API_BASE_URL}/job_pictures/${req.file.filename}`,
        };

        job.photos.push(photo);
        await job.save();

        res.status(201).json({ photo });
      } catch (error) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ message: "Error uploading photo" });
      }
    }
  );
  // Endpoint pre mazanie fotiek
  router.delete("/:id/photos/:filename", authMiddleware, async (req, res) => {
    const { id, filename } = req.params;

    try {
      const job = await Job.findById(id);
      if (!job || job.createdBy.toString() !== req.user._id.toString()) {
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized" });
      }

      // Overenie, či fotka existuje v práci
      const photoIndex = job.photos.findIndex(
        (photo) => photo.filename === filename
      );
      if (photoIndex === -1) {
        return res.status(404).json({ message: "Photo not found" });
      }

      // Odstránenie fotky zo zoznamu v databáze
      const [removedPhoto] = job.photos.splice(photoIndex, 1);
      await job.save();

      // Odstránenie fotky zo súborového systému
      const filePath = path.join(path.resolve(), "job_pictures", filename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${filename}:`, err);
          } else {
            console.log(`Deleted file: ${filename}`);
          }
        });
      }

      res
        .status(200)
        .json({ message: "Photo deleted successfully", photo: removedPhoto });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Error deleting photo" });
    }
  });
  // Delete a job
  router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
      const job = await Job.findOneAndDelete({
        _id: id,
        createdBy: req.user._id,
      });

      if (!job) {
        return res
          .status(404)
          .json({ message: "Job not found or unauthorized" });
      }

      // Path to the job_pictures directory
      const jobPicturesDir = path.join(__dirname, "../job_pictures");

      // Delete associated photos from the directory
      if (job.photos && job.photos.length > 0) {
        job.photos.forEach((photo) => {
          const filePath = path.join(jobPicturesDir, photo.filename);
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${photo.filename}:`, err);
              } else {
                console.log(`Deleted file: ${photo.filename}`);
              }
            });
          }
        });
      }

      return res.json({
        status: true,
        message: "Job and photos deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting job:", error);
      return res
        .status(500)
        .json({ message: "Error deleting job", error: error.message });
    }
  });

  router.post("/:jobId/confirm-creator", authMiddleware, async (req, res) => {
    const { jobId } = req.params;
    const { comment, rating, workerId, status } = req.body;

    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (!job.createdBy.equals(req.user._id)) {
        return res
          .status(403)
          .json({ message: "Only the creator can confirm this job" });
      }

      job.creatorConfirmed = {
        confirmed: true,
        rating,
        comment,
        success: status === "successful",
        confirmDate: new Date(),
      };

      const worker = await User.findById(workerId);
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }

      worker.ratings.push({ jobId, rating, comment });

      let jobStatus;

      if (job.creatorConfirmed.confirmed && job.workerConfirmed.confirmed) {
        if (job.creatorConfirmed.success && job.workerConfirmed.success) {
          job.bothConfirmedSuccessful = true;
          job.completed = true;

          // Capture the payment intent
          const paymentIntent = await stripe.paymentIntents.capture(
            job.paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            throw new Error(
              `PaymentIntent capture failed with status: ${paymentIntent.status}`
            );
          }

          console.log("PaymentIntent captured successfully:", paymentIntent);

          // Vytvorenie transferu financovaného z daného Payment Intentu
          if (worker.stripeAccountId) {
            const transfer = await stripe.transfers.create({
              amount: job.transferAmount, // Predpokladáme, že máte uloženú sumu pre výplatu workera
              currency: "eur",
              destination: worker.stripeAccountId,
              source_transaction: paymentIntent.charges.data[0].id, // Prepojenie s konkrétnym charge z Payment Intentu
              transfer_group: `Job_${jobId}`,
            });

            console.log("Transfer created successfully:", transfer);
          } else {
            console.error("Worker does not have a Stripe account set up.");
          }

          jobStatus = "successful";
        } else if (
          !job.creatorConfirmed.success &&
          !job.workerConfirmed.success
        ) {
          job.bothConfirmedUnsuccessful = true;
          job.completed = false;
          job.canceled = true;

          try {
            const canceledPaymentIntent = await stripe.paymentIntents.cancel(
              job.paymentIntentId
            );
            console.log("Payment Intent canceled:", canceledPaymentIntent);
          } catch (cancelError) {
            console.error(
              "Error canceling PaymentIntent:",
              cancelError.message
            );
            return res.status(500).json({
              message: "Error canceling PaymentIntent",
              error: cancelError.message,
            });
          }

          jobStatus = "unsuccessful";
        } else {
          // Handle dispute
          job.dispute = true;
          job.canceled = false;
          job.completed = false;
          // Notify admin or mediator for manual intervention
          console.log("Dispute detected. Admin intervention required.");

          jobStatus = "dispute";
        }
      }

      await job.save();
      await worker.save();

      const creatorDetails = {
        firstName: req.user.firstName,
        email: req.user.email,
      };

      const jobDetails = {
        title: job.title,
        category: job.category,
        estimatedTime: job.estimatedTime,
        district: job.district,
        city: job.city,
        address: job.address,
        price: job.price,
        jobNumber: job.jobNumber,
        description: job.description,
      };

      const creatorConfirmation = {
        comment,
        rating,
        success: status === "successful",
      };

      try {
        await sendCreatorCompletionConfirmationEmail(
          creatorDetails,
          jobDetails,
          creatorConfirmation
        );

        const workerDetails = {
          firstName: worker.firstName,
          email: worker.email,
        };

        await sendWorkerCompletionNotificationEmail(
          workerDetails,
          jobDetails,
          creatorConfirmation
        );

        if (jobStatus) {
          const creatorConfirmation = {
            comment: job.creatorConfirmed.comment,
            rating: job.creatorConfirmed.rating,
            success: job.creatorConfirmed.success,
          };

          const workerConfirmation = {
            comment: job.workerConfirmed.comment,
            rating: worker.ratings.find((r) => r.jobId.equals(jobId)).rating,
            success: job.workerConfirmed.success,
          };

          await sendCompletionStatusEmail(
            creatorDetails,
            workerDetails,
            jobDetails,
            creatorConfirmation,
            workerConfirmation,
            jobStatus
          );
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      return res.json({
        status: true,
        message: "Job confirmed by creator",
        job,
      });
    } catch (error) {
      console.error("Error confirming job by creator:", error);
      return res.status(500).json({
        message: "Error confirming job by creator",
        error: error.message,
      });
    }
  });

  //potvrdenie dokoncenia prace workerom
  // Confirm job completion by worker
  router.post("/:jobId/confirm-worker", authMiddleware, async (req, res) => {
    const { jobId } = req.params;
    const { workDate, workTime, comment, status } = req.body;

    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (!job.confirmedUsers.includes(req.user._id)) {
        return res
          .status(403)
          .json({ message: "User not assigned to this job" });
      }

      job.workerConfirmed = {
        confirmed: true,
        workDate,
        workTime,
        comment,
        success: status === "successful",
      };

      let jobStatus;
      let creator;
      let worker;

      if (job.creatorConfirmed.confirmed && job.workerConfirmed.confirmed) {
        creator = await User.findById(job.createdBy);
        worker = await User.findById(job.assignedUsers[0]); // Assuming there's only one assigned user

        if (job.creatorConfirmed.success && job.workerConfirmed.success) {
          job.bothConfirmedSuccessful = true;
          job.completed = true;

          // Capture the payment intent
          const paymentIntent = await stripe.paymentIntents.capture(
            job.paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            throw new Error(
              `PaymentIntent capture failed with status: ${paymentIntent.status}`
            );
          }

          console.log("PaymentIntent captured successfully:", paymentIntent);

          // Vytvorenie transferu financovaného z daného Payment Intentu
          if (worker.stripeAccountId) {
            const transfer = await stripe.transfers.create({
              amount: job.transferAmount, // Predpokladáme, že máte uloženú sumu pre výplatu workera
              currency: "eur",
              destination: worker.stripeAccountId,
              source_transaction: paymentIntent.charges.data[0].id, // Prepojenie s konkrétnym charge z Payment Intentu
              transfer_group: `Job_${jobId}`,
            });

            console.log("Transfer created successfully:", transfer);
          } else {
            console.error("Worker does not have a Stripe account set up.");
          }

          jobStatus = "successful";
        } else if (
          !job.creatorConfirmed.success &&
          !job.workerConfirmed.success
        ) {
          job.bothConfirmedUnsuccessful = true;
          job.completed = false;
          job.canceled = true;

          try {
            const canceledPaymentIntent = await stripe.paymentIntents.cancel(
              job.paymentIntentId
            );
            console.log("Payment Intent canceled:", canceledPaymentIntent);
          } catch (cancelError) {
            console.error(
              "Error canceling PaymentIntent:",
              cancelError.message
            );
            return res.status(500).json({
              message: "Error canceling PaymentIntent",
              error: cancelError.message,
            });
          }

          jobStatus = "unsuccessful";
        } else {
          // Handle dispute
          job.dispute = true;
          job.canceled = false;
          job.completed = false;
          // Notify admin or mediator for manual intervention
          console.log("Dispute detected. Admin intervention required.");

          jobStatus = "dispute";
        }

        await job.save();

        const workerDetails = {
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
        };

        const jobDetails = {
          title: job.title,
          category: job.category,
          estimatedTime: job.estimatedTime,
          district: job.district,
          city: job.city,
          address: job.address,
          price: job.price,
          jobNumber: job.jobNumber,
          description: job.description,
          creatorFirstName: job.firstName,
          creatorEmail: job.email,
        };

        const workerConfirmation = {
          workDate,
          workTime,
          comment,
          success: status === "successful",
        };

        try {
          await sendWorkerCompletionConfirmationEmail(
            workerDetails,
            jobDetails,
            workerConfirmation
          );
          await sendCreatorNotificationEmail(
            workerDetails,
            jobDetails,
            workerConfirmation
          );

          if (jobStatus && creator) {
            const creatorDetails = {
              firstName: creator.firstName,
              email: creator.email,
            };

            const workerConfirmationDetails = {
              comment: job.workerConfirmed.comment,
              rating: worker.ratings.find((r) => r.jobId.equals(jobId)).rating,
              success: job.workerConfirmed.success,
            };

            await sendCompletionStatusEmail(
              creatorDetails,
              workerDetails,
              jobDetails,
              job.creatorConfirmed,
              workerConfirmationDetails,
              jobStatus
            );
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return res.status(500).json({
            status: false,
            message: "Error sending email",
            error: emailError.message,
          });
        }
      } else {
        await job.save();
      }

      res.json({ status: true, message: "Job confirmed successfully", job });
    } catch (error) {
      console.error("Error confirming the job:", error);
      res
        .status(500)
        .json({ status: false, message: "Server error", error: error.message });
    }
  });

  // Zapisanie sa na prácu
  // Zapisanie sa na prácu
  router.post("/:jobId/signup", authMiddleware, async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;
    const { proposedDate } = req.body;

   

    try {
      const user = await User.findById(userId);
      //console.log(`User found: ${userId}`);

      if (!user.phone || !user.iban) {
        console.log(`User ${userId} is missing phone number or IBAN.`);
        return res.status(400).json({
          message:
            "Prosím, doplňte svoje telefónne číslo a IBAN vo svojom profile.",
        });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        console.error(`Job not found: ${jobId}`);
        return res.status(404).json({ message: "Práca nebola nájdená" });
      }

      //console.log(`Job found: ${jobId}`);

      if (job.assignedUsers.includes(userId)) {
        console.error(`User ${userId} already assigned to job ${jobId}`);
        return res
          .status(400)
          .json({ message: "Už ste prihlásený na túto prácu" });
          // Vytvoríme Date objekt zo zadaného proposedDate
    
      }
      // Vytvoríme Date objekt zo zadaného proposedDate
    const fullDate = new Date(proposedDate);

    // Pre proposedDate (iba dátum) nastavíme čas na 00:00:00
    const dateOnly = new Date(fullDate);
    dateOnly.setHours(0, 0, 0, 0);

    // Pre proposedTime získame čas vo formáte "HH:mm" (24-hodinový formát)
    const timeString = fullDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Uložíme dátum a čas do dokumentu práce
    job.proposedDate = dateOnly;
    job.proposedTime = timeString;

      console.log(`User ${userId} not yet assigned to job ${jobId}`);

      // Kontrola, či má užívateľ Stripe účet
      if (user.stripeAccountId) {
        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        if(!account.payouts_enabled){
          return res.status(400).json({
            message: "Váš účet je v pozastavenom režime, prosím kontaktujte náš support pomocou emailu spravtozamna.sk@gmail.com"
          });
        }
      }else{
        try {
          // Vytvorenie Stripe Custom Account
          const account = await stripe.accounts.create({
            type: "custom",
            country: "SK", // SK pre Slovensko
            email: user.email,
            business_type: "individual",
            capabilities: {
              transfers: { requested: true },
            },
            tos_acceptance: {
              date: Math.floor(Date.now() / 1000), // Čas v sekundách od 1970-01-01
              ip: req.ip, // IP adresa používateľa, ktorá akceptuje podmienky
            },
            business_profile: {
              url: "https://spravtozamna.sk", // Sem vložte URL adresu vášho biznisu
            },
            individual: {
              first_name: user.firstName,
              last_name: user.lastName,
              email: user.email,
              phone: user.phone,
              dob: {
                day: 1, // Dátum narodenia užívateľa - musíte to získať z užívateľa
                month: 1,
                year: 1990,
              },
              address: {
                line1: "hornakova 1",
                city: "Presov",
                postal_code: "0801",
                country: "SK",
              },
            },
          });

          console.log(
            `Stripe account created for user ${userId}: ${account.id}`
          );

          // Pridanie IBAN-u k Stripe účtu
          const bankAccount = await stripe.accounts.createExternalAccount(
            account.id,
            {
              external_account: {
                object: "bank_account",
                country: "SK", // SK pre Slovensko
                currency: "eur",
                account_holder_name: `${user.firstName} ${user.lastName}`,
                account_holder_type: "individual",
                account_number: user.iban, // Použite `account_number` namiesto `iban`
              },
            }
          );

          console.log(
            `IBAN added to Stripe account ${account.id} for user ${userId}`
          );

          // Uloženie Stripe Account ID do databázy
          user.stripeAccountId = account.id;
          await user.save();

          console.log(`User ${userId} Stripe account ID saved in database.`);
        } catch (error) {
          console.error(
            "Error creating Stripe account or assigning IBAN:",
            error
          );
          return res.status(500).json({
            message: "Chyba pri vytváraní Stripe účtu alebo priraďovaní IBAN-u",
            error: error.message,
          });
        }
      }

      job.assignedUsers.push(userId);
      await job.save();

      console.log(`User ${userId} assigned to job ${jobId}`);

      const workerDetails = {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone
      };

      const jobDetails = {
        title: job.title,
        category: job.category,
        estimatedTime: job.estimatedTime,
        district: job.district,
        city: job.city,
        address: job.address,
        price: job.price,
        jobNumber: job.jobNumber,
        description: job.description,
        creatorFirstName: job.firstName,
        creatorLastName: job.lastName,
        creatorPhoneNumber: job.phoneNumber,
        creatorEmail: job.email,
        proposedDate: job.proposedDate,
        proposedTime: job.proposedTime
      };

      try {
        await sendWorkerSignupEmail(workerDetails, jobDetails);
        console.log(`Signup email sent to worker ${userId}`);
      } catch (emailError) {
        console.error("Error sending email to worker:", emailError);
        return res.status(500).json({
          message: "Chyba pri odosielaní emailu",
          error: emailError.message,
        });
      }

      try {
        await sendWorkerSignupNotificationToCreator(workerDetails, jobDetails);
        console.log(`Notification email sent to job creator for job ${jobId}`);
      } catch (emailError) {
        console.error("Error sending email to job creator:", emailError);
        return res.status(500).json({
          message: "Chyba pri odosielaní emailu pre tvorcu",
          error: emailError.message,
        });
      }

      const userConfirmed = job.confirmedUsers.some((user) =>
        user._id.equals(req.user._id)
      );
      const userAssigned = job.assignedUsers.some((user) =>
        user._id.equals(req.user._id)
      );
      const isJobConfirmed = job.confirmedUsers.length > 0;

      console.log(`User ${userId} successfully signed up for job ${jobId}`);

      res.json({
        message: "Úspešne ste sa prihlásili na prácu",
        job: {
          id: job._id,
          title: job.title,
          category: job.category,
          estimatedTime: job.estimatedTime,
          city: job.city,
          district: job.district,
          address: job.address,
          price: job.price,
          description: job.description,
          firstName: job.firstName,
          lastName: job.lastName,
          phoneNumber: job.phoneNumber,
          email: job.email,
          proposedDate: job.proposedDate,
          proposedTime: job.proposedTime,
        },
        userConfirmed,
        userAssigned,
        isJobConfirmed,
      });
    } catch (error) {
      console.error("Error in signup route:", error);
      res.status(500).json({ message: "Chyba servera", error: error.message });
    }
  });

  // Odhlasenie sa z prace
  router.delete("/:jobId/unregister", authMiddleware, async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Práca nebola nájdená" });
      }

      if (!job.assignedUsers.includes(userId)) {
        return res
          .status(400)
          .json({ message: "Používateľ nie je prihlásený na túto prácu" });
      }

      job.assignedUsers = job.assignedUsers.filter((id) => !id.equals(userId));
      await job.save();

      const userConfirmed = job.confirmedUsers.some((user) =>
        user._id.equals(req.user._id)
      );
      const userAssigned = job.assignedUsers.some((user) =>
        user._id.equals(req.user._id)
      );
      const isJobConfirmed = job.confirmedUsers.length > 0;

      res.json({
        message: "Úspešne ste sa odhlásili z práce",
        job: {
          id: job._id,
          title: job.title,
          category: job.category,
          estimatedTime: job.estimatedTime,
          city: job.city,
          district: job.district,
          address: job.address,
          price: job.price,
          description: job.description,
          firstName: job.firstName,
          lastName: job.lastName,
          phoneNumber: job.phoneNumber,
          email: job.email,
        },
        userConfirmed,
        userAssigned,
        isJobConfirmed,
      });
    } catch (error) {
      console.error("Error unregistering from the job:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  //worker prihlasene prace
  router.get("/signedup", authMiddleware, async (req, res) => {
    try {
      const { page = 1, limit = 12 } = req.query; // Default to page 1 and limit 12
      const skip = (page - 1) * limit;

      const jobsPromise = Job.find({ assignedUsers: req.user._id })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec();

      const totalJobsPromise = Job.countDocuments({
        assignedUsers: req.user._id,
      }).exec();

      const [jobs, totalJobs] = await Promise.all([
        jobsPromise,
        totalJobsPromise,
      ]);

      const jobsWithStatus = await Promise.all(
        jobs.map(async (job) => {
          const userConfirmed = job.confirmedUsers.includes(req.user._id);
          const isJobConfirmed = job.confirmedUsers.length > 0;
          console.log("JOB toObject:", job.toObject());
          let status;
          if (job.dispute) {
            status = "dispute";
          } else if (job.canceled) {
            status = "unsuccessful";
          } else if (job.completed) {
            status =
              job.creatorConfirmed.success && job.workerConfirmed.success
                ? "successful"
                : "unsuccessful";
          } else {
            status = userConfirmed ? "signed_up" : "available";
          }
          
          return {
            ...job.toObject(),
            userConfirmed,
            isJobConfirmed,
            status,
            
          };
        })
        
      );

      return res.json({
        jobs: jobsWithStatus,
        userId: req.user._id,
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching signed up jobs",
        error: error.message,
      });
    }
  });
  //zistenie zapisaneho usera
  router.get("/:id/assigned-users", authMiddleware, async (req, res) => {
    try {
      const job = await Job.findById(req.params.id).populate("assignedUsers");
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.json(job.assignedUsers);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching assigned users",
        error: error.message,
      });
    }
  });
  //potvrdit usera pre job
  // potvrdit usera pre job
router.post(
  "/:jobId/confirm-user/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const { jobId, userId } = req.params;

      // Validácia jobId a userId
      if (
        !mongoose.Types.ObjectId.isValid(jobId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      ) {
        return res.status(400).json({ message: "Invalid jobId or userId" });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Skontrolujte, či používateľ je v assignedUsers
      const userIndex = job.assignedUsers.findIndex((user) =>
        user.equals(userId)
      );
      if (userIndex === -1) {
        return res
          .status(400)
          .json({ message: "User not assigned to this job" });
      }

      // Skontrolujte, či je používateľ už potvrdený
      const alreadyConfirmed = job.confirmedUsers.some(
        (confirmed) => confirmed.user.toString() === userId
      );

      if (alreadyConfirmed) {
        return res
          .status(400)
          .json({ message: "User already confirmed for this job" });
      }

      // Nastavíme príznak novej aktivity
      job.hasNewActivity = true;

      // Pridajte používateľa do confirmedUsers s aktuálnym časom
      job.confirmedUsers.push(userId);
      job.confirmationTimes.set(userId.toString(), new Date());
      job.assigned = true;
      await job.save();

      // Získajte detaily pracovníka
      const worker = await User.findById(userId);
      if (!worker) {
        return res.status(404).json({ message: "Worker not found" });
      }

      const workerDetails = {
        email: worker.email,
        firstName: worker.firstName,
        lastName: worker.lastName,
      };

      const jobDetails = {
        title: job.title,
        category: job.category,
        estimatedTime: job.estimatedTime,
        district: job.district,
        city: job.city,
        address: job.address,
        price: job.price,
        jobNumber: job.jobNumber,
        description: job.description,
        creatorFirstName: job.firstName,
        creatorLastName: job.lastName,
        creatorPhoneNumber: job.phoneNumber,
        creatorEmail: job.email,
      };

      // Získajte detaily Payment Intent
      const paymentIntent = await stripe.paymentIntents.retrieve(
        job.paymentIntentId
      );

      try {
        // Odoslanie potvrdenia emailu pracovníkovi
        await sendWorkerConfirmationEmail(workerDetails, jobDetails);
        // Odoslanie potvrdenia emailu vytvárajúcemu s detaily Payment Intent
        await sendWorkerConfirmedAndPaymentIntentEmail(
          {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          },
          workerDetails,
          jobDetails,
          paymentIntent
        );
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        return res.status(500).json({
          message: "Error sending email",
          error: emailError.message,
        });
      }

      return res.json({ message: "User confirmed for the job" });
    } catch (error) {
      return res.status(500).json({
        message: "Error confirming user for the job",
        error: error.message,
      });
    }
  }
);

  // ZRUSENIE POTVRDENIA
router.post("/:jobId/unconfirm-user/:userId", authMiddleware, async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    // Validácia jobId a userId
    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid jobId or userId" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 1) Overte, či je userId naozaj v confirmedUsers (pole ObjectId).
    const isUserConfirmed = job.confirmedUsers.some(
      (uid) => uid.toString() === userId
    );
    if (!isUserConfirmed) {
      return res
        .status(400)
        .json({ message: "User not confirmed for this job" });
    }

    // 2) Získajte čas potvrdenia z confirmationTimes (mapa userId -> Date).
    const confirmedAt = job.confirmationTimes.get(userId.toString());
    if (!confirmedAt) {
      return res
        .status(400)
        .json({ message: "User not confirmed for this job" });
    }

    // 3) Skontrolujte, či od potvrdenia neuplynulo viac ako 24 hodín.
    const currentTime = new Date();
    const timeDifferenceInHours =
      (currentTime - confirmedAt) / (1000 * 60 * 60);

    if (timeDifferenceInHours > 24) {
      return res.status(403).json({
        message:
          "Unconfirmation period has expired. You can only unconfirm a user within 24 hours of confirmation.",
      });
    }

    // 4) Odstráňte používateľa z confirmedUsers aj z confirmationTimes.
    job.confirmedUsers = job.confirmedUsers.filter(
      (uid) => uid.toString() !== userId
    );
    job.confirmationTimes.delete(userId.toString());

    // Nastavíme assigned na false (ak napr. ide len o jedného potvrdeného).
    job.assigned = false;

    // 5) Uložte zmeny v databáze
    await job.save();

    // 6) Zrušte Payment Intent (ak je potrebné).
    try {
      await stripe.paymentIntents.cancel(job.paymentIntentId);
      console.log("Payment intent canceled successfully");
    } catch (cancelError) {
      console.error("Error canceling payment intent:", cancelError);
      return res.status(500).json({
        message: "Error canceling payment intent",
        error: cancelError.message,
      });
    }

    return res.json({ message: "User unconfirmed successfully" });
  } catch (error) {
    console.error("Error unconfirming user for job:", error);
    return res.status(500).json({
      message: "Error unconfirming user for job",
      error: error.message,
    });
  }
});
  //zistenie ci je potvrdeny
  
router.get("/:jobId/user-status/:userId", authMiddleware, async (req, res) => {
  const { jobId, userId } = req.params;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 1. Skontrolujte, či je používateľ v confirmedUsers poli
    const isUserConfirmed = job.confirmedUsers.some(
      (uid) => uid.toString() === userId
    );

    // 2. Získajte čas potvrdenia z mapy confirmationTimes (ak je používateľ potvrdený)
    let confirmedAt = null;
    if (isUserConfirmed) {
      confirmedAt = job.confirmationTimes.get(userId.toString()) || null;
    }

    // 3. Vráťte JSON
    return res.json({
      userConfirmed: isUserConfirmed,
      isJobConfirmed: job.assigned,
      confirmedAt,
    });
  } catch (error) {
    console.error("Error fetching user status for job:", error);
    res.status(500).json({ message: "Server error" });
  }
});

  //vsetky prace s filtrami, pagination tiez
  router.get("/incomplete", async (req, res) => {
    const {
      category,
      priceRange,
      estimatedTime,
      city,
      district,
      page = 1,
      limit = 11,
    } = req.query;

    let filter = { completed: false };

    if (category) filter.category = category;

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (estimatedTime) {
      const [minTime, maxTime] = estimatedTime.split("-").map(Number);
      filter.estimatedTime = { $gte: minTime, $lte: maxTime };
    }

    if (city) filter.city = city;

    if (district) filter.district = district;

    console.log("Applied filter:", filter);

    let sort = { createdAt: -1 }; // Default to newest first

    try {
      const jobs = await Job.find(filter).sort(sort);

      const jobsWithStatus = await Promise.all(
        jobs.map(async (job) => {
          let userConfirmed = false;
          let isJobConfirmed = job.confirmedUsers.length > 0;

          if (req.user) {
            userConfirmed = job.confirmedUsers.includes(req.user._id);
          }

          return {
            ...job.toObject(),
            userConfirmed,
            isJobConfirmed,
            status: userConfirmed
              ? "Moja Práca"
              : isJobConfirmed
              ? "Nedostupná"
              : "Dostupná",
          };
        })
      );

      const availableJobs = jobsWithStatus.filter(
        (job) => job.status === "Dostupná"
      );
      const unavailableJobs = jobsWithStatus.filter(
        (job) => job.status === "Nedostupná"
      );
      const allJobs = [...availableJobs, ...unavailableJobs];

      const totalJobs = allJobs.length;
      const paginatedJobs = allJobs.slice((page - 1) * limit, page * limit);

      return res.json({
        status: true,
        jobs: paginatedJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.error("Error fetching incomplete jobs:", error);
      return res.status(500).json({
        message: "Error fetching incomplete jobs",
        error: error.message,
      });
    }
  });

  // Get a job by ID
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const job = await Job.findById(id)
        .populate("confirmedUsers")
        .populate("assignedUsers");
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      let userConfirmed = false;
      let userAssigned = false;

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.KEY);
        const userId = decoded.id;

        userConfirmed = job.confirmedUsers.some((user) =>
          user._id.equals(userId)
        );
        userAssigned = job.assignedUsers.some((user) =>
          user._id.equals(userId)
        );
      }

      res.json({
        status: true,
        job: {
          id: job._id,
          title: job.title,
          category: job.category,
          estimatedTime: job.estimatedTime,
          city: job.city,
          district: job.district,
          address: job.address,
          price: job.price,
          description: job.description,
          firstName: job.firstName,
          lastName: job.lastName,
          phoneNumber: job.phoneNumber,
          email: job.email,
          creatorConfirmed: job.creatorConfirmed,
          workerConfirmed: job.workerConfirmed,
          proposedTime: job.proposedTime,
          proposedDate: job.proposedDate,
          dispute: job.dispute, // Include the dispute field in the response
          photos: job.photos || [],
        },
        userConfirmed,
        userAssigned,
        
      });
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Error fetching job", error });
    }
  });

  // Označenie jobu ako „videný“ – zruši 'hasNewActivity'
router.patch("/:jobId/seen", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Nájdeme job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Nastavíme hasNewActivity na false
    job.hasNewActivity = false;
    await job.save();

    return res.json({
      message: "Job marked as seen",
      job
    });
  } catch (error) {
    console.error("Error marking job as seen:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});



router.put("/:jobId/update-proposed-time", authMiddleware, async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;
  // Očakávame, že request body obsahuje newProposedDate a newProposedTime
  const { newProposedDate, newProposedTime } = req.body;

  if (!newProposedDate || !newProposedTime) {
    return res.status(400).json({
      message: "Nový dátum a čas musia byť zadané (newProposedDate a newProposedTime).",
    });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Práca nebola nájdená" });
    }

    // Vytvoríme nový Date objekt pomocou lokálnych častí.
    // newProposedDate je vo formáte "YYYY-MM-DD" a newProposedTime vo formáte "HH:mm"
    const [year, month, day] = newProposedDate.split("-");
    const [hours, minutes] = newProposedTime.split(":");
    const updatedDate = new Date(year, month - 1, day, hours, minutes, 0);

    // Aktualizujeme navrhnutý dátum a čas v dokumente práce.
    job.proposedDate = updatedDate;      // Uloží ako Date objekt (lokálny čas)
    job.proposedTime = newProposedTime;    // Uloží ako reťazec, napr. "18:00"

    // Odstránime používateľa (worker) z poľa assignedUsers, ak je tam prítomný.
    job.assignedUsers.pull(new mongoose.Types.ObjectId(userId));

    await job.save();
    console.log(process.env.FRONTEND_URL);
    sendWorkerTimeUpdateEmail({
      to:req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      jobTitle: job.title,
      newProposedDate,
      newProposedTime,
      creatorFirstName: job.firstName,       // Meno tvorcu, uložené v dokumente práce
      creatorLastName: job.lastName,         // Priezvisko tvorcu
      creatorPhoneNumber: job.phoneNumber,
      jobUrl: `${process.env.FRONTEND_URL}/job/${job._id}`
    }).catch((mailError) => {
      console.error("Error sending email:", mailError.message);
    });

    return res.json({
      message:
        "Váš nový navrhnutý termín bol odoslaný a používateľ bol odstránený z prihlásených.",
      job,
    });
  } catch (error) {
    console.error("Error updating proposed time:", error);
    return res
      .status(500)
      .json({ message: "Chyba servera", error: error.message });
  }
});






  return router;
};
export { jobRouter };
