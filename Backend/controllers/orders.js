import mongoose from "mongoose";
import Book from "../model/Book.js";
import Cart from "../model/Cart.js";
import Order from "../model/Order.js";

const deliveryCharges = {
  standard: 200,
  fast: 270,
};

const requiredText = (value, maxLength) =>
  typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;

const placeOrder = async (req, res) => {
  const {
    fullName,
    phone,
    address,
    city,
    region,
    postalCode,
    country,
    paymentMethod,
    deliveryMethod,
    orderNote = "",
  } = req.body;

  if (
    !requiredText(fullName, 100) ||
    !requiredText(phone, 30) ||
    !requiredText(address, 250) ||
    !requiredText(city, 100) ||
    !requiredText(region, 100) ||
    !requiredText(postalCode, 20) ||
    !requiredText(country, 100) ||
    !["cash-on-delivery", "online"].includes(paymentMethod) ||
    !Object.hasOwn(deliveryCharges, deliveryMethod) ||
    typeof orderNote !== "string" ||
    orderNote.length > 500
  ) {
    return res.status(400).json({ message: "Please provide valid checkout details" });
  }

  const session = await mongoose.startSession();
  let createdOrderId;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.find({ user: req.user.id })
        .populate("book")
        .session(session);

      if (cart.length === 0) {
        const error = new Error("Your cart is empty");
        error.statusCode = 400;
        throw error;
      }

      let subtotal = 0;
      const items = cart.map((cartItem) => {
        const book = cartItem.book;
        if (!book) {
          const error = new Error("A book in your cart is no longer available");
          error.statusCode = 409;
          throw error;
        }
        if (!Number.isFinite(book.price) || book.price < 0) {
          const error = new Error(`${book.title} does not have a valid price`);
          error.statusCode = 409;
          throw error;
        }
        if (!Number.isSafeInteger(cartItem.quantity) || cartItem.quantity < 1) {
          const error = new Error(`Invalid cart quantity for ${book.title}`);
          error.statusCode = 409;
          throw error;
        }

        const lineTotal = book.price * cartItem.quantity;
        subtotal += lineTotal;
        return {
          book: book._id,
          title: book.title,
          unitPrice: book.price,
          quantity: cartItem.quantity,
          lineTotal,
        };
      });

      for (const item of items) {
        const stockUpdate = await Book.updateOne(
          { _id: item.book, quantity: { $gte: item.quantity } },
          { $inc: { quantity: -item.quantity } },
          { session }
        );
        if (stockUpdate.modifiedCount !== 1) {
          const error = new Error(`Not enough stock for ${item.title}. Please update your cart.`);
          error.statusCode = 409;
          throw error;
        }
      }

      const deliveryCharge = deliveryCharges[deliveryMethod];
      const [order] = await Order.create(
        [
          {
            user: req.user.id,
            items,
            shippingAddress: {
              fullName: fullName.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              region: region.trim(),
              postalCode: postalCode.trim(),
              country: country.trim(),
            },
            paymentMethod,
            paymentStatus: "pending",
            deliveryMethod,
            deliveryCharge,
            subtotal,
            total: subtotal + deliveryCharge,
            orderNote: orderNote.trim(),
            status: paymentMethod === "online" ? "awaiting-payment" : "placed",
          },
        ],
        { session }
      );

      await Cart.deleteMany({ user: req.user.id }, { session });
      createdOrderId = order._id;
    });

    const order = await Order.findById(createdOrderId);
    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("Unable to place order", error);
    if (
      error.code === 20 ||
      error.message?.includes("Transaction numbers are only allowed")
    ) {
      return res.status(503).json({
        message: "Order placement requires MongoDB transactions. Use MongoDB Atlas or a replica-set deployment.",
      });
    }

    return res.status(500).json({
      message: "Unable to place order. Please try again.",
    });
  } finally {
    await session.endSession();
  }
};

export { placeOrder };
