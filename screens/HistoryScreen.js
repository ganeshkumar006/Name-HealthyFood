import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [data, setData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('mealsByDate');
      if (saved) setData(JSON.parse(saved));
    };
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Meal History</Text>
      {Object.entries(data).reverse().map(([date, meals]) => (
        <View key={date} style={styles.dayBlock}>
          <Text style={styles.date}>{date}</Text>
          {meals.map((meal, index) => (
            <Text key={index} style={styles.meal}>
              • {meal.name} - {meal.calories} cal
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  dayBlock: { marginBottom: 15 },
  date: { fontSize: 18, fontWeight: 'bold', color: 'green' },
  meal: { fontSize: 16, marginLeft: 10, color: '#444' },
});
