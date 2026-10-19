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
    window.dispatchEvent(new Event("booknest:cart-updated"));
  }

  return data;
};

const getCart = () => request("getcart");
const addToCart = (bookid, quantity) =>
  request("addtocart", { method: "POST", body: { bookid, quantity } });
const updateCartItem = (id, quantity) =>
  request("updatecart", { method: "POST", body: { id, quantity } });
const removeFromCart = (id) =>
  request("removefromcart", { method: "POST", body: { id } });

export { getCart, addToCart, updateCartItem, removeFromCart };
