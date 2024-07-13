import express, { urlencoded } from "express";
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

config();
const { SESSION_SECRET, PORT, HOST } = process.env;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware setup
app.disable("x-powered-by");
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(join(__dirname, "public")));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 3600000 },
  })
);
app.use(flash());

// Use routes
app.use("/authors", authorRoutes);
app.use("/articles", articleRoutes);
app.use("/auth", authRoutes);

// Main home page
app.get("/", async (req, res) => {
  const settings = await Settings.get();
  res.render("index", { settings });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
