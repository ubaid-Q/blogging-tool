import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { body, validationResult } from "express-validator";

const router = express.Router();
const db = new sqlite3.Database("./db/blogging_tool.db");

// Login route
router.post(
  "/login",
  [body("email").isEmail().withMessage("Please enter a valid email address"), body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("auth/login", {
        message: errors
          .array()
          .map((err) => err.msg)
          .join(", "),
      });
    }

    const { email, password } = req.body;

    try {
      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(401).render("auth/login", {
          message: "Invalid email or password",
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).render("auth/login", {
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expiry time
      });

      // Set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 3600000, // Cookie expiry in milliseconds (default: 1 hour)
      });

      // Redirect to home page
      res.redirect("/authors/");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).render("auth/login", {
        message: "Internal Server Error",
      });
    }
  }
);

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

// Route to render the login form
router.get("/login", (req, res) => {
  res.render("auth/login", { message: req.flash("error")[0] }); // Pass flash messages if any
});

async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM authors WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export default router;
