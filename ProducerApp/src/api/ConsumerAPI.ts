import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://otp-backend-881m.onrender.com';

// Define response types
interface ApiResponse {
  success: boolean;
  message?: string;
}

interface CheckUserResponse extends ApiResponse {
  exists: boolean;
}

interface OtpVerificationResponse extends ApiResponse {
  authToken: string;
  isNewUser: boolean;
}

interface Token {
  id: number;
  created_at: string;
  latitude: number;
  longitude: number;
  consumed: boolean;
}

// Set up axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

const consumerAPI = {
  checkUser: async (contact: string): Promise<CheckUserResponse> => {
    try {
      const response = await api.post<CheckUserResponse>('/check-user', { contact });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to check user');
      }
      throw error;
    }
  },

  registerUser: async (name: string, contact: string, authToken: string): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/register', {
        name,
        contact,
        authToken,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
      throw error;
    }
  },

  sendOTP: async (contact: string, loginType: 'email' | 'phone'): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('/send-otp', {
        contact,
        loginType,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
      }
      throw error;
    }
  },

  verifyOTP: async (
    contact: string,
    otp: string,
    loginType: 'email' | 'phone'
  ): Promise<OtpVerificationResponse> => {
    try {
      const response = await api.post<OtpVerificationResponse>('/verify-otp', {
        contact,
        otp,
        loginType,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('authToken', response.data.authToken);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'OTP verification failed');
      }
      throw error;
    }
  },

  getTokens: async (): Promise<Token[]> => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const response = await api.get<{ success: boolean; tokens: Token[]; message?: string }>(
        '/get-tokens',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch tokens');
      }

      return response.data.tokens;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await AsyncStorage.removeItem('authToken');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch tokens');
      }
      throw error;
    }
  },
  // Utility method to check if user is logged in
  isLoggedIn: async (): Promise<boolean> => {
    const authToken = await AsyncStorage.getItem('authToken');
    return !!authToken;
  },

  // Utility method to logout
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
  },
};

export default consumerAPI;