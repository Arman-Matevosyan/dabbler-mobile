# Project Structure Guide

This document outlines the structure of the Dabbler Mobile app, explaining key directories and the organization of code.

## Core Directories

- **app/** - All Expo Router screens and layouts
  - **/(auth)/** - Authentication screens (login, signup, etc.)
  - **/(tabs)/** - Main tab navigation screens
  - **/(features)/** - Feature-specific screens
  
- **api/** - API client setup
  - **axiosClient.ts** - Main axios instance with interceptors
  - **errorInterceptor.ts** - Global error handling

- **components/** - Reusable UI components
  - **/auth/** - Authentication-specific components 
  - **/ui/** - Generic UI components

- **constants/** - App constants
  - **Colors.ts** - Theme colors
  - **QueryKeys.ts** - React Query keys

- **contexts/** - React Context definitions (consider migrating to Zustand)

- **hooks/** - Custom React hooks
  - **/auth/** - Authentication hooks
  - **/tooltip/** - Tooltip-related hooks

- **providers/** - React Context Providers
  - **ThemeContext.tsx** - Theme provider
  - **QueryProvider.tsx** - TanStack Query provider
  - **NetworkProvider.tsx** - Network status provider

- **services/** - Business logic and API services
  - **/api/** - API service modules by domain
  - **/query/** - TanStack Query setup

- **store/** - Zustand stores
  - **authStore.ts** - Authentication state with persistence
  - **useSearchStore.ts** - Search functionality state

- **styles/** - Global styles and theme definitions

- **types/** - TypeScript type definitions

- **utils/** - Utility functions

## Authentication Flow

The app uses a token-based authentication flow:

1. User authenticates via login/signup/social
2. Tokens (access + refresh) are stored in SecureStore via the Zustand auth store
3. Axios interceptors attach tokens to requests and handle refresh when needed
4. Protected routes are guarded by the auth state in router layouts

## State Management

- **Zustand** is used for global state management
- **TanStack Query** is used for server state and data fetching
- **React Context** is used for UI state like theme

## Network Handling

- **NetworkProvider** detects and displays connection status
- **TanStack Query** settings optimize for mobile network conditions
- **Axios interceptors** handle token refresh and retry logic

## Recommendations

1. Use the Zustand auth store instead of direct SecureStore access
2. Use TanStack Query for all API calls to leverage caching
3. Follow the established folder structure for new features
4. Check authentication in appropriate layouts for protected routes 