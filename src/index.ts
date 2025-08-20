import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/connect";
import authRoutes from "./routes/authRoutes";
import superadminRoutes from "./routes/superadmin.routes";
import employerRoutes from "./routes/employer.routes";
import employeeRoutes from "./routes/employee.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superadminRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/tasks", taskRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Start the server
const startServer = async () => {
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined.");
    process.exit(1);
  }

  await connectDB(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
