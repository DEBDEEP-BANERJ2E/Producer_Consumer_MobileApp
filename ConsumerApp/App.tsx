import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import consumerAPI from './src/api/ConsumerAPI.ts';
import DisplayTokens from './src/screens/DisplayTokens.tsx';

function App(): React.JSX.Element {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const userId = 12345; // Replace this with actual user ID if available

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await consumerAPI.getTokens();
      setTokens(response);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
      <View style={styles.header}>
        <Text style={styles.heading}>Consumer App</Text>
        <Text style={styles.userId}>User ID: {userId}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => { setShowHistory(true); fetchTokens(); }}>
        <Text style={styles.buttonText}>Show Token History</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />}

      {showHistory && <DisplayTokens tokens={tokens} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userId: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
});

export default App;
