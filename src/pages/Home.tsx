import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { currentUser } = useGlobal();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>🎮 Welcome to Overclocked</h1>
      <p className={styles.subheader}>
        Built for battle, wired for victory. Explore elite gaming gear from RTX to Ryzen — because your setup should be as legendary as your gameplay.
      </p>

      {!currentUser ? (
        <div className={styles.buttonGroup}>
          <Link to="/signup">
            <button className={styles.primaryButton}>Join the Squad</button>
          </Link>
          <Link to="/login">
            <button className={styles.secondaryButton}>Log In</button>
          </Link>
        </div>
      ) : (
        <div className={styles.buttonGroup}>
          <p className={styles.welcomeMessage}>
            Welcome back, <strong>{currentUser.username}</strong>!
          </p>
          {currentUser.role === "user" ? (
            <>
              <Link to="/user">
                <button className={styles.primaryButton}>Start Shopping</button>
              </Link>
              <Link to="/cart">
                <button className={styles.secondaryButton}>View Cart</button>
              </Link>
            </>
          ) : (
            <Link to="/admin">
              <button className={styles.primaryButton}>Admin Dashboard</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
