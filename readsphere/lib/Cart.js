const GUEST_CART_KEY = "booknest:guest-cart";

const notifyCartUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("booknest:cart-updated"));
  }
};

const readGuestCart = () => {
  const storedCart = localStorage.getItem(GUEST_CART_KEY);
  if (!storedCart) {
    return [];
  }

  const cart = JSON.parse(storedCart);
  if (!Array.isArray(cart)) {
    throw new Error("Saved guest cart is invalid");
  }
  return cart;
};

const saveGuestCart = (cart) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  notifyCartUpdated();
};

const request = async (path, { method = "GET", body } = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please log in to use your cart");
  }

  const response = await fetch(`http://localhost:5000/api/cart/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : {};

  if (!response.ok) {
    const message = response.status === 404
      ? "The cart API route was not found. Restart the backend server and try again."
      : data.message || `Cart request failed (${response.status})`;
    throw new Error(message);
  }

  if (["addtocart", "updatecart", "removefromcart"].includes(path)) {
    notifyCartUpdated();
  }

  return data;
};

const getCart = async () => {
  if (localStorage.getItem("token")) {
    return request("getcart");
  }
  return { cart: readGuestCart() };
};

const addToCart = async (bookid, quantity, book) => {
  if (localStorage.getItem("token")) {
    return request("addtocart", {
      method: "POST",
      body: { bookid, quantity },
    });
  }

  if (!book || book._id !== bookid) {
    throw new Error("Book details are required to add it to a guest cart");
  }

  const available = Number.isSafeInteger(book.quantity) ? book.quantity : 0;
  const cart = readGuestCart();
  const existing = cart.find((item) => item.book?._id === bookid);
  const nextQuantity = (existing?.quantity || 0) + quantity;

  if (!Number.isSafeInteger(quantity) || quantity < 1 || nextQuantity > available) {
    throw new Error(`Only ${available} ${available === 1 ? "copy is" : "copies are"} available`);
  }

  if (existing) {
    existing.quantity = nextQuantity;
    existing.book = book;
  } else {
    cart.push({
      _id: `guest-${bookid}`,
      book,
      quantity,
    });
  }

  saveGuestCart(cart);
  return { message: "Added to cart", cart };
};

const updateCartItem = async (id, quantity) => {
  if (localStorage.getItem("token")) {
    return request("updatecart", { method: "POST", body: { id, quantity } });
  }

  const cart = readGuestCart();
  const item = cart.find((entry) => entry._id === id);
  if (!item) {
    throw new Error("Cart item not found");
  }

  const available = Number.isSafeInteger(item.book?.quantity)
    ? item.book.quantity
    : 0;
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > available) {
    throw new Error(`Only ${available} ${available === 1 ? "copy is" : "copies are"} available`);
  }

  item.quantity = quantity;
  saveGuestCart(cart);
  return { item };
};

const removeFromCart = async (id) => {
  if (localStorage.getItem("token")) {
    return request("removefromcart", { method: "POST", body: { id } });
  }

  saveGuestCart(readGuestCart().filter((item) => item._id !== id));
  return { message: "Removed from cart" };
};

const mergeGuestCart = async () => {
  if (!localStorage.getItem("token")) {
    return;
  }

  const cart = readGuestCart();
  for (const item of cart) {
    await request("addtocart", {
      method: "POST",
      body: { bookid: item.book._id, quantity: item.quantity },
    });
    saveGuestCart(readGuestCart().filter((guestItem) => guestItem._id !== item._id));
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  mergeGuestCart,
};
