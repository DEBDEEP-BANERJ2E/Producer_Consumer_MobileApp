/* ConsumerApp/src/screens/DisplayTokens.tsx */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import consumerAPI from '../api/consumerAPI.ts';

type Token = {
  id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
};

const DisplayTokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const newTokens = await consumerAPI.fetchTokens();
      setTokens(newTokens);
    };
    fetchTokens();
    const intervalId = setInterval(fetchTokens, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View>
      <Text>Tokens:</Text>
      <FlatList
        data={tokens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{JSON.stringify(item)}</Text>
        )}
      />
    </View>
  );
};

export default DisplayTokens;