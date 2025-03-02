const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const adminRoutes = require("./routes/adminRoutes");
const connectDatabase = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config/config.env") });

connectDatabase();

const app = require("./app");
// CORS Configuration
app.use(
  cors({
    origin: [
      "https://chronocrafts.xyz",
      "https://www.chronocrafts.xyz",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://chronocrafts.xyz",
      "https://api.chronocrafts.xyz",
      "https://chrono-craft-mern-frontend-production.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const products = require("./routes/productRoutes");
const orders = require("./routes/orderRoutes");
const address = require("./routes/addressRoutes");
const cart = require("./routes/cartRoutes");
const payment = require("./routes/paymentRoutes");
const paypal = require("./routes/paypalRoutes");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/admin-login", adminRoutes); // Mount the admin routes
app.use("/api/v1", authRoutes); // Mount the admin routes
app.use("/api/v1", products);
app.use("/api/v1", orders);
app.use("/api/v1", address);
app.use("/api/v1", cart);
app.use("/api/v1", payment);
app.use("/paypal", paypal);

const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);
// Start the server
const PORT = process.env.PORT || 8000;
const Server = app.listen(PORT, () => {
  console.log(
    `Server started running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    }`
  );
});

// const _dirname = __dirname;
// const buildpath = path.join(_dirname, "../frontend-common/build");
// app.use(express.static(buildpath));
// app.use(
//   cors({
//     origin: "*",
//   })
// );

if (process.env.NODE_ENV.trim() === "production") {
  console.log("Confirmed");
  app.use(express.static(path.join(__dirname, "../frontend-common/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend-common/build/index.html")
    );
  });
}

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to unhandled rejection`);
  Server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to uncaught Errors`);
  Server.close(() => {
    process.exit(1);
  });
});
