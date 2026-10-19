
import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// JWT authentication required for every contact route
router.use(protect);

// GET ALL CONTACTS
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve contacts"
    });
  }
});

// GET CONTACT BY ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve contact"
    });
  }
});

// CREATE CONTACT
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    if (!firstname || !lastname || !email) {
      return res.status(400).json({
        message: "Firstname, lastname, and email are required"
      });
    }

    const contact = await Contact.create({
      firstname,
      lastname,
      email
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create contact"
    });
  }
});

// UPDATE CONTACT
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid contact ID"
      });
    }

    const { firstname, lastname, email } = req.body;

    const updates = {};

    if (firstname !== undefined) {
      updates.firstname = firstname;
    }

    if (lastname !== undefined) {
      updates.lastname = lastname;
    }

    if (email !== undefined) {
      updates.email = email;
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update contact"
    });
  }
});

// DELETE CONTACT BY ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid contact ID"
      });
    }

    const contact = await Contact.findByIdAndDelete(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json({
      message: "Contact deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact"
    });
  }
});

// DELETE ALL CONTACTS
router.delete("/", async (req, res) => {
  try {
    const result = await Contact.deleteMany({});

    res.status(200).json({
      message: "All contacts deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contacts"
    });
  }
});

export default router;
