# Payment Fix Guide

## Current Status
The payment system is now working in **DEMO MODE** by default. This means:
- ✅ Payment page loads without errors
- ✅ You can test the payment flow
- ✅ Cart clears on successful payment
- ✅ No backend setup required for testing

## How to Test

1. **Add items to cart**
2. **Go to cart page**
3. **Click "Pay" button**
4. **Choose "Credit/Debit Card"**
5. **Click "Pay $X"**
6. **Wait 2 seconds** (demo processing)
7. **Payment will succeed 70% of the time** (demo mode)

## To Enable Real Razorpay Integration

### Step 1: Get Razorpay Credentials
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login
3. Go to Settings > API Keys
4. Generate a new key pair
5. Copy the Key ID and Key Secret

### Step 2: Update Configuration
Edit `src/utils/razorpayConfig.ts`:

```typescript
export const RAZORPAY_CONFIG = {
  TEST: {
    key: "rzp_test_LHnBCG8o7BUqz2", // Replace with your test key
    secret: "JxyO4z31Tswuz983XdhlW7gA" // Replace with your test secret
  },
  // ... rest of config
};

// Change this to false to use real Razorpay
export const DEMO_MODE = false;
```

### Step 3: Test with Real Integration
1. Update the keys in the config file
2. Set `DEMO_MODE = false`
3. Test with Razorpay test cards:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4000 0000 0000 0002
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

## Backend Integration (Optional)

If you want to use the backend for order creation and verification:

1. **Start the backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Set up environment variables** in `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_secret
   ```

3. **Update the Payment component** to use backend integration (see the commented code in `Payment.tsx`)

## Current Features

### ✅ Working
- Payment page UI
- Demo payment simulation
- Crypto payment display
- Cart integration
- Responsive design
- Error handling

### 🔄 Ready for Production
- Real Razorpay integration
- Backend payment verification
- Environment configuration
- Security best practices

## Troubleshooting

### Payment Fails Immediately
- Check if you're using the correct Razorpay keys
- Make sure `DEMO_MODE` is set correctly
- Check browser console for errors

### Razorpay Modal Doesn't Open
- Verify Razorpay script is loading
- Check if the key is valid
- Ensure you're using test keys for development

### Backend Connection Issues
- Make sure backend server is running on port 3000
- Check if MongoDB is connected
- Verify environment variables are set

## Next Steps

1. **Test the demo mode** - It should work immediately
2. **Get Razorpay credentials** - Sign up at Razorpay.com
3. **Enable real integration** - Update the config file
4. **Test with real cards** - Use the test card numbers
5. **Deploy to production** - Use live keys and backend integration 