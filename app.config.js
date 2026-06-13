import { ExpoConfig } from 'expo/config';

/** @type {ExpoConfig} */
const config = {
  name: 'LifePath',
  slug: 'lifepath',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'lifepath',
  userInterfaceStyle: 'dark',
  splash: {
    backgroundColor: '#0A0A0F',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.lifepath.app',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0A0A0F',
    },
    package: 'com.lifepath.app',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0A0A0F',
      },
    ],
  ],
  experiments: {
    typedRoutes: false,
  },
};

export default config;
