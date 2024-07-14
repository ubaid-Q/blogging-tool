import express from "express";
import { dirname, join } from "path";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import { config } from "dotenv";
import authorRoutes from "./routes/authors.js";
import articleRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import Settings from "./models/settings.js";

config(); // Loading environment variables from .env file

const { SESSION_SECRET, PORT, HOST } = process.env; // Destructuring environment variables

const app = express(); // Initializing Express application
const __filename = fileURLToPath(import.meta.url); // Getting current filename
const __dirname = dirname(__filename); // Getting current directory name

// Middleware setup
app.disable("x-powered-by"); // Disabling X-Powered-By header
app.use(cookieParser()); // Using cookie parser middleware
app.set("view engine", "ejs"); // Setting EJS as view engine
app.set("views", join(__dirname, "views")); // Setting views directory
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded bodies
app.use(express.json()); // Parsing JSON bodies
app.use(methodOverride("_method")); // Using method override middleware
app.use(express.static(join(__dirname, "public"))); // Serving static files from 'public' directory
app.use(
  session({
    secret: SESSION_SECRET, // Secret used to sign session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { httpOnly: true, maxAge: 3600000 }, // Session cookie settings
  })
);
app.use(flash()); // Using flash messages middleware

// Using routes
app.use("/authors", authorRoutes); // Mounting author routes
app.use("/articles", articleRoutes); // Mounting article routes
app.use("/auth", authRoutes); // Mounting authentication routes

// Main home page route
app.get("/", async (req, res) => {
  const settings = await Settings.get(); // Fetching blog settings
  res.render("index", { settings }); // Rendering 'index' view with settings data
});

// Starting the server
app.listen(PORT, () => console.log(`Server running on http://${HOST}:${PORT}`));
