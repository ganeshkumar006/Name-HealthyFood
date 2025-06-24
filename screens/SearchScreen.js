import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import foodData from '../assets/foods.json';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = () => {
    const filtered = foodData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const addMeal = async (meal) => {
    const today = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem('mealsByDate');
    const data = saved ? JSON.parse(saved) : {};

    if (!data[today]) data[today] = [];
    data[today].push(meal);

    await AsyncStorage.setItem('mealsByDate', JSON.stringify(data));
    Alert.alert('✅ Added', `${meal.name} added to today's meals`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Food 🍎</Text>
      <TextInput
        placeholder="Type food name..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={search} />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.result}
            onPress={() => addMeal(item)}
          >
            <Text style={styles.food}>{item.name}</Text>
            <Text style={styles.nutrition}>
              {item.calories} cal | P: {item.protein} | C: {item.carbs} | F: {item.fat}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  result: {
    backgroundColor: '#e7f0fe',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  food: { fontSize: 18, fontWeight: 'bold' },
  nutrition: { fontSize: 14, color: '#555' },
});
