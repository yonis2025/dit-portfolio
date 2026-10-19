
import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Require JWT authentication for all project routes
router.use(protect);

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve projects"
    });
  }
});

// GET PROJECT BY ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve project"
    });
  }
});

// CREATE PROJECT
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
        message: "All project fields are required"
      });
    }

    const project = await Project.create({
      title,
      firstname,
      lastname,
      email,
      completion,
      description
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create project"
    });
  }
});

// UPDATE PROJECT
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
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

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update project"
    });
  }
});

// DELETE PROJECT BY ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project ID"
      });
    }

    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project"
    });
  }
});

// DELETE ALL PROJECTS
router.delete("/", async (req, res) => {
  try {
    const result = await Project.deleteMany({});

    res.status(200).json({
      message: "All projects deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete projects"
    });
  }
});

export default router;
