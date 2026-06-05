const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "QTicket API is running" });
});

// auth routes
app.use("/api/auth", authRoutes);

// user routes
app.use("/api/users", userRoutes);

// ticket routes
app.use("/api/tickets", ticketRoutes);

// dashboard routes
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
