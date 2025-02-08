import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const DisplayTokens = ({ tokens }) => {
  if (!tokens.length) return <Text style={styles.noData}>No Token History Found</Text>;

  return (
    <ScrollView style={styles.wrapper}>
      <ScrollView horizontal>
        <View style={styles.container}>
          {/* Table Header */}
          <View style={styles.row}>
            <Text style={styles.headerCell}>ID</Text>
            <Text style={styles.headerCell}>Timestamp</Text>
            <Text style={styles.headerCell}>Latitude</Text>
            <Text style={styles.headerCell}>Longitude</Text>
            <Text style={styles.headerCell}>Displayed</Text>
          </View>

          {/* Table Rows */}
          {tokens.map((token, index) => (
            <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
              <Text style={styles.cell}>{token.id}</Text>
              <Text style={styles.cell}>{token.timestamp}</Text>
              <Text style={styles.cell}>{token.latitude}</Text>
              <Text style={styles.cell}>{token.longitude}</Text>
              <Text style={styles.cell}>{token.displayed}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // Enables vertical scrolling
  },
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    padding: 5,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    textAlign: 'center',
    padding: 5,
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  noData: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DisplayTokens;
