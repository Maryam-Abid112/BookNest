import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.js";
import { protect } from "../middleware/middle.js";

const router = express.Router();

router.get("/getcart", protect, getCart);
router.post("/addtocart", protect, addToCart);
router.post("/updatecart", protect, updateCartItem);
router.post("/removefromcart", protect, removeFromCart);

export default router;
