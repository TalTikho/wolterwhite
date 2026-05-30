//====================================================================================================
// Imports
//====================================================================================================
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import searchRoutes from './routes/searchRoutes.js';

//====================================================================================================

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the server port
const PORT = 3000;

// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/tokens", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use('/api/search', searchRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
