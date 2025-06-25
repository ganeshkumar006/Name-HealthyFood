import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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
  const [mealsToday, setMealsToday] = useState([]);

  useEffect(() => {
    loadMeals();
  }, []);

  useEffect(() => {
    const filtered = foodData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  const loadMeals = async () => {
    const today = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem('mealsByDate');
    const data = saved ? JSON.parse(saved) : {};
    setMealsToday(data[today] || []);
  };

  const addMeal = async (meal) => {
    const today = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem('mealsByDate');
    const data = saved ? JSON.parse(saved) : {};
    if (!data[today]) data[today] = [];
    data[today].push(meal);
    await AsyncStorage.setItem('mealsByDate', JSON.stringify(data));
    setMealsToday(data[today]);
    Alert.alert('✅ Added', `${meal.name} added to today's meals`);
  };

  const deleteMeal = async (meal) => {
    const today = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem('mealsByDate');
    const data = saved ? JSON.parse(saved) : {};
    const meals = data[today] || [];

    // Find exact match index
    const indexToRemove = meals.findIndex(
      (m) =>
        m.name === meal.name &&
        m.calories === meal.calories &&
        m.protein === meal.protein &&
        m.carbs === meal.carbs &&
        m.fat === meal.fat
    );

    if (indexToRemove !== -1) {
      meals.splice(indexToRemove, 1);
      data[today] = meals;
      await AsyncStorage.setItem('mealsByDate', JSON.stringify(data));
      setMealsToday(meals);
      Alert.alert('❌ Deleted', `${meal.name} removed from today's meals`);
    } else {
      Alert.alert('⚠️ Not Found', 'Meal not found for deletion');
    }
  };

  const isMealAlreadyAdded = (meal) =>
    mealsToday.some(
      (m) =>
        m.name === meal.name &&
        m.calories === meal.calories &&
        m.protein === meal.protein &&
        m.carbs === meal.carbs &&
        m.fat === meal.fat
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Food 🍎</Text>
      <TextInput
        placeholder="Type food name..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const alreadyAdded = isMealAlreadyAdded(item);
          return (
            <View style={styles.result}>
              <View>
                <Text style={styles.food}>{item.name}</Text>
                <Text style={styles.nutrition}>
                  {item.calories} cal | P: {item.protein} | C: {item.carbs} | F: {item.fat}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  alreadyAdded
                    ? Alert.alert('Delete?', item.name, [
                        { text: 'Cancel' },
                        {
                          text: 'Delete',
                          onPress: () => deleteMeal(item),
                          style: 'destructive',
                        },
                      ])
                    : addMeal(item)
                }
                style={styles.actionButton}
              >
                <Text style={alreadyAdded ? styles.deleteText : styles.addText}>
                  {alreadyAdded ? '❌' : '➕'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  food: { fontSize: 18, fontWeight: 'bold' },
  nutrition: { fontSize: 14, color: '#555' },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addText: {
    fontSize: 20,
    color: 'green',
  },
  deleteText: {
    fontSize: 20,
    color: 'red',
  },
});

