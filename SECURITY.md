# 🔐 Security Documentation - OverClocked

This document outlines the security measures implemented in the OverClocked application.

## 🛡️ Security Features Implemented

### 1. **Authentication & Authorization**
- **JWT Tokens**: Secure token-based authentication with 1-hour expiration
- **HttpOnly Cookies**: Tokens stored in secure, HttpOnly cookies
- **Role-based Access Control**: User and admin roles with proper authorization
- **Account Lockout**: Automatic account locking after 5 failed login attempts (2-hour lockout)
- **Password Security**: 
  - Minimum 10 characters
  - Must contain uppercase, lowercase, numbers, and special characters
  - Common password detection
  - No sequential or repeated characters

### 2. **Input Validation & Sanitization**
- **Express Validator**: Server-side validation for all endpoints
- **XSS Protection**: Input sanitization using the `xss` package
- **NoSQL Injection Prevention**: MongoDB query sanitization using `express-mongo-sanitize`
- **Input Length Limits**: Maximum string lengths to prevent buffer overflow attacks
- **Type Validation**: Strict type checking for all inputs

### 3. **Rate Limiting**
- **General Rate Limiting**: 100 requests per 15 minutes per IP
- **Authentication Rate Limiting**: 5 login attempts per 15 minutes per IP
- **Configurable Limits**: Environment-based rate limiting configuration

### 4. **Security Headers**
- **Helmet.js**: Comprehensive security headers
- **Content Security Policy**: XSS protection with strict directives
- **HSTS**: HTTP Strict Transport Security
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection

### 5. **CORS Configuration**
- **Origin Restriction**: Only allowed origins can access the API
- **Credentials Support**: Secure cookie handling
- **Method Restrictions**: Only allowed HTTP methods
- **Header Restrictions**: Only allowed headers

### 6. **Database Security**
- **Connection Security**: SSL/TLS encryption for database connections
- **Query Sanitization**: Prevention of injection attacks
- **Input Validation**: Schema-level validation
- **Audit Trails**: User tracking for all operations

### 7. **Error Handling**
- **Secure Error Messages**: No sensitive information in error responses
- **Comprehensive Logging**: Security events logged with Winston
- **Graceful Degradation**: Proper error handling without information leakage

### 8. **Logging & Monitoring**
- **Security Event Logging**: All authentication and authorization events
- **Error Logging**: Comprehensive error tracking
- **Audit Trails**: User action tracking
- **Performance Monitoring**: Request/response timing

## 🔧 Security Configuration

### Environment Variables Required
```bash
# Required
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production

# Optional (with defaults)
HTTPS=true
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info
```

### Security Best Practices
1. **Use Strong JWT Secrets**: Generate using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. **Enable HTTPS in Production**: Set `HTTPS=true` and `NODE_ENV=production`
3. **Regular Security Updates**: Keep all dependencies updated
4. **Database Security**: Use MongoDB Atlas or similar with SSL
5. **Environment Isolation**: Separate development and production environments

## 🚨 Security Considerations

### For Production Deployment
1. **SSL/TLS**: Always use HTTPS in production
2. **Environment Variables**: Never commit `.env` files
3. **Database Security**: Use managed database services
4. **Regular Backups**: Implement automated backup strategies
5. **Monitoring**: Set up security monitoring and alerting

### Additional Recommendations
1. **Two-Factor Authentication**: Consider implementing 2FA for admin accounts
2. **API Rate Limiting**: Implement more granular rate limiting
3. **Session Management**: Consider Redis for session storage
4. **File Upload Security**: Implement secure file upload handling
5. **API Documentation Security**: Protect Swagger docs in production

## 📊 Security Metrics

- **Password Strength**: 10+ characters with complexity requirements
- **Session Duration**: 1-hour JWT expiration
- **Rate Limiting**: 100 requests/15min, 5 auth attempts/15min
- **Account Lockout**: 5 failed attempts = 2-hour lockout
- **Input Validation**: 100% of endpoints validated
- **Security Headers**: Comprehensive Helmet.js configuration

## 🔍 Security Testing

### Recommended Security Tests
1. **Penetration Testing**: Regular security assessments
2. **Dependency Scanning**: Automated vulnerability scanning
3. **Input Validation Testing**: Test all endpoints with malicious input
4. **Authentication Testing**: Test account lockout and rate limiting
5. **Authorization Testing**: Verify role-based access controls

### Tools for Security Testing
- **OWASP ZAP**: Web application security scanner
- **npm audit**: Dependency vulnerability scanning
- **Snyk**: Security vulnerability monitoring
- **Burp Suite**: Web application security testing

## 📞 Security Contact

For security issues or questions:
- **Email**: security@overclocked.com (example)
- **Responsible Disclosure**: Please report vulnerabilities privately
- **Response Time**: 24-48 hours for initial response

---

**Note**: This is an internship project. For production use, additional security measures should be implemented based on specific requirements and threat models. 