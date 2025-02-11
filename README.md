# Token Management System

A React Native application for managing location-based tokens with OTP authentication. Contains separate consumer and producer interfaces.

## Features

### Consumer App
- User registration/login with OTP (Email)
- Token dashboard showing available tokens
- Token details with location and status
- Session management
- Refresh functionality

### Producer App
- Location-based token generation
- Automatic token generation every 15 seconds
- Real-time location tracking
- Start/Stop generation controls
- Authentication and session management

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- Android Studio (for Android emulator)
- React Native CLI
- Physical device or emulator with location services enabled

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Additional dependencies**
   ```bash
   npm install @react-navigation/native @react-navigation/stack
   npm install @react-native-async-storage/async-storage
   npm install @react-native-community/geolocation
   ```

4. **Android setup**
   - Update `android/app/src/main/AndroidManifest.xml` with:
     ```xml
     <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
     ```

## Configuration

1. **API Configuration**
   - Update the `API_URL` in your API service files to point to your backend
   - Current configuration uses:
     ```javascript
     const API_URL = 'https://otp-backend-881m.onrender.com';
     ```

## Running the App

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **Run on Android (in a new terminal)**
   ```bash
   npm run android
   ```

3. **For production build**
   ```bash
   npx react-native run-android --variant=release
   ```

## Testing the App

### Consumer Flow
1. **Registration**
   - Select "Register" tab
   - Enter name and email
   - Verify OTP
   - View tokens in dashboard

2. **Login**
   - Use registered credentials
   - View existing tokens
   - Button to refresh tokens

### Producer Flow
1. **Login**
   - Use producer credentials (configured in backend)

2. **Token Generation**
   - Press "Start Generation"
   - Grant location permissions
   - Tokens will auto-generate every 15 seconds
   - View real-time location in status card

## Technologies Used

- React Native
- Axios (HTTP client)
- AsyncStorage (local storage)
- React Navigation (v5)
- React Native Geolocation (location services)
- OTP-based authentication


## Important Commands

| Command                | Description                     |
|------------------------|---------------------------------|
| `npm start`            | Start Metro bundler            |
| `npm run android`      | Run on Android device/emulator |
| `npm test`             | Run tests                      |
| `npm run lint`         | Run ESLint                     |
| `npm run types-check`  | Check TypeScript types         |