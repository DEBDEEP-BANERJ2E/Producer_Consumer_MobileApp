/* ProducerApp/src/screens/TokenGenerator.tsx */
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import producerAPI from '../api/producerAPI.ts';

type Token = {
  timestamp: string;
  latitude: number;
  longitude: number;
};

const TokenGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentToken, setCurrentToken] = useState<Token | null>(null);
  let intervalId: NodeJS.Timeout;

  const generateToken = async () => {
    const token: Token = {
      timestamp: new Date().toISOString(),
      latitude: 28.543680,
      longitude: 77.198692,
    };
    setCurrentToken(token);
    await producerAPI.storeToken(token);
  };

  const startGenerating = () => {
    setIsGenerating(true);
    generateToken();
    intervalId = setInterval(generateToken, 15000);
  };

  const stopGenerating = () => {
    setIsGenerating(false);
    clearInterval(intervalId);
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View>
      <Button title="Start" onPress={startGenerating} disabled={isGenerating} />
      <Button title="Stop" onPress={stopGenerating} disabled={!isGenerating} />
      <Text>Current Token: {JSON.stringify(currentToken)}</Text>
    </View>
  );
};

export default TokenGenerator;
