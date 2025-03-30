# Payment Integration Guide

This document provides instructions for completing the Braintree payment integration in the Dabbler mobile app.

## Current Implementation Status

The app currently has a basic skeleton for payment processing:

1. **Payment Method Display** - Users can view their saved payment methods
2. **Dynamic Payment Routes** - Using the `(features)/payments/[id].tsx` dynamic route for:
   - `add` - UI for adding a new payment method
   - `process` - UI for processing payments
3. **API Integration** - React Query hooks for:
   - `useClientToken` - Fetches a Braintree client token from the backend
   - `useCreatePaymentMethod` - Saves a payment method using a nonce

## Test Data

For testing purposes, you can use the following mock response for the token endpoint:

```json
{
  "merchantId": "c85sctj7s9pwx5cp",
  "token": "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUzTkRJNE16TTRNaklzSW1wMGFTSTZJalEyTmpCaE1EQXpMVFpsWm1JdE5ESXpZaTFpWVRVd0xXUXdOVEkzT0ROall6azBOeUlzSW5OMVlpSTZJbU00TlhOamRHbzNjemx3ZDNnMVkzQWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pWXpnMWMyTjBhamR6T1hCM2VEVmpjQ0lzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPblJ5ZFdWOUxDSnlhV2RvZEhNaU9sc2liV0Z1WVdkbFgzWmhkV3gwSWwwc0luTmpiM0JsSWpwYklrSnlZV2x1ZEhKbFpUcFdZWFZzZENKZExDSnZjSFJwYjI1eklqcDdmWDAuZjZ4OXk3OEZOOVhkUWNkeGFzZDRwRFNCYWlqemFXVkhWNnh5dWxQb3QxM3lkdU53V2dyMkRMVGhWZWRQblpqcnpRMmFWQzVRcXZQMEUtYlgzYi12dlEiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvYzg1c2N0ajdzOXB3eDVjcC9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuc2FuZGJveC5icmFpbnRyZWUtYXBpLmNvbS9ncmFwaHFsIiwiZGF0ZSI6IjIwMTgtMDUtMDgiLCJmZWF0dXJlcyI6WyJ0b2tlbml6ZV9jcmVkaXRfY2FyZHMiXX0sImNsaWVudEFwaVVybCI6Imh0dHBzOi8vYXBpLnNhbmRib3guYnJhaW50cmVlZ2F0ZXdheS5jb206NDQzL21lcmNoYW50cy9jODVzY3RqN3M5cHd4NWNwL2NsaWVudF9hcGkiLCJlbnZpcm9ubWVudCI6InNhbmRib3giLCJtZXJjaGFudElkIjoiYzg1c2N0ajdzOXB3eDVjcCIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwidmVubW8iOiJvZmYiLCJjaGFsbGVuZ2VzIjpbXSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vb3JpZ2luLWFuYWx5dGljcy1zYW5kLnNhbmRib3guYnJhaW50cmVlLWFwaS5jb20vYzg1c2N0ajdzOXB3eDVjcCJ9LCJwYXlwYWxFbmFibGVkIjp0cnVlLCJwYXlwYWwiOnsiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJlbnZpcm9ubWVudE5vTmV0d29yayI6dHJ1ZSwidW52ZXR0ZWRNZXJjaGFudCI6ZmFsc2UsImFsbG93SHR0cCI6dHJ1ZSwiZGlzcGxheU5hbWUiOiJ0ZXN0LWNvbXBhbnkiLCJjbGllbnRJZCI6bnVsbCwiYmFzZVVybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9jaGVja291dC5wYXlwYWwuY29tIiwiZGlyZWN0QmFzZVVybCI6bnVsbCwiZW52aXJvbm1lbnQiOiJvZmZsaW5lIiwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwibWVyY2hhbnRBY2NvdW50SWQiOiJ0ZXN0Y29tcGFueSIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9fQ=="
}
```

This is a valid Braintree test token in the sandbox environment with merchant ID `c85sctj7s9pwx5cp`.

## Steps to Complete the Integration

### 1. Install Required Dependencies

```bash
npx expo install react-native-webview
```

### 2. Backend Requirements

The following endpoints are already set up to be called from the React Query hooks:

- **GET /payment/gateway/token** - Generate and return a Braintree client token
- **POST /payment/payment-methods/me** - Save a new payment method using the provided nonce
- **POST /payment/process** - Process a payment using a saved payment method

### 3. Update the Payment Dynamic Route

In `app/(features)/payments/[id].tsx`, the dynamic route already handles different payment flows and uses the new React Query hooks. To complete the WebView integration:

1. Import the WebView component:
   ```typescript
   import WebView from 'react-native-webview';
   ```

2. Replace the mock WebView with the actual implementation in the "add" case:
   ```typescript
   // In the return statement for id === 'add' case, when clientToken is available
   if (clientToken) {
     return (
       <View style={[styles.container, { backgroundColor: colors.background }]}>
         {renderHeader('Add Payment Method')}
         <WebView
           source={{ html: getHTML(clientToken) }}
           onMessage={handleWebViewMessage}
           style={{ flex: 1 }}
         />
       </View>
     );
   }
   ```

3. The `getHTML` function is needed to generate the Braintree Drop-in UI:
   ```typescript
   const getHTML = (token: string) => `
     <!DOCTYPE html>
     <html>
     <head>
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <script src="https://js.braintreegateway.com/web/dropin/1.33.7/js/dropin.min.js"></script>
       <style>
         body { 
           font-family: -apple-system, system-ui;
           margin: 0;
           padding: 16px;
           background-color: ${colors.background};
           color: ${colors.textPrimary};
         }
         #payment-form {
           max-width: 100%;
         }
         .button {
           background-color: ${colors.tint};
           color: white;
           border: none;
           padding: 12px;
           font-size: 16px;
           border-radius: 4px;
           margin-top: 16px;
           width: 100%;
         }
       </style>
     </head>
     <body>
       <div id="dropin-container"></div>
       <button id="submit-button" class="button">Add Payment Method</button>
       
       <script>
         const button = document.querySelector('#submit-button');
         
         braintree.dropin.create({
           authorization: '${token}',
           container: '#dropin-container',
           card: {
             cardholderName: {
               required: true
             }
           },
           paypal: {
             flow: 'vault'
           }
         }).then((dropinInstance) => {
           button.addEventListener('click', () => {
             dropinInstance.requestPaymentMethod()
               .then((payload) => {
                 // Send the payment method nonce to the React Native app
                 window.ReactNativeWebView.postMessage(JSON.stringify(payload));
               })
               .catch((error) => {
                 console.error(error);
                 window.ReactNativeWebView.postMessage(JSON.stringify({ error: error.message }));
               });
           });
         }).catch((error) => {
           console.error(error);
           window.ReactNativeWebView.postMessage(JSON.stringify({ error: error.message }));
         });
       </script>
     </body>
     </html>
   `;
   ```

4. The handleWebViewMessage function is already implemented and will use the useCreatePaymentMethod hook to save the payment method.

### 4. Update the Payment Processing Flow

For the `/payments/process` flow:

1. Uncomment the actual API call to process the payment
2. Remove the simulated API call code
3. Create a useProcessPayment hook in hooks/payments/ similar to the existing hooks

### 5. How to Use the Payment Routes

To initiate a payment, navigate to one of the dynamic routes:

```javascript
// To add a new payment method:
router.push('/payments/add');

// To process a payment:
router.push({
  pathname: '/payments/process',
  params: {
    itemId: '123',
    itemType: 'class',  // or 'membership'
    amount: '25.00'
  }
});
```

### 6. Test the Integration

1. **Test in Sandbox Mode** - Always test using Braintree's sandbox environment first
2. **Use Test Cards** - Braintree provides test cards for different scenarios:
   - `4111 1111 1111 1111` - Successful transaction
   - `4000 1111 1111 1111` - Failed transaction

## Security Considerations

1. **Never** store Braintree credentials on the client
2. Always generate client tokens on the server
3. All payment processing should happen on the server
4. Validate all payment data on the server
5. Use HTTPS for all API calls

## Resources

- [Braintree Web SDK Documentation](https://braintree.github.io/braintree-web/)
- [Drop-in UI Documentation](https://braintree.github.io/braintree-web-drop-in/)
- [React Native WebView Documentation](https://github.com/react-native-webview/react-native-webview)