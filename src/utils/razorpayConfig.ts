// Razorpay Configuration
// Replace these with your actual Razorpay credentials

export const RAZORPAY_CONFIG = {
  // Test credentials (for development)
  TEST: {
    key: "rzp_test_LHnBCG8o7BUqz2",
    secret: "JxyO4z31Tswuz983XdhlW7gA"
  },
  // Live credentials (for production)
  LIVE: {
    key: "rzp_live_YOUR_KEY_HERE",
    secret: "YOUR_LIVE_SECRET_HERE"
  }
};

// Set this to 'TEST' for development, 'LIVE' for production
export const CURRENT_MODE = 'TEST';

export const getRazorpayConfig = () => {
  return RAZORPAY_CONFIG[CURRENT_MODE as keyof typeof RAZORPAY_CONFIG];
};

// Demo mode for testing without actual Razorpay integration
export const DEMO_MODE = false; // Set to true for demo/testing, false for actual Razorpay

export const createRazorpayOptions = (amount: number, currency: string, description: string, orderId: string) => {
  const config = getRazorpayConfig();
  
  console.log('Creating Razorpay options:', {
    amount,
    currency,
    description,
    orderId,
    key: config.key
  });
  
  return {
    key: config.key,
    amount: amount * 100, // Convert to paise
    currency: currency,
    name: "PizzaBoi",
    description: description,
    image: "/img/logo.png",
    order_id: orderId,
    prefill: {
      name: "Customer Name",
      email: "customer@example.com",
      contact: "9999999999"
    },
    theme: {
      color: "#fe5f1e"
    },
    modal: {
      ondismiss: function() {
        console.log("Payment modal dismissed");
      }
    },
    handler: function(response: any) {
      console.log("Payment successful:", response);
    },
    notes: {
      address: "PizzaBoi Corporate Office"
    },
    reminder: {
      enable: true
    }
  };
}; 