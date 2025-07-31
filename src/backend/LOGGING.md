# 📋 Logging System Documentation

## Overview
This application uses a comprehensive logging system with Winston to track all activities, especially payment and order information. All logs are stored securely and sensitive data is automatically sanitized. Logs are now organized into separate files by type for easier management and analysis.

## 📁 Log Files

### General Logs (`general.log`)
- **Purpose**: General application activities and system events
- **Data**: Application startup, configuration, general operations
- **Retention**: 5 files, 5MB each

### Payment Logs (`payments.log`)
- **Purpose**: Track all payment-related activities
- **Data**: Payment intents, successful payments, failed payments, Stripe events
- **Security**: Sensitive data (card numbers, client secrets) are automatically hidden
- **Retention**: 10 files, 5MB each

### Authentication Logs (`auth.log`)
- **Purpose**: Track user authentication activities
- **Data**: Login attempts, signups, logout events, session verification
- **Security**: Passwords are never logged
- **Retention**: 5 files, 5MB each

### Order Logs (`orders.log`)
- **Purpose**: Track all order-related activities
- **Data**: Order creation, status updates, order retrieval, order management
- **Security**: Order IDs and user information are logged safely
- **Retention**: 10 files, 5MB each

### Product Logs (`products.log`)
- **Purpose**: Track product management activities
- **Data**: Product creation, updates, deletion, inventory changes
- **Retention**: 10 files, 5MB each

### Error Logs (`errors.log`)
- **Purpose**: Track all application errors and exceptions
- **Data**: Error messages, stack traces, error context
- **Retention**: 5 files, 5MB each

### Security Logs (`security.log`)
- **Purpose**: Track security-related events
- **Data**: Failed login attempts, account lockouts, suspicious activities
- **Retention**: 5 files, 5MB each

### API Logs (`api.log`)
- **Purpose**: Track API requests and responses
- **Data**: Request/response logging, performance metrics
- **Retention**: 5 files, 5MB each

## 🔒 Security Features

### Automatic Data Sanitization
- **Payment Intent IDs**: Only first 8 characters shown, rest hidden
- **Client Secrets**: Completely hidden with `***HIDDEN***`
- **Card Numbers**: Completely hidden with `***HIDDEN***`
- **Passwords**: Never logged

### Log Rotation
- **File Size**: 5MB maximum per file
- **File Count**: 5-10 files per log type
- **Automatic**: Old files are automatically archived

## 🛠️ Log Management

### Using npm scripts:
```bash
# List all log files and their sizes
npm run logs:list

# Clean logs older than 30 days
npm run logs:clean

# Show log statistics
npm run logs:stats

# View recent logs (default: general, 50 lines)
npm run logs:view

# View specific log type
npm run logs:view payments

# View specific log type with custom line count
npm run logs:view orders 100

# Search logs for specific terms
npm run logs:search auth "login failed"
```

### Using the script directly:
```bash
# List logs
node scripts/logManager.js list

# Clean old logs (keep last 7 days)
node scripts/logManager.js clean 7

# View payment logs (last 20 lines)
node scripts/logManager.js view payments 20

# Search auth logs for failed logins
node scripts/logManager.js search auth "login failed"

# View error logs
node scripts/logManager.js view errors
```

## 📊 Log Format

### Payment Logs Example:
```json
{
  "timestamp": "2025-07-31T05:25:35.749Z",
  "level": "info",
  "service": "overclocked-api",
  "logType": "payments",
  "message": "Payment intent created for user Huzaifa",
  "paymentIntentId": "pi_3Rqozj...",
  "userId": "507f1f77bcf86cd799439011",
  "amount": 99.99,
  "currency": "usd"
}
```

### Authentication Logs Example:
```json
{
  "timestamp": "2025-07-31T05:26:10.236Z",
  "level": "info",
  "service": "overclocked-api",
  "logType": "auth",
  "message": "User login successful",
  "userId": "507f1f77bcf86cd799439011",
  "username": "Huzaifa",
  "email": "huzaifa@example.com",
  "role": "user",
  "action": "login_success"
}
```

### Order Logs Example:
```json
{
  "timestamp": "2025-07-31T05:26:10.236Z",
  "level": "info",
  "service": "overclocked-api",
  "logType": "orders",
  "message": "Order created successfully",
  "orderId": "688afe72f70d9a9474773312",
  "userId": "507f1f77bcf86cd799439011",
  "username": "Huzaifa",
  "total": 99.99,
  "itemCount": 2,
  "paymentIntentId": "pi_3Rqozj..."
}
```

## 🚫 GitHub Protection

### .gitignore Configuration
The following patterns are ignored by Git:
```
# logs
*.log
logs/
build.log
**/logs/
**/*.log
```

This ensures that:
- ✅ No log files are ever committed to Git
- ✅ No sensitive payment data is exposed
- ✅ Log directories are completely ignored
- ✅ All log file extensions are protected

## 🔍 Monitoring Logs

### Development
- Logs are displayed in console during development
- Real-time payment tracking
- Immediate error visibility

### Production
- Logs are written to files only
- No console output for security
- Automatic log rotation
- Structured JSON format for easy parsing

## 📈 Best Practices

1. **Regular Monitoring**: Check logs daily for errors
2. **Log Rotation**: Clean old logs monthly
3. **Security**: Never commit logs to Git
4. **Backup**: Consider backing up important logs
5. **Analysis**: Use log data for business insights
6. **Search**: Use the search functionality to find specific events
7. **Organization**: Use separate log files for different concerns

## 🚨 Important Notes

- **Sensitive Data**: All payment information is automatically sanitized
- **Performance**: Logs are written asynchronously to avoid blocking
- **Storage**: Monitor log directory size regularly
- **Compliance**: Logs help with PCI DSS compliance for payments
- **Organization**: Each log type has its own file for easier management
- **Search**: Use the search functionality to quickly find specific events 