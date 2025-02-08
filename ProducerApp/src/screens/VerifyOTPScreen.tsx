import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { verifyOTP } from '../api/api.ts';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../navigation/types'; // Define the Stack types

type VerifyOTPScreenProps = {
  route: RouteProp<StackParamList, 'VerifyOTP'>;
  navigation: any;
};

const VerifyOTPScreen: React.FC<VerifyOTPScreenProps> = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOTP] = useState('');

  const handleVerify = async () => {
    try {
      await verifyOTP(email, otp);
      Alert.alert("Success", "OTP Verified!");
      navigation.navigate("TokenGenerator"); // Redirect after success
    } catch (error) {
      Alert.alert("Error", "Invalid OTP!");
    }
  };

  return (
    <View>
      <TextInput placeholder="Enter OTP" value={otp} onChangeText={setOTP} />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
};

export default VerifyOTPScreen;
