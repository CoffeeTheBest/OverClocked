import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { GlobalProvider, useGlobal } from "./context/GlobalContext";
import ThemePicker from "./components/ThemePicker";
import styles from "./Navbar.module.css";

// const getCookie = (name: string) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) {
//     const part = parts.pop();
//     if (part) return part.split(';').shift() || null;
//   }
//   return null;
// };

// 💡 Use CSS Modules instead of inline styling now!
const CustomLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
    >
      {children}
    </Link>
  );
};

const ProtectedAdmin = () => {
  const { currentUser } = useGlobal();
  return currentUser?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />;
};

const ProtectedUser = () => {
  const { currentUser } = useGlobal();
  return currentUser?.role === "user" ? <UserDashboard /> : <Navigate to="/login" />;
};

const ProtectedCart = () => {
  const { currentUser } = useGlobal();
  return currentUser ? <Cart /> : <Navigate to="/login" />;
};

const AppContent = () => {
  const { currentUser, setCurrentUser, setCart, isAuthLoading } = useGlobal();

  const handleLogout = async () => {
    try {
      await (await import("./api")).default.post("/auth/logout");
    } catch {}
    setCurrentUser(null);
    setCart([]);
    document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  // Show loading screen while checking authentication
  if (isAuthLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: '1.2rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          border: '1px solid var(--accent-primary)',
          borderRadius: '8px',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ marginBottom: '1rem' }}>🔄</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div>
          <div className={styles.logo}>Overclocked</div>
          {currentUser && (
            <div className={styles.userInfo}>
              Logged in as: <strong>{currentUser.username}</strong> ({currentUser.role})
            </div>
          )}
        </div>

        <div className={styles.navLinks}>
          <CustomLink to="/">Home</CustomLink>
          {!currentUser && (
            <>
              <CustomLink to="/login">Login</CustomLink>
              <CustomLink to="/signup">Signup</CustomLink>
            </>
          )}
          {currentUser?.role === "user" && (
            <>
              <CustomLink to="/user">Shop</CustomLink>
              <CustomLink to="/cart">Cart</CustomLink>
            </>
          )}
          {currentUser?.role === "admin" && <CustomLink to="/admin">Admin</CustomLink>}

          {currentUser && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          )}
          <ThemePicker />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<ProtectedUser />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="/cart" element={<ProtectedCart />} />
        <Route path="*" element={<h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
};

const App = () => {
  // Add enhanced parallax effect for the futuristic background
  React.useEffect(() => {
    // Create the background elements
    const starsElement = document.createElement('div');
    starsElement.className = 'stars';
    document.body.appendChild(starsElement);

    const scanLinesElement = document.createElement('div');
    scanLinesElement.className = 'scan-lines';
    document.body.appendChild(scanLinesElement);

    const parallaxContainer = document.createElement('div');
    parallaxContainer.id = 'parallax-container';
    document.body.appendChild(parallaxContainer);

    // Create floating elements
    const floatingElements = document.createElement('div');
    floatingElements.className = 'floating-elements';
    
    // Add individual floating elements
    for (let i = 0; i < 3; i++) {
      const floatingElement = document.createElement('div');
      floatingElement.className = 'floating-element';
      floatingElements.appendChild(floatingElement);
    }
    
    document.body.appendChild(floatingElements);

    // Enhanced parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Move the grid background with perspective
      document.body.style.setProperty(
        '--grid-transform',
        `translate(${x * -15}px, ${y * -15}px)`
      );
      
      // Move the stars with different parallax depth
      starsElement.style.transform = `translate(${x * -25}px, ${y * -25}px)`;
      
      // Move the scan lines slightly
      scanLinesElement.style.transform = `translate(${x * -5}px, ${y * -5}px)`;
      
      // Move the radial gradients with deeper parallax
      parallaxContainer.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
      
      // Move floating elements with varying depths
      const elements = floatingElements.querySelectorAll('.floating-element');
      elements.forEach((el, index) => {
        const depth = (index + 1) * 10;
        (el as HTMLElement).style.transform = `translate(${x * -depth * 1.5}px, ${y * -depth * 1.5}px)`;
      });
    };

    // Add gyroscope support for mobile devices
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      
      // Convert orientation to normalized values (like mouse position)
      const x = (e.gamma || 0) / 45; // -45 to 45 degrees
      const y = (e.beta || 0) / 45; // -45 to 45 degrees
      
      // Apply the same transforms as with mouse movement
      document.body.style.setProperty(
        '--grid-transform',
        `translate(${x * -15}px, ${y * -15}px)`
      );
      
      starsElement.style.transform = `translate(${x * -25}px, ${y * -25}px)`;
      scanLinesElement.style.transform = `translate(${x * -5}px, ${y * -5}px)`;
      parallaxContainer.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
      
      const elements = floatingElements.querySelectorAll('.floating-element');
      elements.forEach((el, index) => {
        const depth = (index + 1) * 10;
        (el as HTMLElement).style.transform = `translate(${x * -depth * 1.5}px, ${y * -depth * 1.5}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      
      // Remove all created elements
      if (document.body.contains(starsElement)) {
        document.body.removeChild(starsElement);
      }
      if (document.body.contains(scanLinesElement)) {
        document.body.removeChild(scanLinesElement);
      }
      if (document.body.contains(parallaxContainer)) {
        document.body.removeChild(parallaxContainer);
      }
      if (document.body.contains(floatingElements)) {
        document.body.removeChild(floatingElements);
      }
    };
  }, []);

  return (
    <GlobalProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1027',
              color: '#fff',
              border: '1px solid #e100ff'
            },
            success: {
              iconTheme: {
                primary: '#00ff88',
                secondary: '#1a1027'
              }
            },
            error: {
              iconTheme: {
                primary: '#e100ff',
                secondary: '#1a1027'
              }
            }
          }}
        />
      </Router>
    </GlobalProvider>
  );
};

export default App;
