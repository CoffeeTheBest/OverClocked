import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { currentUser } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role === "admin") {
      navigate("/admin");
    } else if (currentUser?.role === "user") {
      navigate("/user");
    }
  }, [currentUser, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>🎮 Welcome to Overclocked</h1>
      <p className={styles.subheader}>
        Built for battle, wired for victory. Explore elite gaming gear from RTX to Ryzen — because your setup should be as legendary as your gameplay.
      </p>

      <div className={styles.buttonGroup}>
        <Link to="/signup">
          <button className={styles.primaryButton}>Join the Squad</button>
        </Link>
        <Link to="/login">
          <button className={styles.secondaryButton}>Log In</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
