# Release Workflow Guide for Dabbler Mobile

This document outlines the optimized build and release process for the Dabbler mobile application.

## Build Profiles

Dabbler uses three distinct build profiles in EAS:

### 1. Development Profile
- **Purpose**: Local development and testing of native modules
- **Features**:
  - Development client enabled for Expo Go integration
  - Internal distribution for team testing
  - Uses APK format for easy installation on Android
  - Connected to "development" updates channel

### 2. Preview Profile  
- **Purpose**: Internal testing before production release
- **Features**:
  - Internal distribution for QA testing
  - App bundles for Android (production-like)
  - Connected to "preview" updates channel
  - Uses the development API endpoint

### 3. Production Profile
- **Purpose**: App Store/Play Store releases for end users
- **Features**:
  - Auto-increments build numbers
  - Optimized production builds
  - Connected to "production" updates channel
  - Uses the production API endpoint

## EAS Update Channels

The app uses Expo's OTA update system with three channels:

- **development**: For developers during active development
- **preview**: For internal testing and QA
- **production**: For live user updates

These channels ensure updates are only delivered to the appropriate audience.

## Version Management

- App version is tracked in `app.json` as `expo.version`
- Build numbers are tracked as:
  - iOS: `expo.ios.buildNumber`
  - Android: `expo.android.versionCode`
- Runtime version follows the `appVersion` policy, ensuring OTA updates are compatible

## CI/CD Pipeline

Our GitLab CI/CD pipeline automates various aspects of the build process:

1. **Testing Stage**:
   - Linting checks
   - TypeScript type checking

2. **Build Stage**:
   - Asset optimization before builds
   - Android and iOS build creation
   - Artifacts saved for deployment

3. **Deploy Stage**:
   - EAS Update publishing to preview or production
   - App submission to stores (manual trigger)

## Release Checklist

Before releasing a new version:

1. **Pre-release**:
   - Run `npm run prepare-release` to verify code quality and optimize assets
   - Update version numbers in app.json if needed
   - Test all critical flows on both platforms

2. **Testing Release**:
   - Build preview version: `npm run build:android:preview` and `npm run build:ios:preview`
   - Distribute to internal testers
   - Verify all features with QA team

3. **Production Release**:
   - Build production version: `npm run build:android:prod` and `npm run build:ios:prod`
   - Submit to stores: `npm run submit:android` and `npm run submit:ios`
   - Monitor analytics and crash reports after release

4. **Post-release**:
   - For bug fixes, use EAS Update: `npm run update:production`
   - For major updates, create new app builds with incremented version

## Asset Optimization

Before builds, assets are optimized to reduce app size:

- Run `npm run optimize` to compress images and assets
- This process is automated in the CI/CD pipeline
- Results in faster downloads and updates for users

## Monitoring and Logging

Production builds include error tracking to quickly identify issues:

- Sentry integration for real-time error reporting
- Analytics to track user engagement
- Console logs are stripped in production

## Common Commands

```bash
# Development builds
npm run build:android:dev
npm run build:ios:dev

# Preview builds for testing
npm run build:android:preview
npm run build:ios:preview

# Production builds
npm run build:android:prod
npm run build:ios:prod

# OTA Updates
npm run update:preview     # Update preview channel
npm run update:production  # Update production channel

# App submission
npm run submit:android
npm run submit:ios

# Pre-release preparation
npm run prepare-release    # Runs lint, typecheck, and optimize
``` 