import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import API from "../api"; // 🛰️ Axios instance
import styles from "../styles/Signup.module.css";

const Signup = () => {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { setCurrentUser } = useGlobal();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signup", { username, email, password, role });
      const user = res.data.user;
      document.cookie = `currentUser=${JSON.stringify(user)}; path=/;`;
      setCurrentUser(user);
      alert("Signup successful!");
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={handleSignup} className={styles.form}>
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
              onChange={(e) => setRole(e.target.value as "user" | "admin")}
              className={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label className={styles.label}>
            Email:
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
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

          <button type="submit" className={styles.button}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
