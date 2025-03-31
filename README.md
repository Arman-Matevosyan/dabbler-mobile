# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Dabbler Mobile App

## Skeleton Loading Screens

The app now includes skeleton loading screens to improve user experience during data loading. These screens show animated placeholders that mimic the content's layout before it loads.

### Components:

1. **ProfileSkeleton**: A skeleton loader specifically for the profile screen that matches its layout.
2. **SkeletonScreen**: A wrapper component that provides consistent styling for all skeleton loaders.

### Implementation:

- The skeleton loaders use shimmer effects with `expo-linear-gradient` to indicate loading states.
- They automatically adapt to light/dark mode using the app's theme system.
- The implementation is optimized for performance with React Native's Animated API.

### Usage:

```tsx
// To use the ProfileSkeleton
import ProfileSkeleton from '@/components/ui/skeletons/ProfileSkeleton';
import SkeletonScreen from '@/components/ui/SkeletonScreen';

// In your component
if (isLoading) {
  return (
    <SkeletonScreen>
      <ProfileSkeleton />
    </SkeletonScreen>
  );
}
```

## Installation

To install the necessary packages for the app:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using expo
npx expo install
```

# Dabbler Mobile Authentication Implementation

## Authentication Flow

The authentication system in Dabbler Mobile is built with a robust token-based approach:

### Core Components

1. **Token Management**
   - `SecureStore`: Used for secure storage of tokens on the device
   - `Zustand` store: Central state management for authentication
   - `Axios` interceptors: Handle token attaching and automatic refresh

2. **Social Authentication**
   - Support for Google and Facebook login
   - Handles deep linking with `Expo` for social auth callbacks
   - Supports multiple URL schemes: `dabbler://` and `dabler://`

3. **Token Refresh**
   - Automatic refresh when 401 errors are encountered
   - Request queueing to prevent multiple refresh calls
   - Automatic retry of failed requests

4. **React Query Integration**
   - Query invalidation after token refresh
   - Global error handling for auth failures

## Key Files

- `api/axiosClient.ts`: Axios instance with token refresh interceptors
- `store/authStore.ts`: Zustand store for auth state management
- `services/auth/socialAuth.ts`: Social auth flow helpers
- `providers/AuthProvider.tsx`: React context for auth state and deep link handling
- `services/query/queryClient.ts`: React Query configuration

## Authentication Flow

1. **Login Flow**:
   - User logs in with email/password or social provider
   - Access token and refresh token are stored in SecureStore
   - User is redirected to authenticated area

2. **API Request Flow**:
   - Axios interceptor attaches token to all requests
   - On 401 error, refresh token is used to get new access token
   - Original request is retried with the new token

3. **Social Auth Flow**:
   - Social login redirects to browser for authentication
   - After auth, browser redirects back to app with tokens
   - App processes tokens and updates auth state

4. **Token Refresh Flow**:
   - When access token expires, server returns 401
   - Axios interceptor catches 401 and tries to refresh token
   - If refresh succeeds, request is retried with new token
   - If refresh fails, user is logged out

## Security Features

- Tokens stored in SecureStore (encrypted storage)
- No tokens in app state (only in secure storage)
- Automatic logout on refresh token expiry
- Request queueing to prevent duplicate refresh calls

## Customization

To add new authentication providers or methods:
1. Add provider details to AuthAPI in `services/api.ts`
2. Update the handleSocialLogin method in `store/authStore.ts`
3. Configure proper URL handling in app.json
