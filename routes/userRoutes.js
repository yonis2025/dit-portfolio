
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const createToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h", algorithm: "HS256" }
  );
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password
    });

    res.status(201).json({
      message: "User registered successfully",
      user: publicUser(user),
      token: createToken(user)
    });
  } catch (error) {
    res.status(400).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user: publicUser(user),
      token: createToken(user)
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed"
    });
  }
});

// LOGOUT
// JWT logout requires the client to discard its token.
// The token remains valid until expiration unless revoked.
router.post("/logout", protect, (req, res) => {
  res.json({
    message: "Logout successful. Remove the token from your client."
  });
});

// GET ALL USERS
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve users"
    });
  }
});

// GET ONE USER
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve user"
    });
  }
});

// CREATE USER
router.post("/", protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Valid name, email, and password are required"
      });
    }

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password
    });

    res.status(201).json(publicUser(user));
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user"
    });
  }
});

// UPDATE USER
router.put("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const { name, email, password } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.trim().toLowerCase();

    if (password !== undefined) {
      if (typeof password !== "string" || password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters"
        });
      }

      user.password = password;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: publicUser(user)
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update user"
    });
  }
});

// DELETE ONE USER
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user"
    });
  }
});

// DELETE ALL USERS
// Disabled to prevent one user from deleting every account.
router.delete("/", protect, (req, res) => {
  res.status(403).json({
    message: "Deleting all users requires administrator authorization"
  });
});

export default router;
