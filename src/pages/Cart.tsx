import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import styles from "../styles/Cart.module.css";
import API from "../api";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useGlobal();

  useEffect(() => {
    document.cookie = `cart=${JSON.stringify(cart)}; path=/;`;
  }, [cart]);

  const handleCheckout = async () => {
    try {
      for (const item of cart) {
        const res = await API.put(`/products/stock/${item._id}`, {
          quantityPurchased: item.quantity
        });

        if (!res.data) {
          throw new Error(`Failed to update stock for ${item.name}`);
        }
      }

      setCart([]);
      document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      alert("Purchase complete!");
      navigate("/user");
    } catch (error: any) {
      console.error("Checkout failed:", error);
      if (error.response && error.response.status === 401) {
        alert("You need to be logged in to complete checkout.");
        navigate("/login");
      } else {
        alert("Something went wrong during checkout.");
      }
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
            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              ✅ Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
