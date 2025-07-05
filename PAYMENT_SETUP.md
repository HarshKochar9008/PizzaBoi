# Razorpay Payment Integration Setup

## Overview
This project has been integrated with Razorpay payment gateway for processing online payments.

## Features
- ✅ Real Razorpay integration (not demo mode)
- ✅ Backend order creation and payment verification
- ✅ Frontend payment processing
- ✅ Error handling and fallback mechanisms

## Setup Instructions

### 1. Backend Setup
The backend server is configured to run on port 3000 and includes:
- Razorpay SDK integration
- Order creation endpoint: `POST /api/payment/create-order`
- Payment verification endpoint: `POST /api/payment/verify-payment`
- Test endpoint: `GET /api/payment/test`

### 2. Frontend Setup
The frontend is configured to:
- Connect to backend on `http://localhost:3000`
- Handle payment processing with proper error handling
- Fallback to client-side order creation if backend is unavailable

### 3. Razorpay Credentials
Currently using test credentials:
- Key ID: `rzp_test_LHnBCG8o7BUqz2`
- Key Secret: `JxyO4z31Tswuz983XdhlW7gA`

## How to Test

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
```bash
npm install
npm start
```

### 3. Test Payment Flow
1. Add items to cart
2. Go to payment page
3. Click "Pay" button
4. Razorpay modal should open
5. Use test card details:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3 digits
   - Name: Any name

## Troubleshooting

### Payment Modal Not Opening
1. Check browser console for errors
2. Verify backend is running on port 3000
3. Check if Razorpay script is loaded
4. Ensure DEMO_MODE is set to false in `src/utils/razorpayConfig.ts`

### Backend Connection Issues
1. Verify backend server is running
2. Check if port 3000 is available
3. Test backend endpoint: `http://localhost:3000/api/payment/test`

### Payment Verification Issues
1. Check backend logs for verification errors
2. Verify Razorpay credentials are correct
3. Ensure proper signature verification

## Production Setup

For production deployment:
1. Replace test credentials with live Razorpay credentials
2. Update `CURRENT_MODE` to 'LIVE' in `src/utils/razorpayConfig.ts`
3. Set up proper environment variables
4. Configure CORS for production domain
5. Implement proper error logging and monitoring

## Security Notes
- Never commit live Razorpay credentials to version control
- Use environment variables for sensitive data
- Implement proper input validation
- Add rate limiting for payment endpoints
- Monitor payment logs for suspicious activity 