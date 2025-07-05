import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartSelector } from "../redux/cart/selectors";
import { clearItems } from "../redux/cart/slice";
import styles from "./Payment.module.scss";
import { DEMO_MODE, createRazorpayOptions } from "../utils/razorpayConfig";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector(cartSelector);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "crypto">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoAddress, setCryptoAddress] = useState("6fCoQEsCyXBKMz93xUzxqiEhaXwjCZQ1NaDnEFyPKpZ1");
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const totalCount = items.reduce(
    (sum: number, item: any) => sum + item.count,
    0
  );

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Check backend status
    fetch('http://localhost:3000/api/payment/test')
      .then(response => {
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      })
      .catch(() => {
        setBackendStatus('disconnected');
      });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      if (DEMO_MODE) {
        // Demo payment for testing (without actual Razorpay integration)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful payment
        const isSuccess = Math.random() > 0.3; // 70% success rate for demo
        
        if (isSuccess) {
          console.log("Payment successful!");
          dispatch(clearItems());
          navigate("/", { state: { paymentSuccess: true } });
        } else {
          alert("Payment failed. Please try again.");
        }
      } else {
        // Actual Razorpay integration
        if (!window.Razorpay) {
          throw new Error("Razorpay SDK not loaded");
        }

        // Create order through backend
        console.log('Creating order for amount:', totalPrice);
        let orderId: string;
        
        try {
          const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: totalPrice,
              currency: 'INR'
            })
          });

          if (!orderResponse.ok) {
            const errorData = await orderResponse.json();
            console.error('Order creation failed:', errorData);
            throw new Error(`Failed to create order: ${errorData.error || 'Unknown error'}`);
          }

          const response = await orderResponse.json();
          orderId = response.orderId;
          console.log('Order created with ID:', orderId);
        } catch (error) {
          console.error('Backend connection failed:', error);
          // Fallback to client-side order creation
          orderId = `order_${Date.now()}`;
          console.log('Using fallback order ID:', orderId);
        }

        const options = createRazorpayOptions(
          totalPrice,
          "INR",
          `Order for ${totalCount} items`,
          orderId
        );

        // Override the handler
        (options as any).handler = async function (response: any) {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyResponse.ok) {
              console.log("Payment successful:", response);
              dispatch(clearItems());
              navigate("/", { state: { paymentSuccess: true } });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCryptoPayment = () => {
    setIsProcessing(true);
    // Simulate crypto payment process
    setTimeout(() => {
      alert("Please send the exact amount to the provided crypto address. Your order will be processed once payment is confirmed.");
      setIsProcessing(false);
    }, 1000);
  };

  const handlePayment = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else {
      handleCryptoPayment();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show a more user-friendly popup instead of alert
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background:rgb(255, 112, 35);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    `;
    popup.textContent = "Address copied to clipboard!";
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(popup);
    
    // Remove popup after 3 seconds
    setTimeout(() => {
      popup.style.animation = 'slideOut 0.3s ease-in';
      popup.style.transform = 'translateX(100%)';
      popup.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(popup);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  };

  useEffect(() => {
    if (!totalPrice) {
      navigate("/cart");
    }
  }, [totalPrice, navigate]);

  if (!totalPrice) {
    return null;
  }

  return (
    <div className="container container--payment">
      <div className={styles.payment}>
        <div className={styles.payment__top}>
          <h2 className="content__title" style={{ textAlign: "center"  , color: "#fff" }}>
            Payment
          </h2>
          <div style={{ 
            textAlign: "center", 
            marginTop: "10px",
            fontSize: "14px",
            color: backendStatus === 'connected' ? '#4CAF50' : backendStatus === 'disconnected' ? '#f44336' : '#ff9800'
          }}>
            Backend Status: {backendStatus === 'connected' ? '✅ Connected' : backendStatus === 'disconnected' ? '❌ Disconnected' : '⏳ Checking...'}
          </div>
        </div>

        <div className={styles.payment__content}>
          <div className={styles.payment__main}>
            {/* Order Summary Card */}
            <div className={styles.payment__card + ' ' + styles.payment__summary_card}>
              <h3>Order Summary</h3>
              <div className={styles.payment__items}>
                {items.map((item: any) => (
                  <div key={item.id} className={styles.payment__item_row}>
                    <span className={styles.payment__item_title}>{item.title}</span>
                    <span className={styles.payment__item_count}>x{item.count}</span>
                    <span className={styles.payment__item_dash}>—</span>
                    <span className={styles.payment__item_price}>${item.price * item.count}</span>
                  </div>
                ))}
              </div>
              <div className={styles.payment__divider} />
              <div className={styles.payment__total_row}>
                <span>Total Items:</span>
                <span>{totalCount}</span>
              </div>
              <div style={{ height: 8 }} />
              <div className={styles.payment__total_row + ' ' + styles.payment__total_amount}>
                <span>Total Amount:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {/* Payment Methods Card */}
            <div className={styles.payment__card + ' ' + styles.payment__methods_card}>
              <h3>Choose Payment Method</h3>
              <div className={styles.payment__method_options_row}>
                <label className={styles.payment__method_option + (paymentMethod === 'razorpay' ? ' ' + styles.selected : '')}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value as "razorpay" | "crypto")}
                  />
                  <div className={styles.payment__method_content}>
                    <div className={styles.payment__method_icon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Credit/Debit Card</h4>
                      <p>Pay securely with Razorpay</p>
                    </div>
                  </div>
                </label>

                <label className={styles.payment__method_option + (paymentMethod === 'crypto' ? ' ' + styles.selected : '')}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="crypto"
                    checked={paymentMethod === "crypto"}
                    onChange={(e) => setPaymentMethod(e.target.value as "razorpay" | "crypto")}
                  />
                  <div className={styles.payment__method_content}>
                    <div className={styles.payment__method_icon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div>
                      <h4>Cryptocurrency</h4>
                      <p>Pay with Bitcoin or other crypto</p>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === "crypto" && (
                <div className={styles.payment__crypto_details}>
                  <h4>Crypto Payment Details</h4>
                  <div className={styles.payment__crypto_address}>
                    <p>Send exactly <strong>${totalPrice}</strong> to:</p>
                    <div className={styles.payment__address_container}>
                      <code className={styles.payment__address}>{cryptoAddress}</code>
                      <button 
                        className={styles.payment__copy_btn}
                        onClick={() => copyToClipboard(cryptoAddress)}
                      >
                        Copy
                      </button>
                    </div>
                    <h5>Network: Solana Network</h5>
                    <br></br>
                    <p className={styles.payment__crypto_note}>
                      ⚠️ Send the exact amount. Any difference will delay your order processing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className={styles.payment__actions_row}>
            <button
              className="button button--outline"
              onClick={() => navigate("/cart")}
              disabled={isProcessing}
            >
              Back to Cart
            </button>
            <button
              className="button pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay $${totalPrice}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 