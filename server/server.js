require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", // or 3000 if using CRA
  "https://argo-react-frontend.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
