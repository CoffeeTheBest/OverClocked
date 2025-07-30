import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import API from "../api"; // 🛰️ Axios instance
import styles from "../styles/Signup.module.css";

interface ValidationState {
  isValid: boolean;
  message: string;
  strength?: number; // For password strength
}

const Signup = () => {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Touched states - track if user has interacted with fields
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // Focus states - track which field is currently focused
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Validation states
  const [usernameValidation, setUsernameValidation] = useState<ValidationState>({ isValid: false, message: "" });
  const [emailValidation, setEmailValidation] = useState<ValidationState>({ isValid: false, message: "" });
  const [passwordValidation, setPasswordValidation] = useState<ValidationState>({ isValid: false, message: "", strength: 0 });
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<ValidationState>({ isValid: false, message: "" });
  
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
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
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
    
    if (username.length > 20) {
      setUsernameValidation({ isValid: false, message: "Username cannot exceed 20 characters" });
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameValidation({ isValid: false, message: "Username can only contain letters, numbers, and underscores" });
      return;
    }
    
    setUsernameValidation({ isValid: true, message: "Username looks good!" });
  }, [username]);

  // Real-time email validation
  useEffect(() => {
    if (email.length === 0) {
      setEmailValidation({ isValid: false, message: "Email is required" });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidation({ isValid: false, message: "Please enter a valid email address" });
      return;
    }
    
    setEmailValidation({ isValid: true, message: "Email looks good!" });
  }, [email]);

  // Real-time password validation
  useEffect(() => {
    if (password.length === 0) {
      setPasswordValidation({ isValid: false, message: "Password is required", strength: 0 });
      return;
    }
    
    let strength = 0;
    let message = "";
    
    // Length check
    if (password.length >= 10) strength += 1;
    else message += "At least 10 characters. ";
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    else message += "Include uppercase letters. ";
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    else message += "Include lowercase letters. ";
    
    // Number check
    if (/\d/.test(password)) strength += 1;
    else message += "Include numbers. ";
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    else message += "Include special characters (!@#$%^&*(),.?\":{}|<>). ";
    
    // Common password check
    const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome', 'monkey'];
    if (commonPasswords.includes(password.toLowerCase())) {
      strength = 0;
      message = "This password is too common. Choose something more unique.";
    }
    
    // Sequential characters check
    if (/123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
      strength = Math.max(0, strength - 1);
      message += "Avoid sequential characters. ";
    }
    
    // Repeated characters check
    if (/(.)\1{2,}/.test(password)) {
      strength = Math.max(0, strength - 1);
      message += "Avoid repeated characters. ";
    }
    
    if (strength >= 4) {
      setPasswordValidation({ isValid: true, message: "Strong password!", strength });
    } else if (strength >= 2) {
      setPasswordValidation({ isValid: false, message: message || "Password needs improvement", strength });
    } else {
      setPasswordValidation({ isValid: false, message: message || "Weak password", strength });
    }
  }, [password]);

  // Real-time confirm password validation
  useEffect(() => {
    if (confirmPassword.length === 0) {
      setConfirmPasswordValidation({ isValid: false, message: "Please confirm your password" });
      return;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordValidation({ isValid: false, message: "Passwords do not match" });
      return;
    }
    
    setConfirmPasswordValidation({ isValid: true, message: "Passwords match!" });
  }, [confirmPassword, password]);

  // Check if form is valid
  const isFormValid = usernameValidation.isValid && 
                     emailValidation.isValid && 
                     passwordValidation.isValid && 
                     confirmPasswordValidation.isValid;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      alert("Please fix the validation errors before submitting.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const res = await API.post("/auth/signup", { 
        username, 
        email, 
        password, 
        role 
      });
      const user = res.data.user;
      document.cookie = `currentUser=${JSON.stringify(user)}; path=/;`;
      setCurrentUser(user);
      alert("Signup successful!");
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 4) return "#4CAF50"; // Green
    if (strength >= 2) return "#FF9800"; // Orange
    return "#F44336"; // Red
  };

  const getStrengthText = (strength: number) => {
    if (strength >= 4) return "Strong";
    if (strength >= 2) return "Medium";
    return "Weak";
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Username:
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                onFocus={() => handleFieldFocus('username')}
                onBlur={() => handleFieldBlur('username')}
                className={`${styles.input} ${touchedFields.username && (usernameValidation.isValid ? styles.valid : usernameValidation.message ? styles.invalid : '')}`}
                placeholder="Enter username (3-20 characters)"
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
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                className={styles.input}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Email:
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onFocus={() => handleFieldFocus('email')}
                onBlur={() => handleFieldBlur('email')}
                className={`${styles.input} ${touchedFields.email && (emailValidation.isValid ? styles.valid : emailValidation.message ? styles.invalid : '')}`}
                placeholder="Enter your email"
              />
            </label>
            {focusedField === 'email' && touchedFields.email && emailValidation.message && (
              <div className={`${styles.validationMessage} ${emailValidation.isValid ? styles.valid : styles.invalid}`}>
                {emailValidation.message}
              </div>
            )}
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
                placeholder="Enter password (min 10 characters)"
              />
            </label>
            {focusedField === 'password' && touchedFields.password && passwordValidation.strength !== undefined && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div 
                    className={styles.strengthFill}
                    style={{ 
                      width: `${(passwordValidation.strength / 5) * 100}%`,
                      backgroundColor: getStrengthColor(passwordValidation.strength)
                    }}
                  />
                </div>
                <span className={styles.strengthText}>
                  {getStrengthText(passwordValidation.strength)}
                </span>
              </div>
            )}
            {focusedField === 'password' && touchedFields.password && passwordValidation.message && (
              <div className={`${styles.validationMessage} ${passwordValidation.isValid ? styles.valid : styles.invalid}`}>
                {passwordValidation.message}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Confirm Password:
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                onFocus={() => handleFieldFocus('confirmPassword')}
                onBlur={() => handleFieldBlur('confirmPassword')}
                className={`${styles.input} ${touchedFields.confirmPassword && (confirmPasswordValidation.isValid ? styles.valid : confirmPasswordValidation.message ? styles.invalid : '')}`}
                placeholder="Confirm your password"
              />
            </label>
            {focusedField === 'confirmPassword' && touchedFields.confirmPassword && confirmPasswordValidation.message && (
              <div className={`${styles.validationMessage} ${confirmPasswordValidation.isValid ? styles.valid : styles.invalid}`}>
                {confirmPasswordValidation.message}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`${styles.button} ${!isFormValid || isSubmitting ? styles.disabled : ''}`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
