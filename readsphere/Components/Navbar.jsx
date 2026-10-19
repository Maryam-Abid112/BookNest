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
    if (!token) {
      setCartItems([]);
      setCartError("");
      return;
    }

    try {
      const data = await getCart();
      setCartItems(data.cart);
      setCartError("");
    } catch (error) {
      setCartError(error.message);
    }
  }, [token]);

  useEffect(() => {
    Promise.resolve().then(refreshCart);
    window.addEventListener("booknest:cart-updated", refreshCart);
    return () => window.removeEventListener("booknest:cart-updated", refreshCart);
  }, [refreshCart]);

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
            <div className="position-relative mx-2">
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
              {cartOpen && (
                <div
                  className="position-absolute end-0 mt-2 bg-white border rounded shadow p-3"
                  style={{ width: "min(340px, 90vw)", zIndex: 1050 }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Shopping cart</strong>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close cart preview"
                      onClick={() => setCartOpen(false)}
                    />
                  </div>
                  {cartError ? (
                    <p className="small text-danger mb-2">{cartError}</p>
                  ) : !token ? (
                    <p className="small text-muted mb-2">Log in to see your cart.</p>
                  ) : cartItems.length === 0 ? (
                    <p className="small text-muted mb-2">Your cart is empty.</p>
                  ) : (
                    <>
                      <div className="overflow-auto" style={{ maxHeight: "260px" }}>
                        {cartItems.map((item) => (
                          <div
                            key={item._id}
                            className="d-flex justify-content-between align-items-start gap-2 border-bottom py-2"
                          >
                            <div className="small">
                              <div className="fw-semibold">{item.book?.title || "Unavailable book"}</div>
                              <div className="text-muted">
                                {item.quantity} × {Number.isFinite(item.book?.price) ? item.book.price.toFixed(2) : "Price unavailable"}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-link text-danger p-0"
                              aria-label={`Remove ${item.book?.title || "book"} from cart`}
                              onClick={() => handleRemoveCartItem(item._id)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between fw-semibold mt-2">
                        <span>Subtotal</span>
                        <span>{cartSubtotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="d-flex gap-2 mt-3">
                    {!token && (
                      <Link
                        href="/Login?redirect=%2Fcart"
                        className="btn btn-outline-dark btn-sm flex-fill"
                        onClick={() => setCartOpen(false)}
                      >
                        Log in
                      </Link>
                    )}
                    <Link
                      href="/cart"
                      className="btn btn-dark btn-sm flex-fill"
                      onClick={() => setCartOpen(false)}
                    >
                      View cart
                    </Link>
                  </div>
                </div>
              )}
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
    </>
  )
}
