import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import TokenGenerator from './src/screens/TokenGenerator.tsx';
import './src/services/TokenService.ts';
import './src/api/producerAPI.ts';

type SectionProps = PropsWithChildren<{ title: string }>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.sectionContainer, { backgroundColor: isDarkMode ? '#222' : '#fff' }]}>
      <Text
        style={[styles.sectionTitle, { color: isDarkMode ? '#EAEAEA' : '#333' }]}
      >
        {title}
      </Text>
      <Text
        style={[styles.sectionDescription, { color: isDarkMode ? '#BBB' : '#666' }]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F8F9FA' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1E1E1E' : '#F8F9FA'}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>🚀 Producer App</Text>
        </View>
        <Section title="Token Generation">
          Manage and generate tokens seamlessly with the integrated Token Service.
        </Section>
        <View style={styles.tokenContainer}>
          <TokenGenerator />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#6200EE',
    borderRadius: 12,
    marginVertical: 16,
    elevation: 4, // Adds shadow effect (Android)
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionContainer: {
    marginVertical: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  tokenContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
});

export default App;
