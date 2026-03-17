const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./Database/connect");
const authRouter = require("./Routes/auth");
const utillsRouter = require("./Routes/Utils");
const morgan = require("morgan");
require("dotenv").config(); // load environment variables from .env file
const port = process.env.port || 5000; // fallback to 5000 if PORT not set in .env

// ─── Middleware ───────────────────────────────────────────────────────────────
const authenticateUser = require("./middleware/auth.js"); // JWT auth middleware (used inside route files)
app.use(cors()); // allow cross-origin requests from frontend
app.use(bodyParser.json()); // parse incoming JSON request bodies
app.use(express.json()); // same as above — one of these can be removed

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/V1/user", authRouter);   // handles: /login, /register
app.use("/api/V1/user", utillsRouter); // handles: /profile, /update, etc.

// log request method, URL, and status code in development (e.g. GET /api/V1/user 200)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// health check — confirms the server is running
app.get("/", (req, res) => {
  res.status(200).send("Hello from Backend");
});

// ─── Start Server ─────────────────────────────────────────────────────────────
// first connect to MongoDB, then start listening for requests
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // establish database connection
    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  } catch (error) {
    console.log("Error: ", error); // log and exit if DB connection fails
  }
};

start();
