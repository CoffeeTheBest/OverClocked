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
      {/* Dynamic neon particles background - lots of animated elements */}
      <svg className={styles.cyberParticles} width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <g>
          {/* Neon circles */}
          {[...Array(18)].map((_, i) => (
            <circle
              key={i}
              cx={80 + i * 75}
              cy={100 + (i % 2) * 600}
              r={4 + (i % 3)}
              fill={i % 2 === 0 ? '#e100ff' : '#00ff88'}
              opacity="0.6"
            >
              <animate attributeName="cy" values={`100;${700 - i * 10};100`} dur={`${6 + i % 5}s`} repeatCount="indefinite" />
            </circle>
          ))}
          {/* Neon lines */}
          {[...Array(12)].map((_, i) => (
            <rect
              key={100 + i}
              x={120 + i * 110}
              y={200 + (i % 2) * 500}
              width="2"
              height={60 + (i % 4) * 20}
              fill={i % 2 === 0 ? '#9d4edd' : '#e100ff'}
              opacity="0.4"
            >
              <animate attributeName="y" values={`200;${800 - i * 20};200`} dur={`${7 + i % 4}s`} repeatCount="indefinite" />
            </rect>
          ))}
          {/* Neon moving dots */}
          {[...Array(14)].map((_, i) => (
            <circle
              key={200 + i}
              cx={1300 - i * 90}
              cy={150 + i * 40}
              r={3 + (i % 2)}
              fill={i % 2 === 0 ? '#00ff88' : '#e100ff'}
              opacity="0.7"
            >
              <animate attributeName="cx" values={`${1300 - i * 90};${200 + i * 30};${1300 - i * 90}`} dur={`${10 + i % 6}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      </svg>
      <div className={styles.header}>
        <span className={styles.cyberIcon}>
          {/* Cyberpunk SVG icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" stroke="#e100ff" strokeWidth="2" fill="#1a1027" />
            <path d="M8 16h16M16 8v16" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <h2>Welcome, {currentUser?.username || "User"}!</h2>
      </div>

      <div className={styles.grid}>
        {products.map((product, idx) => (
          <div
            key={product._id}
            className={styles.card + " " + styles.cyberCard}
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div className={styles.neonAccent}></div>
            <h3 className={styles.cardTitle}>{product.name}</h3>
            <p className={styles.cardCategory}>
              <span className={styles.cardLabel}>Category:</span>
              <span>{product.category}</span>
            </p>
            {product.brand && (
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Brand:</span>
                <span>{product.brand}</span>
              </p>
            )}
            {product.specs && (
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Specs:</span>
                <span>{product.specs}</span>
              </p>
            )}
            <p className={styles.cardField}>
              <span className={styles.cardLabel}>Description:</span>
              <span>{product.description}</span>
            </p>
            <p className={styles.cardField}>
              <span className={styles.cardLabel}>Price:</span>
              <span>${product.price}</span>
            </p>
            <p className={styles.cardField}>
              <span className={styles.cardLabel}>Stock:</span>
              <span style={{ color: product.quantity > 0 ? '#00ff88' : '#e100ff', fontWeight: 700 }}>
                {product.quantity > 0
                  ? `In Stock: ${product.quantity}`
                  : "Out of Stock"}
              </span>
            </p>
            <div className={styles.cardButtonContainer}>
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
