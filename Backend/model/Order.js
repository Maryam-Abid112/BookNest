import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must contain at least one item",
      },
    },
    shippingAddress: {
      fullName: { type: String, required: true, trim: true, maxlength: 100 },
      phone: { type: String, required: true, trim: true, maxlength: 30 },
      address: { type: String, required: true, trim: true, maxlength: 250 },
      city: { type: String, required: true, trim: true, maxlength: 100 },
      region: { type: String, required: true, trim: true, maxlength: 100 },
      postalCode: { type: String, required: true, trim: true, maxlength: 20 },
      country: { type: String, required: true, trim: true, maxlength: 100 },
    },
    paymentMethod: {
      type: String,
      enum: ["cash-on-delivery", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    deliveryMethod: {
      type: String,
      enum: ["standard", "fast"],
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    orderNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["placed", "awaiting-payment", "processing", "shipped", "delivered", "cancelled"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
