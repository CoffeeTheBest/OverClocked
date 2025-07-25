import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import API from "../api"; // 🛰️ Axios instance
import styles from "../styles/Login.module.css";
import toast from 'react-hot-toast';
import { handleApiError, isRateLimitError } from '../utils/errorHandler';

const Login = () => {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useGlobal();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await API.post("/auth/login", { username, password, role });
      const user = res.data.user;
      document.cookie = `currentUser=${JSON.stringify(user)}; path=/;`;
      setCurrentUser(user);
      toast.success("Login successful!");
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err: any) {
      if (isRateLimitError(err)) {
        toast.error("Too many attempts, please try again later.");
      } else {
        toast.error(handleApiError(err));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <label className={styles.label}>
            Username:
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className={styles.label}>
            Password:
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </label>

          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
