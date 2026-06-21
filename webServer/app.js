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
import imageRoutes from './routes/imageRoutes.js';
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: './configLocal/.env' });

//====================================================================================================

// Create an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to allow connection to another server, in this case React.
app.use(cors());

// Define the server port
// for safety reasons the env files are in .gitignore so hardcoded 5000 is a fallback
const PORT = process.env.PORT || 5000

// Register all routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tokens", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/images', imageRoutes);
//return json when html is not found.
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`backend is running on http://localhost:${PORT}`);
});
