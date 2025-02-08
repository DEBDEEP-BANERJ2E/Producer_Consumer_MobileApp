/* ConsumerApp/src/api/consumerAPI.ts */
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/consumer';

const consumerAPI = {
  fetchTokens: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_URL}/getTokens`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
    }
  }
};

export default consumerAPI;
