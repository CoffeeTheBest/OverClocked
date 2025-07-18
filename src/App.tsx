import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { GlobalProvider, useGlobal } from "./context/GlobalContext";
import styles from "./Navbar.module.css";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    if (part) return part.split(';').shift() || null;
  }
  return null;
};

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

const AppContent = () => {
  const { setCurrentUser, setCart } = useGlobal();
  // Use currentUser cookie for login state
  const currentUserCookie = getCookie("currentUser");
  let currentUser: { username: string; email: string; role: "user" | "admin" } | null = null;
  if (currentUserCookie) {
    try {
      currentUser = JSON.parse(currentUserCookie);
    } catch {
      currentUser = null;
    }
  }

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
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<ProtectedUser />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
};

const App = () => (
  <GlobalProvider>
    <Router>
      <AppContent />
    </Router>
  </GlobalProvider>
);

export default App;
