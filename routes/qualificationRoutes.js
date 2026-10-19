
import express from "express";
import mongoose from "mongoose";
import Qualification from "../models/Qualification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require JWT authentication for all qualification routes
router.use(protect);

// GET ALL QUALIFICATIONS
router.get("/", async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    res.status(200).json(qualifications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve qualifications"
    });
  }
});

// GET QUALIFICATION BY ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid qualification ID"
      });
    }

    const qualification = await Qualification.findById(req.params.id);

    if (!qualification) {
      return res.status(404).json({
        message: "Qualification not found"
      });
    }

    res.status(200).json(qualification);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve qualification"
    });
  }
});

// CREATE QUALIFICATION
router.post("/", async (req, res) => {
  try {
    const {
      title,
      firstname,
      lastname,
      email,
      completion,
      description
    } = req.body;

    if (
      !title ||
      !firstname ||
      !lastname ||
      !email ||
      !completion ||
      !description
    ) {
      return res.status(400).json({
        message: "All qualification fields are required"
      });
    }

    const qualification = await Qualification.create({
      title,
      firstname,
      lastname,
      email,
      completion,
      description
    });

    res.status(201).json(qualification);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create qualification"
    });
  }
});

// UPDATE QUALIFICATION
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid qualification ID"
      });
    }

    const allowedFields = [
      "title",
      "firstname",
      "lastname",
      "email",
      "completion",
      "description"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const qualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!qualification) {
      return res.status(404).json({
        message: "Qualification not found"
      });
    }

    res.status(200).json(qualification);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update qualification"
    });
  }
});

// DELETE QUALIFICATION BY ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid qualification ID"
      });
    }

    const qualification = await Qualification.findByIdAndDelete(
      req.params.id
    );

    if (!qualification) {
      return res.status(404).json({
        message: "Qualification not found"
      });
    }

    res.status(200).json({
      message: "Qualification deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete qualification"
    });
  }
});

// DELETE ALL QUALIFICATIONS
router.delete("/", async (req, res) => {
  try {
    const result = await Qualification.deleteMany({});

    res.status(200).json({
      message: "All qualifications deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete qualifications"
    });
  }
});

export default router;
