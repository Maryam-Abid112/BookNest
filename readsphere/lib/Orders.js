const request = async (path, body) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Please log in before continuing to checkout");
  }

  const response = await fetch(`http://localhost:5000/api/orders${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to complete your order");
  }

  window.dispatchEvent(new Event("booknest:cart-updated"));
  return data;
};

const placeOrder = (checkoutDetails) => request("", checkoutDetails);
const createStripeCheckoutSession = (checkoutDetails) =>
  request("/stripe/checkout-session", checkoutDetails);
const confirmStripePayment = (sessionId) =>
  request("/stripe/confirm-payment", { sessionId });
const cancelStripeCheckout = (orderId) =>
  request("/stripe/cancel-checkout", { orderId });

export {
  placeOrder,
  createStripeCheckoutSession,
  confirmStripePayment,
  cancelStripeCheckout,
};
