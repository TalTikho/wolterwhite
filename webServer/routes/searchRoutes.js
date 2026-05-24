import {Router} from "express";
import { search} from "../controllers/searchController.js";

const router = Router();

// GET /api/search/:query
router.get('/query', search);

export default router;