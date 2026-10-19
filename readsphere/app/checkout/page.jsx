"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart } from "../../lib/Cart";
import {
  cancelStripeCheckout,
  confirmStripePayment,
  createStripeCheckoutSession,
  placeOrder,
} from "../../lib/Orders";

const initialDetails = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
  paymentMethod: "cash-on-delivery",
  deliveryMethod: "standard",
};

const DELIVERY_CHARGES = {
  standard: 200,
  fast: 270,
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [details, setDetails] = useState(initialDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      if (!localStorage.getItem("token")) {
        router.replace("/Login?redirect=%2Fcheckout");
        return;
      }

      try {
        const query = new URLSearchParams(window.location.search);
        const paymentState = query.get("payment");

        if (paymentState === "success") {
          const sessionId = query.get("session_id");
          if (!sessionId) {
            throw new Error("Stripe did not return a checkout session reference");
          }
          const result = await confirmStripePayment(sessionId);
          if (active) {
            setPlacedOrder(result.order);
            setNotice("Your Stripe payment was successful and your order is confirmed.");
            localStorage.removeItem("booknest:order-note");
            router.replace("/checkout");
          }
          return;
        }

        if (paymentState === "cancelled") {
          const orderId = query.get("order_id");
          if (orderId) {
            const result = await cancelStripeCheckout(orderId);
            if (result.paymentCompleted && active) {
              setPlacedOrder(result.order);
              setNotice("Your Stripe payment was successful and your order is confirmed.");
              localStorage.removeItem("booknest:order-note");
              router.replace("/checkout");
              return;
            }
          }
          if (active) {
            setNotice("Payment was cancelled. Your cart has been restored.");
            router.replace("/checkout");
          }
        }

        const data = await getCart();
        if (active) {
          setCart(data.cart);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [router]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      (Number.isFinite(item.book?.price)
        ? item.book.price * item.quantity
        : 0),
    0
  );
  const deliveryCharge = DELIVERY_CHARGES[details.deliveryMethod];
  const total = subtotal + deliveryCharge;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((current) => ({ ...current, [name]: value }));
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setNotice("");

    try {
      const checkoutDetails = {
        ...details,
        orderNote: localStorage.getItem("booknest:order-note") || "",
      };

      if (details.paymentMethod === "online") {
        const result = await createStripeCheckoutSession(checkoutDetails);
        if (
          typeof result.url !== "string" ||
          new URL(result.url).hostname !== "checkout.stripe.com"
        ) {
          throw new Error("Stripe did not return a valid checkout link");
        }
        window.location.assign(result.url);
        return;
      }

      const result = await placeOrder(checkoutDetails);
      setPlacedOrder(result.order);
      setCart([]);
      localStorage.removeItem("booknest:order-note");
      localStorage.removeItem("booknest:guest-cart");
      setNotice(
        "Your order has been saved. Payment is due on delivery."
      );
    } catch (requestError) {
      setSubmitError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container py-5">
        <p className="text-muted">Loading checkout...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger" role="alert">{error}</div>
        <Link href="/cart" className="btn btn-outline-dark">Back to cart</Link>
      </main>
    );
  }

  if (placedOrder) {
    return (
      <main className="container py-5">
        <div className="mx-auto text-center" style={{ maxWidth: "640px" }}>
          <div className="alert alert-success" role="status">
            <h1 className="h3">Order placed</h1>
            <p className="mb-0">{notice}</p>
          </div>
          <p>
            Order reference: <strong>{placedOrder._id}</strong>
          </p>
          <p>
            Total: <strong>Rs. {placedOrder.total.toFixed(2)}</strong>
          </p>
          <Link href="/book" className="btn btn-dark">Continue browsing</Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3 mb-3">Your cart is empty</h1>
        <Link href="/book" className="btn btn-dark">Browse books</Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="fw-bold mb-4">Checkout</h1>
      {notice && <div className="alert alert-info" role="status">{notice}</div>}
      {submitError && <div className="alert alert-danger" role="alert">{submitError}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit}>
            <section className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Delivery details</h2>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    autoComplete="name"
                    value={details.fullName}
                    onChange={handleChange}
                    required
                    maxLength={100}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={handleChange}
                    required
                    maxLength={30}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="address">Street address</label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-control"
                    autoComplete="street-address"
                    rows={2}
                    value={details.address}
                    onChange={handleChange}
                    required
                    maxLength={250}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      className="form-control"
                      autoComplete="address-level2"
                      value={details.city}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="region">State / Province</label>
                    <input
                      id="region"
                      name="region"
                      className="form-control"
                      autoComplete="address-level1"
                      value={details.region}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="postalCode">Postal code</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      className="form-control"
                      autoComplete="postal-code"
                      value={details.postalCode}
                      onChange={handleChange}
                      required
                      maxLength={20}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="country">Country</label>
                    <input
                      id="country"
                      name="country"
                      className="form-control"
                      autoComplete="country-name"
                      value={details.country}
                      onChange={handleChange}
                      required
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Delivery method</h2>
                <div className="form-check border rounded p-3 ps-5 mb-2">
                  <input
                    id="standard-delivery"
                    name="deliveryMethod"
                    type="radio"
                    className="form-check-input"
                    value="standard"
                    checked={details.deliveryMethod === "standard"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label w-100" htmlFor="standard-delivery">
                    <span className="d-flex justify-content-between">
                      <span>Standard delivery</span>
                      <span>Rs. 200</span>
                    </span>
                    <span className="d-block small text-muted">
                      Regular delivery
                    </span>
                  </label>
                </div>
                <div className="form-check border rounded p-3 ps-5">
                  <input
                    id="fast-delivery"
                    name="deliveryMethod"
                    type="radio"
                    className="form-check-input"
                    value="fast"
                    checked={details.deliveryMethod === "fast"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label w-100" htmlFor="fast-delivery">
                    <span className="d-flex justify-content-between">
                      <span>Fast delivery</span>
                      <span>Rs. 270</span>
                    </span>
                    <span className="d-block small text-muted">
                      Standard delivery plus Rs. 70
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <section className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Payment method</h2>
                <div className="form-check border rounded p-3 ps-5 mb-2">
                  <input
                    id="cash-on-delivery"
                    name="paymentMethod"
                    type="radio"
                    className="form-check-input"
                    value="cash-on-delivery"
                    checked={details.paymentMethod === "cash-on-delivery"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="cash-on-delivery">
                    Cash on delivery
                  </label>
                </div>
                <div className="form-check border rounded p-3 ps-5">
                  <input
                    id="online"
                    name="paymentMethod"
                    type="radio"
                    className="form-check-input"
                    value="online"
                    checked={details.paymentMethod === "online"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="online">
                    Online payment
                    <span className="d-block small text-muted">
                      You will be redirected to Stripe to pay securely.
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <button
              type="submit"
              className="btn btn-dark btn-lg w-100"
              disabled={submitting}
            >
              {submitting
                ? details.paymentMethod === "online"
                  ? "Opening Stripe..."
                  : "Placing order..."
                : details.paymentMethod === "online"
                  ? "Pay with Stripe"
                  : "Place order"}
            </button>
          </form>
        </div>

        <aside className="col-lg-5">
          <section className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">Order summary</h2>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between gap-3 py-2 border-bottom"
                >
                  <span>
                    {item.book?.title || "Unavailable book"} × {item.quantity}
                  </span>
                  <span className="text-nowrap">
                    {Number.isFinite(item.book?.price)
                      ? (item.book.price * item.quantity).toFixed(2)
                      : "Price unavailable"}
                  </span>
                </div>
              ))}
              <div className="d-flex justify-content-between fw-bold mt-3">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>{details.deliveryMethod === "fast" ? "Fast" : "Standard"} delivery</span>
                <span>Rs. {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold border-top mt-3 pt-3 fs-5">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <p className="small text-muted mt-2 mb-0">
                Taxes, if applicable, are not included.
              </p>
              <Link href="/cart" className="btn btn-outline-dark w-100 mt-3">
                Back to cart
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
