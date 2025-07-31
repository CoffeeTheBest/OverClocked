import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { currentUser } = useGlobal();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.particleContainer}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleGlow}>🎮</span>
            <span className={styles.titleText}>Overclocked</span>
            <span className={styles.titleGlow}>⚡</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Built for battle, wired for victory. Explore elite gaming gear from RTX to Ryzen — 
            because your setup should be as legendary as your gameplay.
          </p>
          
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Gamers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>Support</span>
            </div>
          </div>

          {!currentUser ? (
            <div className={styles.ctaButtons}>
              <Link to="/signup">
                <button className={styles.primaryCTA}>
                  <span className={styles.buttonIcon}>🚀</span>
                  Join the Squad
                </button>
              </Link>
              <Link to="/login">
                <button className={styles.secondaryCTA}>
                  <span className={styles.buttonIcon}>🎯</span>
                  Log In
                </button>
              </Link>
            </div>
          ) : (
            <div className={styles.welcomeSection}>
              <p className={styles.welcomeMessage}>
                Welcome back, <strong>{currentUser.username}</strong>! 🎉
              </p>
              {currentUser.role === "user" ? (
                <div className={styles.userActions}>
                  <Link to="/user">
                    <button className={styles.primaryCTA}>Start Shopping</button>
                  </Link>
                  <Link to="/cart">
                    <button className={styles.secondaryCTA}>View Cart</button>
                  </Link>
                </div>
              ) : (
                <Link to="/admin">
                  <button className={styles.primaryCTA}>Admin Dashboard</button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Overclocked?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔥</div>
            <h3>Premium Performance</h3>
            <p>Top-tier gaming hardware that pushes your limits</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Lightning Fast</h3>
            <p>Instant delivery and rapid customer support</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3>Secure Shopping</h3>
            <p>Bank-level security for all your transactions</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎮</div>
            <h3>Gamer Focused</h3>
            <p>Built by gamers, for gamers</p>
          </div>
        </div>
      </section>

      {/* Interactive Showcase */}
      <section className={styles.showcaseSection}>
        <div className={styles.showcaseContent}>
          <h2 className={styles.sectionTitle}>Experience the Future of Gaming</h2>
          <div className={styles.interactiveDemo}>
            <div className={styles.demoCard}>
              <div className={styles.demoVisual}>
                <div className={styles.floatingElement}>🎮</div>
                <div className={styles.floatingElement}>💻</div>
                <div className={styles.floatingElement}>🎧</div>
              </div>
              <p>Discover cutting-edge gaming technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.finalCTA}>
        <div className={styles.ctaContent}>
          <h2>Ready to Level Up?</h2>
          <p>Join thousands of gamers who trust Overclocked for their setup</p>
          {!currentUser && (
            <div className={styles.ctaButtons}>
              <Link to="/signup">
                <button className={styles.primaryCTA}>Get Started Now</button>
              </Link>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default Home;
