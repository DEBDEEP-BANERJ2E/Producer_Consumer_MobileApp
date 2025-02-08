import axios from 'axios';

const API_URL = 'http://10.0.2.2:5001/api/consumer'; // Adjust for emulator

const consumerAPI = {
  getTokens: async () => {
    try {
      const response = await axios.get(`${API_URL}/getTokens`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  },
};

export default consumerAPI;
