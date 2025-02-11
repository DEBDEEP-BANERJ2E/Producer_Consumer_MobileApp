import consumerAPI from "../api/ConsumerAPI";
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenReceiver {
  static async getTokens() {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) throw new Error("User is not authenticated");

      const response = await consumerAPI.getTokens();
      
      if (!response.success || !Array.isArray(response.tokens)) {
        throw new Error('Invalid response format');
      }
      
      return response.tokens;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      if (error.message === 'Session expired. Please login again.') {
        await TokenReceiver.logout(); // Logout user
      }
      return [];
    }
  }
  static async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

export default TokenReceiver;