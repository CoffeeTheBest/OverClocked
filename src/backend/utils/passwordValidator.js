const validatePassword = (password) => {
  const minLength = 10; // Increased from 8 to 10
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return "Password is too common. Please choose a more unique password.";
  }
  
  if (password.length < minLength) {
    return "Password must be at least 10 characters long";
  }
  if (!hasUpperCase || !hasLowerCase) {
    return "Password must contain both uppercase and lowercase letters";
  }
  if (!hasNumbers) {
    return "Password must contain at least one number";
  }
  if (!hasSpecialChar) {
    return "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)";
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    return "Password cannot contain more than 2 consecutive identical characters";
  }
  
  // Check for sequential characters
  if (/123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
    return "Password cannot contain sequential characters";
  }
  
  return null;
};

module.exports = { validatePassword };
