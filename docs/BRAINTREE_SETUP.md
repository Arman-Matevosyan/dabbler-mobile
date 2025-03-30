# Braintree Integration Setup Guide

This guide explains how the Braintree payment processing is integrated into the Dabbler mobile app using Expo's development builds and config plugins.

## Overview

The app uses the `@joinbubble/expo-braintree-drop-in` package, which provides a config plugin for integrating Braintree's native SDKs into Expo applications without ejecting. This allows us to use Braintree's Drop-in UI for payment processing while maintaining the benefits of Expo's managed workflow.

## Configuration

### 1. Installation & Setup

The necessary package is already installed:

```bash
npm install @joinbubble/expo-braintree-drop-in
```

### 2. Configuration in app.json

The Braintree config plugin is already configured in app.json:

```json
"plugins": [
  [
    "@joinbubble/expo-braintree-drop-in",
    { "braintreeMerchantId": "c85sctj7s9pwx5cp" }
  ]
]
```

This merchant ID (c85sctj7s9pwx5cp) is also set in the eas.json environment variables for each build profile.

### 3. Development Build Requirements

To test Braintree payments, you need to:

1. Create a development build using EAS Build:
   ```bash
   eas build --profile development --platform ios
   # or
   eas build --profile development --platform android
   ```

2. Install the generated app on your device
3. Run `npx expo start --dev-client` to start the development server

## Implementation Details

### Payment Flow

The app implements two primary payment flows:

1. **Add Payment Method** - For saving a payment method without charging the user
2. **Process Payment** - For completing a transaction using either a new or saved payment method

### Key Components

- **useClientToken Hook** - Fetches a client token from the backend
- **useCreatePaymentMethod Hook** - Handles saving payment methods
- **Dynamic Payment Route** - The `app/(features)/payments/[id].tsx` dynamic route handles both payment flows based on the ID parameter

### Testing

For testing in the sandbox environment, use the following test cards:

- **Visa (Success)**: 4111 1111 1111 1111
- **Visa (Failure)**: 4000 1111 1111 1111
- **Expiration Date**: Any future date
- **CVV**: Any 3 digits

## Security Considerations

1. The client token is fetched from the server to prevent exposing sensitive credentials
2. All actual payment processing happens on the server
3. For production deployment, ensure proper certificate pinning and HTTPS usage

## Next Steps

1. **Connect to Real Backend** - Replace the mock implementations in the hooks with actual API calls
2. **Error Handling** - Add more robust error handling and user feedback
3. **Saved Payment Methods** - Implement UI for viewing and selecting saved payment methods

## Resources

- [Braintree iOS SDK Documentation](https://developer.paypal.com/braintree/docs/guides/client-sdk/setup/ios/v4)
- [Braintree Android SDK Documentation](https://developer.paypal.com/braintree/docs/guides/client-sdk/setup/android/v3)
- [Expo Config Plugins Guide](https://docs.expo.dev/guides/config-plugins/)
- [@joinbubble/expo-braintree-drop-in Package](https://github.com/bubble-dev/expo-braintree-drop-in) 