import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import axios from "../api"; // 🧠 custom axios instance
import styles from "../styles/UserDashboard.module.css";

type Product = {
  _id: string;
  name: string;
  category:
    | "laptop"
    | "keyboard"
    | "mouse"
    | "monitor"
    | "headset"
    | "console"
    | "accessory"
    | "graphics card"
    | "controller"
    | "cpu"
    | "motherboard"
    | "ram"
    | "cooling system"
    | "pc case"
    | "psu"
    | "storage"
    | "streaming gear"
    | "gaming chair"
    | "vr"
    | "networking"
    | "capture card"
    | "software"
    | "bundle"
    | "other";
  brand?: string;
  description: string;
  price: number;
  quantity: number;
  specs?: string;
};


const UserDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { currentUser, cart, setCart } = useGlobal();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        alert("Please log in to view products.");
        navigate("/login");
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleAddToCart = (product: Product) => {
    if (!currentUser || currentUser.role !== "user") {
      alert("You must be logged in as a user to add to cart!");
      return;
    }

    if (product.quantity <= 0) {
      alert("Out of stock!");
      return;
    }

    const existingItem = cart.find((item) => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    document.cookie = `cart=${JSON.stringify(updatedCart)}; path=/;`;
    alert("Added to cart!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Welcome, {currentUser?.username || "User"}!</h2>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product._id} className={styles.card}>
            <h3>{product.name}</h3>
            <p>Category: <strong>{product.category}</strong></p>
            {product.brand && <p>Brand: <strong>{product.brand}</strong></p>}
            {product.specs && <p>Specs: <strong>{product.specs}</strong></p>}
            <p>{product.description}</p>
            <p>
              <strong>${product.price}</strong>
            </p>
            <p>
              {product.quantity > 0
                ? `In Stock: ${product.quantity}`
                : "Out of Stock"}
            </p>
            <button
              disabled={product.quantity <= 0}
              onClick={() => handleAddToCart(product)}
              className={
                product.quantity <= 0 ? styles.disabledButton : styles.button
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className={styles.gotoCartContainer}>
        <button onClick={() => navigate("/cart")} className={styles.gotoCartButton}>
          🛒 Go to Cart
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
