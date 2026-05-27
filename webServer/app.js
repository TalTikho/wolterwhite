import express from "express";
import restaurantRoutes from "./routes/restaurantRoutes.js";

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the server port
const PORT = 3000;

// Register restaurant routes
// All routes inside restaurantRoutes will start with /api/restaurants
app.use("/api/restaurants", restaurantRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});