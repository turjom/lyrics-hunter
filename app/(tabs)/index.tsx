import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, StyleSheet, Alert, Linking, } from 'react-native';


export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
type SongResult = {
  title: string;
  artist: string;
};
  const searchLyrics = async () => {
    if (query.trim().split(/\s+/).length < 6) {
      Alert.alert('Validation Error', 'Please enter at least 6 consecutive words.');
      return;
    }

    

    setLoading(true);
    setError('');
    setResults([]);
  

    try {
    const res = await fetch(`https://api.audd.io/findLyrics/?q=${encodeURIComponent(query)}&api_token=702abd6d70b4fef156c4da3cc0baa561`
      );
    const data = await res.json();
    console.log("Full API response:", data);

      if (data.error) {
        setError(data.error.error_message || 'API error');
      } else { setResults(data.result || []);
    } 
  } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
    setLoading(false);}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Lyric Finder</Text>
      <TextInput
        placeholder="Enter at least 6 words from a song lyric"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <Button title="SEARCH" onPress={searchLyrics} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
    <FlatList<SongResult>
        data={results}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.result}>
            <Text style={styles.song}>{item.title}</Text>
            <Text style={styles.artist}>{item.artist}</Text>
        </View>
        )}
    />
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff', // ✅ Light background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000', // ✅ Visible text
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#f9f9f9', // ✅ Light input box
  },
  error: {
    color: 'red',
    marginVertical: 10,
    fontSize: 14,
  },
  result: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0', // ✅ Light background for list items
  },
  song: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000000', // ✅ Visible title
  },
  artist: {
    fontSize: 14,
    color: '#555555', // ✅ Softer secondary text
    marginTop: 4,
  }
});