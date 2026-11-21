
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// Check the database role rather than trusting a role supplied by the client.
export const adminOnly = async (req, res, next) => {
  try {
    const { default: User } = await import("../models/User.js");
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") return res.status(403).json({ message: "Administrator access required" });
    next();
  } catch { res.status(401).json({ message: "Authentication required" }); }
};
