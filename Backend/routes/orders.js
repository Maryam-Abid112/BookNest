import express from "express";
import { placeOrder } from "../controllers/orders.js";
import { protect } from "../middleware/middle.js";

const router = express.Router();

router.post("/", protect, placeOrder);

export default router;
