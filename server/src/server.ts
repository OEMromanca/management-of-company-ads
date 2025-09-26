import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import companyRouter from "./routes/companyModelRoutes";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB pripojená"))
  .catch((err) => console.error("❌ Chyba pripojenia:", err));

app.use("/api/companies", companyRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server beží na porte ${PORT}`);
});
