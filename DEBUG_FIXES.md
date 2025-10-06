# Debug Issues & Fixes

## Issues Found:

### 1. Data Inconsistency
- **Problem**: Non-Veg Thali marked as `isVeg: true`
- **Fix**: Run `node fix-menu-data.js` to correct menu item flags

### 2. Razorpay Configuration Missing
- **Problem**: Payment service unavailable due to missing credentials
- **Fix**: Add to `.env`:
  ```
  RAZORPAY_KEY_ID=your_key_id
  RAZORPAY_KEY_SECRET=your_key_secret
  ```

### 3. Guest Order Logic
- **Problem**: Guest orders using user addresses incorrectly
- **Status**: Already handled in current code

## Quick Fixes:

```bash
# Fix menu data
node fix-menu-data.js

# Update environment variables
cp .env.example .env
# Edit .env with proper Razorpay credentials
```

## Order Debug Info Analysis:
- Order ID: 31 (Non-Veg Thali - ₹330)
- Issue: Item marked as veg but is non-veg
- Payment: Pending (Razorpay unavailable)
- Address: Valid guest address structure