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
