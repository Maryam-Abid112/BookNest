import mongoose from "mongoose";
import Book from "../model/Book.js";
import Cart from "../model/Cart.js";

const invalidQuantity = (quantity) =>
  !Number.isSafeInteger(quantity) || quantity < 1;

const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user.id }).populate("book");
    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Unable to get cart", error);
    return res.status(500).json({ message: "Unable to get cart" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { bookid, quantity } = req.body;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(bookid) || invalidQuantity(quantity)) {
      return res.status(400).json({
        message: "A valid book and positive whole-number quantity are required",
      });
    }

    const book = await Book.findById(bookid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!Number.isFinite(book.price) || book.price < 0) {
      return res.status(409).json({
        message: "This book needs a valid price before it can be added to the cart",
      });
    }

    const available = Number.isSafeInteger(book.quantity) ? book.quantity : 0;
    if (quantity > available) {
      return res.status(409).json({
        message: `Only ${available} ${available === 1 ? "copy is" : "copies are"} available`,
      });
    }

    const existing = await Cart.findOne({ user: userId, book: bookid });
    if (existing) {
      const updated = await Cart.findOneAndUpdate(
        {
          _id: existing._id,
          quantity: { $lte: available - quantity },
        },
        { $inc: { quantity } },
        { new: true }
      ).populate("book");

      if (!updated) {
        return res.status(409).json({
          message: `Your cart quantity would exceed the ${available} ${available === 1 ? "copy" : "copies"} available`,
        });
      }

      return res.status(200).json({ message: "Cart updated", item: updated });
    }

    try {
      const item = await Cart.create({
        user: userId,
        book: bookid,
        quantity,
      });
      await item.populate("book");
      return res.status(201).json({ message: "Added to cart", item });
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      const item = await Cart.findOneAndUpdate(
        {
          user: userId,
          book: bookid,
          quantity: { $lte: available - quantity },
        },
        { $inc: { quantity } },
        { new: true }
      ).populate("book");

      if (!item) {
        return res.status(409).json({
          message: `Your cart quantity would exceed the ${available} ${available === 1 ? "copy" : "copies"} available`,
        });
      }

      return res.status(200).json({ message: "Cart updated", item });
    }
  } catch (error) {
    console.error("Unable to add book to cart", error);
    return res.status(500).json({ message: "Unable to add book to cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!mongoose.isValidObjectId(id) || invalidQuantity(quantity)) {
      return res.status(400).json({
        message: "A valid cart item and positive whole-number quantity are required",
      });
    }

    const item = await Cart.findOne({ _id: id, user: req.user.id }).populate("book");
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const available = Number.isSafeInteger(item.book?.quantity)
      ? item.book.quantity
      : 0;
    if (quantity > available) {
      return res.status(409).json({
        message: `Only ${available} ${available === 1 ? "copy is" : "copies are"} available`,
      });
    }

    item.quantity = quantity;
    await item.save();
    await item.populate("book");
    return res.status(200).json({ message: "Cart updated", item });
  } catch (error) {
    console.error("Unable to update cart item", error);
    return res.status(500).json({ message: "Unable to update cart item" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "A valid cart item is required" });
    }

    const item = await Cart.findOneAndDelete({ _id: id, user: req.user.id });
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Removed from cart" });
  } catch (error) {
    console.error("Unable to remove cart item", error);
    return res.status(500).json({ message: "Unable to remove cart item" });
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart };
