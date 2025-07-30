import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import styles from "../styles/Cart.module.css";
import API from "../api";
import PaymentForm, { PaymentData } from "../components/PaymentForm";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useGlobal();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.cookie = `cart=${JSON.stringify(cart)}; path=/;`;
  }, [cart]);

  const handlePaymentSubmit = (paymentData: PaymentData) => {
    console.log("Payment data submitted:", paymentData);
    setIsProcessing(true);
    // Simulate payment processing time
    setTimeout(handleCheckout, 2000);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        console.log(`Updating stock for product ${item.name} (ID: ${item._id}), purchasing ${item.quantity}...`);
        
        const res = await API.put(`/products/stock/${item._id}`, {
          quantityPurchased: item.quantity
        });

        console.log(`Stock update response for ${item.name}:`, res.data);

        if (!res.data) {
          throw new Error(`Failed to update stock for ${item.name}`);
        }
      }

      setCart([]);
      document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      alert("Purchase complete! 🎉");
      navigate("/user");
    } catch (error: any) {
      console.error("Checkout failed:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.msg || 'Unknown error';
        
        switch (status) {
          case 401:
            alert("❌ You need to be logged in to complete checkout.");
            navigate("/login");
            break;
          case 400:
            alert(`❌ Checkout failed: ${message}`);
            break;
          case 404:
            alert("❌ Product not found. It may have been removed.");
            break;
          case 500:
            alert(`❌ Server error: ${message}`);
            break;
          default:
            alert(`❌ Checkout failed: ${message} (Status: ${status})`);
        }
      } else if (error.request) {
        alert("❌ Network error: Cannot connect to server. Please check if the backend is running.");
      } else {
        alert(`❌ Checkout failed: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
      setShowPaymentForm(false);
    }
  };

  const handleRemove = (_id: string) => {
    const updated = cart.filter((item) => item._id !== _id);
    setCart(updated);
    document.cookie = `cart=${JSON.stringify(updated)}; path=/;`;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>🛍️ Your Cart</h2>

      {cart.length === 0 ? (
        <p className={styles.empty}>Cart is empty.</p>
      ) : (
        <>
          <div className={styles.list}>
            {cart.map((item) => (
              <div key={item._id} className={styles.card}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Category: {item.category}</p>
                  {item.brand && <p>Brand: {item.brand}</p>}
                  {item.specs && <p>Specs: {item.specs}</p>}
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <button onClick={() => handleRemove(item._id)} className={styles.removeBtn}>
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <p>
              Total: <strong>${total}</strong>
            </p>
            <button onClick={() => setShowPaymentForm(true)} className={styles.checkoutBtn}>
              ✅ Checkout
            </button>
          </div>
        </>
      )}
      
      {showPaymentForm && (
        <PaymentForm 
          total={total} 
          onPaymentSubmit={handlePaymentSubmit} 
          onCancel={() => setShowPaymentForm(false)} 
          isProcessing={isProcessing} 
        />
      )}
    </div>
  );
};

export default Cart;
