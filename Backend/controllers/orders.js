import mongoose from "mongoose";
import Stripe from "stripe";
import Book from "../model/Book.js";
import Cart from "../model/Cart.js";
import Order from "../model/Order.js";

const deliveryCharges = {
  standard: 200,
  fast: 270,
};

const requiredText = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  value.trim().length <= maxLength;

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const parsedUrl = new URL(frontendUrl);
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("FRONTEND_URL must use HTTP or HTTPS");
  }
  return parsedUrl.origin;
};

const validateCheckoutDetails = (details) => {
  const {
    fullName,
    phone,
    address,
    city,
    region,
    postalCode,
    country,
    deliveryMethod,
    orderNote = "",
  } = details;

  return (
    requiredText(fullName, 100) &&
    requiredText(phone, 30) &&
    requiredText(address, 250) &&
    requiredText(city, 100) &&
    requiredText(region, 100) &&
    requiredText(postalCode, 20) &&
    requiredText(country, 100) &&
    Object.hasOwn(deliveryCharges, deliveryMethod) &&
    typeof orderNote === "string" &&
    orderNote.length <= 500
  );
};

const buildOrderData = (userId, details, cart, paymentMethod) => {
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

  const deliveryCharge = deliveryCharges[details.deliveryMethod];
  return {
    user: userId,
    items,
    cartItemIds: cart.map((cartItem) => cartItem._id),
    shippingAddress: {
      fullName: details.fullName.trim(),
      phone: details.phone.trim(),
      address: details.address.trim(),
      city: details.city.trim(),
      region: details.region.trim(),
      postalCode: details.postalCode.trim(),
      country: details.country.trim(),
    },
    paymentMethod,
    paymentStatus: "pending",
    deliveryMethod: details.deliveryMethod,
    deliveryCharge,
    subtotal,
    total: subtotal + deliveryCharge,
    orderNote: details.orderNote.trim(),
  };
};

const reserveOrderAndStock = async (userId, details, paymentMethod) => {
  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.find({ user: userId })
        .populate("book")
        .session(session);
      const orderData = buildOrderData(userId, details, cart, paymentMethod);

      for (const item of orderData.items) {
        const stockUpdate = await Book.updateOne(
          { _id: item.book, quantity: { $gte: item.quantity } },
          { $inc: { quantity: -item.quantity } },
          { session }
        );
        if (stockUpdate.modifiedCount !== 1) {
          const error = new Error(
            `Not enough stock for ${item.title}. Please update your cart.`
          );
          error.statusCode = 409;
          throw error;
        }
      }

      const [order] = await Order.create(
        [
          {
            ...orderData,
            status: paymentMethod === "online" ? "awaiting-payment" : "placed",
          },
        ],
        { session }
      );

      await Cart.deleteMany({ user: userId }, { session });
      createdOrder = order.toObject();
    });
    return createdOrder;
  } finally {
    await session.endSession();
  }
};

const releasePendingOrder = async (orderId, stripeSessionId) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: orderId,
        status: "awaiting-payment",
        paymentStatus: "pending",
        ...(stripeSessionId
          ? {
              $or: [
                { stripeCheckoutSessionId: stripeSessionId },
                { stripeCheckoutSessionId: { $exists: false } },
                { stripeCheckoutSessionId: null },
              ],
            }
          : {}),
      }).session(session);

      if (!order) {
        return;
      }

      for (const item of order.items) {
        await Book.updateOne(
          { _id: item.book },
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }

      order.status = "cancelled";
      order.paymentStatus = "failed";
      await order.save({ session });
      for (const item of order.items) {
        await Cart.findOneAndUpdate(
          { user: order.user, book: item.book },
          {
            $inc: { quantity: item.quantity },
            $setOnInsert: { user: order.user, book: item.book },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true, session }
        );
      }
    });
  } finally {
    await session.endSession();
  }
};

const finalizePaidOrder = async (stripeSession) => {
  const orderId = stripeSession.metadata?.orderId;
  if (!mongoose.isValidObjectId(orderId)) {
    throw new Error("Stripe session is missing a valid order reference");
  }

  const session = await mongoose.startSession();
  let finalizedOrder;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        throw new Error("Order associated with Stripe session was not found");
      }
      if (order.user.toString() !== stripeSession.metadata?.userId) {
        throw new Error("Stripe session user does not match the order");
      }
      if (
        order.stripeCheckoutSessionId &&
        order.stripeCheckoutSessionId !== stripeSession.id
      ) {
        throw new Error("Stripe session does not match the order");
      }
      if (order.paymentStatus === "paid") {
        finalizedOrder = order;
        return;
      }
      if (order.status !== "awaiting-payment" || order.paymentStatus !== "pending") {
        throw new Error("This order is no longer awaiting payment");
      }

      order.stripeCheckoutSessionId = stripeSession.id;
      order.stripePaymentIntentId =
        typeof stripeSession.payment_intent === "string"
          ? stripeSession.payment_intent
          : stripeSession.payment_intent?.id;
      order.paymentStatus = "paid";
      order.status = "processing";
      await order.save({ session });
      await Cart.deleteMany(
        { user: order.user, _id: { $in: order.cartItemIds } },
        { session }
      );
      finalizedOrder = order;
    });
    return finalizedOrder;
  } finally {
    await session.endSession();
  }
};

const respondWithOrderError = (res, error, operation) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(operation, error);
  if (
    error.code === 20 ||
    error.message?.includes("Transaction numbers are only allowed")
  ) {
    return res.status(503).json({
      message:
        "Order placement requires MongoDB transactions. Use MongoDB Atlas or a replica-set deployment.",
    });
  }

  if (error.type?.startsWith("Stripe")) {
    return res.status(502).json({
      message: `Stripe checkout failed: ${error.message}`,
    });
  }

  return res.status(500).json({ message: "Unable to complete your order" });
};

const placeOrder = async (req, res) => {
  if (!validateCheckoutDetails(req.body) || req.body.paymentMethod !== "cash-on-delivery") {
    return res.status(400).json({ message: "Please provide valid cash-on-delivery checkout details" });
  }

  try {
    const order = await reserveOrderAndStock(
      req.user.id,
      req.body,
      "cash-on-delivery"
    );
    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    return respondWithOrderError(res, error, "Unable to place COD order");
  }
};

const createStripeCheckoutSession = async (req, res) => {
  if (!validateCheckoutDetails(req.body)) {
    return res.status(400).json({ message: "Please provide valid checkout details" });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({
      message:
        "Stripe webhooks are not configured. Set STRIPE_WEBHOOK_SECRET before accepting online payments.",
    });
  }

  let order;
  try {
    const stripe = getStripe();
    const currency = (process.env.STRIPE_CURRENCY || "pkr").toLowerCase();
    order = await reserveOrderAndStock(req.user.id, req.body, "online");

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.title },
        unit_amount: Math.round(item.unitPrice * 100),
      },
      quantity: item.quantity,
    }));
    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: `${order.deliveryMethod === "fast" ? "Fast" : "Standard"} delivery`,
        },
        unit_amount: Math.round(order.deliveryCharge * 100),
      },
      quantity: 1,
    });

    const frontendUrl = getFrontendUrl();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id.toString(),
      },
      success_url: `${frontendUrl}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout?payment=cancelled&order_id=${order._id}`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });

    order.stripeCheckoutSessionId = checkoutSession.id;
    const savedOrder = await Order.findByIdAndUpdate(
      order._id,
      { stripeCheckoutSessionId: checkoutSession.id },
      { new: true }
    );
    if (!savedOrder) {
      throw new Error("Unable to save Stripe Checkout session to order");
    }

    return res.status(201).json({ url: checkoutSession.url });
  } catch (error) {
    if (order && !order.stripeCheckoutSessionId) {
      try {
        await releasePendingOrder(order._id);
      } catch (releaseError) {
        console.error("Unable to release inventory after Stripe setup failed", releaseError);
      }
    }
    return respondWithOrderError(res, error, "Unable to start Stripe Checkout");
  }
};

const confirmStripePayment = async (req, res) => {
  const { sessionId } = req.body;
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return res.status(400).json({ message: "A valid Stripe Checkout session is required" });
  }

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (
      checkoutSession.metadata?.userId !== req.user.id.toString() ||
      checkoutSession.payment_status !== "paid"
    ) {
      return res.status(409).json({ message: "Payment has not been confirmed" });
    }

    const order = await finalizePaidOrder(checkoutSession);
    return res.status(200).json({ message: "Payment confirmed", order });
  } catch (error) {
    return respondWithOrderError(res, error, "Unable to confirm Stripe payment");
  }
};

const cancelStripeCheckout = async (req, res) => {
  const { orderId } = req.body;
  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ message: "A valid order is required" });
  }

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      paymentMethod: "online",
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        message: "Payment was already completed",
        order,
        paymentCompleted: true,
      });
    }
    if (order.status !== "awaiting-payment" || order.paymentStatus !== "pending") {
      return res.status(200).json({ message: "Checkout is already closed" });
    }

    if (order.stripeCheckoutSessionId) {
      const stripe = getStripe();
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        order.stripeCheckoutSessionId
      );
      if (checkoutSession.payment_status === "paid") {
        const paidOrder = await finalizePaidOrder(checkoutSession);
        return res.status(200).json({
          message: "Payment was already completed",
          order: paidOrder,
          paymentCompleted: true,
        });
      }
      if (checkoutSession.status === "open") {
        await stripe.checkout.sessions.expire(order.stripeCheckoutSessionId);
      }
    }

    await releasePendingOrder(order._id, order.stripeCheckoutSessionId);
    return res.status(200).json({ message: "Checkout cancelled" });
  } catch (error) {
    return respondWithOrderError(res, error, "Unable to cancel Stripe Checkout");
  }
};

const handleStripeWebhook = async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return res.status(500).send("Webhook is not configured");
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error.message);
    return res.status(400).send("Invalid webhook signature");
  }

  try {
    const checkoutSession = event.data.object;
    if (
      event.type === "checkout.session.completed" &&
      checkoutSession.payment_status === "paid"
    ) {
      await finalizePaidOrder(checkoutSession);
    } else if (
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await finalizePaidOrder(checkoutSession);
    } else if (
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_failed"
    ) {
      const orderId = checkoutSession.metadata?.orderId;
      if (mongoose.isValidObjectId(orderId)) {
        await releasePendingOrder(orderId, checkoutSession.id);
      }
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Unable to process Stripe webhook event", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};

export {
  placeOrder,
  createStripeCheckoutSession,
  confirmStripePayment,
  cancelStripeCheckout,
  handleStripeWebhook,
};
