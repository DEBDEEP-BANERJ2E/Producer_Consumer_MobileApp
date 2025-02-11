import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import consumerAPI from '../api/ConsumerAPI';

const TokenDashboard = ({ onLogout }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  const fetchUsername = async () => {
    const storedName = await AsyncStorage.getItem('username');
    if (storedName) setUsername(storedName);
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const fetchedTokens = await consumerAPI.getTokens();
      setTokens(fetchedTokens);
    } catch (error) {
      Alert.alert('Error', error.message);
      if (error.message === 'Session expired. Please login again.') {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchUsername();
    fetchTokens();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {username || 'User'} 👋</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Button title="Refresh Tokens" onPress={fetchTokens} />

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
      ) : tokens.length === 0 ? (
        <Text style={styles.emptyMessage}>No tokens available</Text>
      ) : (
        <FlatList
          data={tokens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.tokenCard}>
              <Text style={styles.tokenText}>Token ID: {item.id}</Text>
              <Text>Token: {item.token}</Text>
              <Text>Latitude: {item.latitude}</Text>
              <Text>Longitude: {item.longitude}</Text>
              <Text>Created At: {new Date(item.created_at).toLocaleString()}</Text>
              <Text>Status: {item.consumed ? 'Used' : 'Available'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  tokenCard: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tokenText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});

export default TokenDashboard;
