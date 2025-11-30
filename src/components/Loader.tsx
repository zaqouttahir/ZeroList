import { ActivityIndicator } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function Loader() {
  return (
    <LinearGradient
      colors={['#191E3B', '#191E3B']}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size={50} color="#ef3345" />
    </LinearGradient>
  );
}
