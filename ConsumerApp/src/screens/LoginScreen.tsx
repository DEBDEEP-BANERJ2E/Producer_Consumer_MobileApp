import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import consumerAPI from '../api/ConsumerAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');

  const validateContact = (): boolean => {
    if (!contact.trim()) {
      Alert.alert('Error', 'Please enter your email or phone number');
      return false;
    }

    if (contact.includes('@')) {
      setLoginType('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return false;
      }
    } else {
      setLoginType('phone');
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(contact)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return false;
      }
    }
    return true;
  };

  const validateName = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (name.trim().length < 2) {
      Alert.alert('Error', 'Name must be at least 2 characters long');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateContact()) return;
    if (mode === 'register' && !validateName()) return;

    try {
      setLoading(true);
      
      // Check if user exists for registration
      if (mode === 'register') {
        const checkResponse = await consumerAPI.checkUser(contact);
        if (checkResponse.exists) {
          Alert.alert('Error', 'User already exists. Please login instead.');
          setMode('login');
          return;
        }
      }

      const response = await consumerAPI.sendOTP(contact, loginType);
      if (response.success) {
        setShowOtp(true);
        Alert.alert('Success', 'OTP sent successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await consumerAPI.verifyOTP(contact, otp, loginType);
      
      if (response.success) {
        if (mode === 'register') {
          // Complete registration immediately for new users
          const registrationResponse = await consumerAPI.registerUser(name, contact, response.authToken);
          if (registrationResponse.success) {
            onLogin();
          } else {
            throw new Error(registrationResponse.message || 'Registration failed');
          }
        } else {
          // For login mode
          if (response.isNewUser) {
            Alert.alert('Error', 'Account not found. Please register first.');
            resetForm();
            setMode('register');
          } else {
            onLogin();
          }
        }
      } else {
        Alert.alert('Error', response.message || 'Verification failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Verification failed');
      await AsyncStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowOtp(false);
    setOtp('');
    setContact('');
    setName('');
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Please wait...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, mode === 'login' && styles.activeTab]}
              onPress={() => switchMode('login')}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={mode === 'login' ? 'Login tab selected' : 'Switch to login tab'}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, mode === 'register' && styles.activeTab]}
              onPress={() => switchMode('register')}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={mode === 'register' ? 'Register tab selected' : 'Switch to register tab'}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.activeTabText]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>
          
          {mode === 'register' && !showOtp && (
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
              accessibilityLabel="Enter your full name"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#999"
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!showOtp && !loading}
            accessibilityLabel="Enter email"
          />

          {showOtp ? (
            <View style={styles.otpContainer}>
              <Text style={styles.otpText}>
                Enter the OTP sent to {contact}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
                accessibilityLabel="Enter OTP"
              />
              <TouchableOpacity 
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleVerifyOTP}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Verify OTP"
              >
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={handleSendOTP}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Resend OTP"
              >
                <Text style={styles.linkText}>Resend OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={resetForm}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Change contact"
              >
                <Text style={styles.linkText}>Change Contact</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSendOTP}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={mode === 'login' ? 'Login with OTP' : 'Register with OTP'}
            >
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'Login with OTP' : 'Register with OTP'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#6366f1',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  otpContainer: {
    alignItems: 'center',
  },
  otpText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default LoginScreen;