const placeOrder = async (checkoutDetails) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please log in before placing your order");
  }

  const response = await fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(checkoutDetails),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to place order");
  }

  window.dispatchEvent(new Event("booknest:cart-updated"));
  return data;
};

export { placeOrder };
