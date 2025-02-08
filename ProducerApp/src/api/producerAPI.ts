/* ProducerApp/src/api/producerAPI.ts */
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5001/api/producer';

const producerAPI = {
  storeToken: async (token: { timestamp: string; latitude: number; longitude: number }) => {
    try {
      await axios.post(`${API_URL}/storeToken`, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }
};

export default producerAPI;