import express from "express";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the server port
const PORT = 3000;

// Register user routes
// All routes inside userRoutes will start with /api/users
app.use("/api/users", userRoutes);
app.use("/api/tokens", authRoutes);
// Register restaurant routes
// All routes inside restaurantRoutes will start with /api/restaurants
app.use("/api/restaurants", restaurantRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});