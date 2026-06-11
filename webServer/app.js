//====================================================================================================
// Imports
//====================================================================================================
import express from "express";
import cors from "cors";
import expressCors from "express-cors";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import searchRoutes from './routes/searchRoutes.js';
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

//====================================================================================================

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to allow connection to another server, in this case React.
app.use(cors());

// Define the server port
const PORT = process.env.PORT

// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tokens", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use('/api/search', searchRoutes);

// Start the backend server
app.listen(PORT, () => {
    console.log(`backend is running on http://localhost:${PORT}`);
});
