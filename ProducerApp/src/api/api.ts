import axios from 'axios';

const API_URL = 'http://10.0.2.2:5002/api/auth';

export const sendOTP = (email: string) => {
  return axios.post(`${API_URL}/send-otp`, { email });
};

export const verifyOTP = (email: string, otp: string) => {
  return axios.post(`${API_URL}/verify-otp`, { email, otp });
};
