import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import styles from './PaymentForm.module.css';
import { useGlobal } from '../context/GlobalContext';
import API from '../api';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51RqWlkKvdUjfg3rN72kqHouUtUaQjXzlhisbVSVsqBud3AQHZSIOjR1mu4lEojDJ2SPJUOfnCGJOnGzcaWat5vJI00xRUSFJwA');

export interface PaymentData {
  paymentIntentId: string;
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
  items: any[];
  onPaymentSubmit: (paymentData: PaymentData) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm: React.FC<PaymentFormProps> = ({ 
  total, 
  items,
  onPaymentSubmit, 
  onCancel, 
  isProcessing 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userAddress, setUserAddress } = useGlobal();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string>('');

  // Load stored address if available
  useEffect(() => {
    if (userAddress) {
      setFormData({
        street: userAddress.street,
        city: userAddress.city,
        state: userAddress.state,
        zipCode: userAddress.zipCode,
        country: userAddress.country
      });
    }
  }, [userAddress]);

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await API.post('/orders/payment-intent', {
          amount: total,
          currency: 'usd'
        });
        setClientSecret(response.data.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          alert('Please log in to proceed with payment.');
          // Optionally redirect to login page
          window.location.href = '/login';
        } else if (error.response?.status === 400) {
          alert(`Payment initialization failed: ${error.response.data.msg || 'Invalid request'}`);
        } else if (error.response?.status >= 500) {
          alert('Payment service is temporarily unavailable. Please try again later.');
        } else {
          console.error('Unknown payment error:', error);
          alert('Failed to initialize payment. Please try again.');
        }
      }
    };

    if (total > 0) {
      createPaymentIntent();
    }
  }, [total]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      alert('Payment system not ready. Please try again.');
      return;
    }

    if (!validateForm()) return;

    // Prevent multiple submissions
    if (isProcessing) return;

    // Store the address for future use
    const addressData = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country
    };
    
    // Only store if address is not already stored or if it's different
    if (!userAddress || JSON.stringify(userAddress) !== JSON.stringify(addressData)) {
      setUserAddress(addressData);
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          address: {
            line1: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipCode,
            country: formData.country,
          },
        },
      },
    });

    if (error) {
      alert(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === 'succeeded') {
      const paymentData: PaymentData = {
        paymentIntentId: paymentIntent.id,
        address: addressData
      };
      onPaymentSubmit(paymentData);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>💳 Payment</h2>
          <p>Total: <strong>${total.toFixed(2)}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.paymentMethod}>
            <h3>💳 Credit Card Payment</h3>
            <div className={styles.cardElement}>
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className={styles.shippingAddress}>
            <h3>Shipping Address</h3>
            {userAddress && (
              <div className={styles.savedAddressNote}>
                <span>✅ Your address has been saved from a previous order</span>
                <button 
                  type="button"
                  onClick={() => {
                    setUserAddress(null);
                    setFormData({
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: ''
                    });
                  }}
                  className={styles.clearAddressBtn}
                >
                  Clear
                </button>
              </div>
            )}
            
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
              disabled={isProcessing || !stripe || !clientSecret}
            >
              {isProcessing ? '⏳ Processing Payment...' : `💳 Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default PaymentForm;
