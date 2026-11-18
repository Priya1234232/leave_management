require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", leaveRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Leave Management API is running."
  });
});

const PORT = process.env.PORT || 5050;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server could not start because database connection failed.");
    process.exit(1);
  });
