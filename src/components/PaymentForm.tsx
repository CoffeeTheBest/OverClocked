import React, { useState } from 'react';
import styles from './PaymentForm.module.css';

export interface PaymentData {
  method: 'credit' | 'debit' | 'paypal' | 'apple_pay' | 'google_pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolderName?: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface PaymentFormProps {
  total: number;
  onPaymentSubmit: (paymentData: PaymentData) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  total, 
  onPaymentSubmit, 
  onCancel, 
  isProcessing 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentData['method']>('credit');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (expiryDate: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate address fields (required for all payment methods)
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!formData.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Cardholder name is required';
      }

      if (!validateCardNumber(formData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!validateExpiryDate(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }

      if (!validateCVV(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
      }
    }

    if (paymentMethod === 'paypal') {
      if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const paymentData: PaymentData = {
      method: paymentMethod,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      ...(paymentMethod === 'credit' || paymentMethod === 'debit' ? {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardHolderName: formData.cardHolderName
      } : {}),
      ...(paymentMethod === 'paypal' ? {
        email: formData.email
      } : {})
    };

    onPaymentSubmit(paymentData);
  };

  // const formatCardNumber = (number: string) => {
  //   return number.replace(/\d(?=\d{4})/g, '*');
  // };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>💳 Payment</h2>
          <p>Total: <strong>${total.toFixed(2)}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.paymentMethods}>
            <h3>Select Payment Method</h3>
            
            <label className={`${styles.methodOption} ${paymentMethod === 'credit' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={paymentMethod === 'credit'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentData['method'])}
              />
              <span>💳 Credit Card</span>
            </label>

            <label className={`${styles.methodOption} ${paymentMethod === 'debit' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="debit"
                checked={paymentMethod === 'debit'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentData['method'])}
              />
              <span>💳 Debit Card</span>
            </label>

            <label className={`${styles.methodOption} ${paymentMethod === 'paypal' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentData['method'])}
              />
              <span>🅿️ PayPal</span>
            </label>

            <label className={`${styles.methodOption} ${paymentMethod === 'apple_pay' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="apple_pay"
                checked={paymentMethod === 'apple_pay'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentData['method'])}
              />
              <span>🍎 Apple Pay</span>
            </label>

            <label className={`${styles.methodOption} ${paymentMethod === 'google_pay' ? styles.selected : ''}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="google_pay"
                checked={paymentMethod === 'google_pay'}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentData['method'])}
              />
              <span>🔵 Google Pay</span>
            </label>
          </div>

          <div className={styles.shippingAddress}>
            <h3>Shipping Address</h3>
            
            <div className={styles.inputGroup}>
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter your street address"
                className={errors.street ? styles.error : ''}
              />
              {errors.street && <span className={styles.errorText}>{errors.street}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className={errors.city ? styles.error : ''}
                />
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>State/Province *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state/province"
                  className={errors.state ? styles.error : ''}
                />
                {errors.state && <span className={styles.errorText}>{errors.state}</span>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>ZIP/Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="Enter your ZIP/postal code"
                  className={errors.zipCode ? styles.error : ''}
                />
                {errors.zipCode && <span className={styles.errorText}>{errors.zipCode}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter your country"
                  className={errors.country ? styles.error : ''}
                />
                {errors.country && <span className={styles.errorText}>{errors.country}</span>}
              </div>
            </div>
          </div>

          {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
            <div className={styles.cardDetails}>
              <h3>Card Details</h3>
              
              <div className={styles.inputGroup}>
                <label>Cardholder Name *</label>
                <input
                  type="text"
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleInputChange}
                  placeholder="Enter Name"
                  className={errors.cardHolderName ? styles.error : ''}
                />
                {errors.cardHolderName && <span className={styles.errorText}>{errors.cardHolderName}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? styles.error : ''}
                />
                {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={errors.expiryDate ? styles.error : ''}
                  />
                  {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={errors.cvv ? styles.error : ''}
                  />
                  {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className={styles.paypalDetails}>
              <h3>PayPal Details</h3>
              <div className={styles.inputGroup}>
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
            </div>
          )}

          {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
            <div className={styles.digitalWallet}>
              <p>You will be redirected to {paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} to complete your payment.</p>
            </div>
          )}

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onCancel} 
              className={styles.cancelBtn}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.payBtn}
              disabled={isProcessing}
            >
              {isProcessing ? '⏳ Processing...' : `💳 Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
