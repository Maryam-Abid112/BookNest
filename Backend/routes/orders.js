import express from "express";
import {
  cancelStripeCheckout,
  confirmStripePayment,
  createStripeCheckoutSession,
  placeOrder,
} from "../controllers/orders.js";
import { protect } from "../middleware/middle.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/stripe/checkout-session", protect, createStripeCheckoutSession);
router.post("/stripe/confirm-payment", protect, confirmStripePayment);
router.post("/stripe/cancel-checkout", protect, cancelStripeCheckout);

export default router;
