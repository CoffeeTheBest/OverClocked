import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import API from "../api"; // 🛰️ Axios instance
import styles from "../styles/Login.module.css";
import toast from 'react-hot-toast';
import { handleApiError, isRateLimitError } from '../utils/errorHandler';

interface ValidationState {
  isValid: boolean;
  message: string;
}

const Login = () => {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Touched states - track if user has interacted with fields
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false
  });

  // Focus states - track which field is currently focused
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Validation states
  const [usernameValidation, setUsernameValidation] = useState<ValidationState>({ isValid: false, message: "" });
  const [passwordValidation, setPasswordValidation] = useState<ValidationState>({ isValid: false, message: "" });
  
  const navigate = useNavigate();
  const { setCurrentUser } = useGlobal();

  // Handle field blur (when user leaves the field)
  const handleFieldBlur = (fieldName: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    setFocusedField(null); // Clear focus when leaving field
  };

  // Handle field focus (when user clicks on the field)
  const handleFieldFocus = (fieldName: keyof typeof touchedFields) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    setFocusedField(fieldName); // Set focus when entering field
  };

  // Handle field change (mark as touched when user starts typing)
  const handleFieldChange = (fieldName: keyof typeof touchedFields, value: string) => {
    // Mark field as touched when user starts typing
    if (!touchedFields[fieldName] && value.length > 0) {
      setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }
    
    // Update the field value
    switch (fieldName) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  // Real-time username validation
  useEffect(() => {
    if (username.length === 0) {
      setUsernameValidation({ isValid: false, message: "Username is required" });
      return;
    }
    
    if (username.length < 3) {
      setUsernameValidation({ isValid: false, message: "Username must be at least 3 characters" });
      return;
    }
    
    setUsernameValidation({ isValid: true, message: "Username looks good!" });
  }, [username]);

  // Real-time password validation
  useEffect(() => {
    if (password.length === 0) {
      setPasswordValidation({ isValid: false, message: "Password is required" });
      return;
    }
    
    if (password.length < 6) {
      setPasswordValidation({ isValid: false, message: "Password must be at least 6 characters" });
      return;
    }
    
    setPasswordValidation({ isValid: true, message: "Password looks good!" });
  }, [password]);

  // Check if form is valid
  const isFormValid = usernameValidation.isValid && passwordValidation.isValid;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await API.post("/auth/login", { username, password, role });
      const user = res.data.user;
      setCurrentUser(user);
      toast.success("Login successful!");
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err: any) {
      if (isRateLimitError(err)) {
        toast.error("Too many attempts, please try again later.");
      } else {
        toast.error(handleApiError(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Username:
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                onBlur={() => handleFieldBlur('username')}
                onFocus={() => handleFieldFocus('username')}
                className={`${styles.input} ${touchedFields.username && (usernameValidation.isValid ? styles.valid : usernameValidation.message ? styles.invalid : '')}`}
                placeholder="Enter your username or email"
              />
            </label>
            {focusedField === 'username' && touchedFields.username && usernameValidation.message && (
              <div className={`${styles.validationMessage} ${usernameValidation.isValid ? styles.valid : styles.invalid}`}>
                {usernameValidation.message}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
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
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Password:
              <input
                type="password"
                required
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onFocus={() => handleFieldFocus('password')}
                onBlur={() => handleFieldBlur('password')}
                className={`${styles.input} ${touchedFields.password && (passwordValidation.isValid ? styles.valid : passwordValidation.message ? styles.invalid : '')}`}
                placeholder="Enter your password"
              />
            </label>
            {focusedField === 'password' && touchedFields.password && passwordValidation.message && (
              <div className={`${styles.validationMessage} ${passwordValidation.isValid ? styles.valid : styles.invalid}`}>
                {passwordValidation.message}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`${styles.button} ${!isFormValid || isSubmitting ? styles.disabled : ''}`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
