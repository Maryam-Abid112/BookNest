"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../lib/Cart";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      if (!active) {
        return;
      }

      setOrderNote(localStorage.getItem("booknest:order-note") || "");
      try {
        const data = await getCart();
        if (active) {
          setCart(data.cart);
          setError("");
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
  }, []);

  const handleCheckout = () => {
    if (!localStorage.getItem("token")) {
      router.push("/Login?redirect=%2Fcheckout");
      return;
    }
    router.push("/checkout");
  };

  const changeQuantity = async (id, quantity) => {
    try {
      const data = await updateCartItem(id, quantity);
      setCart((items) =>
        items.map((item) => (item._id === id ? data.item : item))
      );
      setQuantities((values) => ({ ...values, [id]: data.item.quantity }));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      setQuantities((values) => {
        const item = cart.find((cartItem) => cartItem._id === id);
        return { ...values, [id]: item?.quantity ?? 1 };
      });
    }
  };

  const handleOrderNoteChange = (event) => {
    const note = event.target.value;
    setOrderNote(note);
    localStorage.setItem("booknest:order-note", note);
  };

  const removeItem = async (id) => {
    try {
      await removeFromCart(id);
      setCart((items) => items.filter((item) => item._id !== id));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const subtotal = cart.reduce((total, item) => {
    if (!Number.isFinite(item.book?.price)) {
      return total;
    }
    return total + item.book.price * item.quantity;
  }, 0);

  return (
    <main className="container py-5">
      <h1 className="fw-bold mb-4">My Cart</h1>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading ? (
        <p className="text-muted">Loading your cart...</p>
      ) : cart.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Your cart is empty</h4>
          <Link href="/book" className="btn btn-outline-dark mt-3">
            Browse books
          </Link>
        </div>
      ) : (
        <>
          <div className="list-group mb-4">
            {cart.map((item) => {
              const book = item.book;
              const available = Number.isSafeInteger(book?.quantity)
                ? book.quantity
                : 0;

              return (
                <div
                  className="list-group-item p-3"
                  key={item._id}
                >
                  <div className="row align-items-center g-3">
                    <div className="col-4 col-md-2">
                      {book && (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="img-fluid rounded"
                        />
                      )}
                    </div>
                    <div className="col-8 col-md-4">
                      <h5 className="mb-1">{book?.title || "Unavailable book"}</h5>
                      <p className="text-muted mb-1">{book?.author}</p>
                      {Number.isFinite(book?.price) ? (
                        <p className="mb-0">Price: {book.price.toFixed(2)}</p>
                      ) : (
                        <p className="text-danger mb-0">Price unavailable</p>
                      )}
                      <small className="text-muted">
                        {available} {available === 1 ? "copy" : "copies"} in stock
                      </small>
                    </div>
                    <div className="col-6 col-md-3">
                      <label className="form-label" htmlFor={`quantity-${item._id}`}>
                        Quantity
                      </label>
                      <input
                        id={`quantity-${item._id}`}
                        type="number"
                        className="form-control"
                        min="1"
                        max={available}
                        value={quantities[item._id] ?? item.quantity}
                        onChange={(event) => {
                          setQuantities((values) => ({
                            ...values,
                            [item._id]: event.target.value,
                          }));
                        }}
                        onBlur={(event) => {
                          const quantity = Number(event.target.value);
                          if (Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= available) {
                            changeQuantity(item._id, quantity);
                          } else {
                            setQuantities((values) => ({
                              ...values,
                              [item._id]: item.quantity,
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="col-6 col-md-3 text-md-end">
                      <p className="fw-bold mb-2">
                        Subtotal:{" "}
                        {Number.isFinite(book?.price)
                          ? (book.price * item.quantity).toFixed(2)
                          : "Unavailable"}
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {item.quantity > available && (
                    <p className="text-danger mt-2 mb-0">
                      Stock has changed. Reduce the quantity to {available} or remove this item.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-end">
            <h4>Cart subtotal: {subtotal.toFixed(2)}</h4>
            <small className="text-muted">
              Shipping and taxes, if applicable, are not included.
            </small>
            <div className="text-start mt-4">
              <label className="form-label fw-semibold" htmlFor="order-note">
                Order note <span className="text-muted fw-normal">(optional)</span>
              </label>
              <textarea
                id="order-note"
                className="form-control"
                rows="3"
                maxLength="500"
                placeholder="Add a note about your order"
                value={orderNote}
                onChange={handleOrderNoteChange}
              />
            </div>
            <div>
              <button
                type="button"
                className="btn btn-dark mt-3"
                onClick={handleCheckout}
              >
                Check out
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
