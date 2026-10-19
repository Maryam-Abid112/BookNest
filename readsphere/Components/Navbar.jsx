"use client"
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Authcontext';
import Search from './Search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart } from '../lib/Cart';
export default function Navbar() {

  const { token, setToken ,name,setname} = useContext(AuthContext);
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartError, setCartError] = useState("");

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCartItems(data.cart);
      setCartError("");
    } catch (error) {
      setCartError(error.message);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(refreshCart);
    window.addEventListener("booknest:cart-updated", refreshCart);
    return () => window.removeEventListener("booknest:cart-updated", refreshCart);
  }, [refreshCart, token]);

  useEffect(() => {
    if (!cartOpen) {
      return undefined;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [cartOpen]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + (Number.isFinite(item.book?.price) ? item.book.price * item.quantity : 0),
    0
  );

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
    setname(null);
    setCartOpen(false);
  }

  const handlesignup = () => {
    router.push('/Signup');


  }
  const handlelogin = () => {
    router.push('/Login');
  }

  const handleuser=()=>{
    router.push('/library');
  }

  const handleRemoveCartItem = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      setCartError(error.message);
    }
  };

  const handleDrawerCheckout = () => {
    setCartOpen(false);
    if (!token) {
      router.push("/Login?redirect=%2Fcheckout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><b>BookNest</b></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/book">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/About">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/Genre">Genre</Link>
              </li>
             
            </ul>
            <Search />
            <div className="mx-2">
              <button
                type="button"
                className="btn btn-outline-dark position-relative"
                aria-label={`Shopping cart, ${cartCount} items`}
                aria-expanded={cartOpen}
                onClick={() => setCartOpen((open) => !open)}
              >
                <svg
                  aria-hidden="true"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            {(token) ? (
              <>
                <button className="btn btn-outline-success my-2 mx-3" onClick={handlelogout}>Logout</button>
                <div 
                  className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center me-3" onClick={handleuser}
                  style={{
                    width: "45px",
                    height: "45px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {(name ? name : "A").charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <button className="btn btn-outline-dark my-2 mx-3" onClick={handlelogin}>Login</button>
                <button className="btn btn-outline-dark" onClick={handlesignup}>Signup</button>
              </>
            )}
          </div>
        </div>
      </nav>
      {cartOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 2000 }}
        >
          <button
            type="button"
            className="position-absolute top-0 start-0 w-100 h-100 border-0"
            style={{ background: "rgba(0, 0, 0, 0.45)" }}
            aria-label="Close shopping cart"
            onClick={() => setCartOpen(false)}
          />
          <aside
            className="position-absolute top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
            style={{ width: "min(420px, 100vw)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <div>
                <h2 className="h5 mb-1">Your cart</h2>
                <span className="small text-muted">{cartCount} items</span>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
              />
            </div>

            <div className="flex-grow-1 overflow-auto p-3">
              {cartError ? (
                <p className="small text-danger">{cartError}</p>
              ) : cartItems.length === 0 ? (
                <p className="text-center text-muted py-5">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex gap-3 border-bottom py-3"
                  >
                    <div
                      className="d-flex align-items-center justify-content-center bg-light rounded flex-shrink-0"
                      style={{ width: "72px", height: "96px" }}
                    >
                      {item.book?.coverImage && (
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="mw-100 mh-100 rounded"
                          style={{ objectFit: "contain" }}
                        />
                      )}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold text-truncate">
                        {item.book?.title || "Unavailable book"}
                      </div>
                      <div className="small text-muted">
                        Quantity: {item.quantity}
                      </div>
                      <div className="small">
                        {Number.isFinite(item.book?.price)
                          ? `${item.book.price.toFixed(2)} each`
                          : "Price unavailable"}
                      </div>
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-danger p-0 mt-1"
                        onClick={() => handleRemoveCartItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="small fw-semibold text-nowrap">
                      {Number.isFinite(item.book?.price)
                        ? (item.book.price * item.quantity).toFixed(2)
                        : "—"}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-top p-4">
              {cartItems.length > 0 && (
                <div className="d-flex justify-content-between fw-semibold mb-3">
                  <span>Subtotal</span>
                  <span>{cartSubtotal.toFixed(2)}</span>
                </div>
              )}
              <div className="d-flex gap-2">
                <Link
                  href="/cart"
                  className="btn btn-outline-dark flex-fill"
                  onClick={() => setCartOpen(false)}
                >
                  View cart
                </Link>
                <button
                  type="button"
                  className="btn btn-dark flex-fill"
                  onClick={handleDrawerCheckout}
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
