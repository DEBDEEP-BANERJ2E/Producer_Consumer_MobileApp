import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

const API_URL = 'https://otp-backend-881m.onrender.com';
const TOKEN_INTERVAL = 15000; // 15 seconds

interface TokenDashboardProps {
  onLogout: () => void;
}

const TokenDashboard: React.FC<TokenDashboardProps> = ({ onLogout }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization('whenInUse');
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to generate tokens.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };

  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          resolve(loc);
        },
        error => {
          console.error(error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const generateToken = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error('Authentication token not found');

      const currentLocation = await getCurrentLocation();
      
      const response = await axios.post(
        `${API_URL}/control-tokens`,
        {
          action: 'start', // Using 'start' action to generate a new token
          authToken,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to generate token');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        console.error('Token generation error:', error);
        // Don't show alert for periodic generation errors
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          setIsGenerating(false);
          Alert.alert('Error', 'Token generation stopped due to an error');
        }
      }
    }
  };

  const handleTokenGeneration = async (action: 'start' | 'stop') => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      if (action === 'start') {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          throw new Error('Location permission denied');
        }
        
        // Generate first token
        await generateToken();
        
        // Start interval for subsequent tokens
        setIsGenerating(true);
        intervalRef.current = setInterval(generateToken, TOKEN_INTERVAL);
        Alert.alert('Success', 'Token generation started');
      } else {
        // Stop token generation
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        const response = await axios.post(
          `${API_URL}/control-tokens`,
          { action, authToken },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          setIsGenerating(false);
          Alert.alert('Success', 'Token generation stopped');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        await handleLogout();
      } else {
        Alert.alert('Error', error.message || 'Failed to control token generation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (isGenerating) {
        await handleTokenGeneration('stop');
      }
      await AsyncStorage.removeItem('authToken');
      onLogout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  useEffect(() => {
    requestLocationPermission();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Token Generator</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Generator Status</Text>
          <Text style={[styles.statusText, isGenerating ? styles.active : styles.inactive]}>
            {isGenerating ? 'Active' : 'Inactive'}
          </Text>

          {location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.controlButton, isGenerating ? styles.stopButton : styles.startButton]}
          onPress={() => handleTokenGeneration(isGenerating ? 'stop' : 'start')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {isGenerating ? '■ Stop Generation' : '▶ Start Generation'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusTitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  active: {
    color: '#059669',
  },
  inactive: {
    color: '#dc2626',
  },
  locationContainer: {
    marginTop: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    gap: 12,
  },
  startButton: {
    backgroundColor: '#059669',
  },
  stopButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
});

export default TokenDashboard;
