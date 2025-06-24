import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';

export default function MealsScreen() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    const today = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem('mealsByDate');
    if (saved) {
      const data = JSON.parse(saved);
      setMeals(data[today] || []);
    }
  };

  const removeMeal = async (index) => {
    const today = new Date().toISOString().split('T')[0];
    const saved = await AsyncStorage.getItem('mealsByDate');
    const data = saved ? JSON.parse(saved) : {};
    data[today] = (data[today] || []).filter((_, i) => i !== index);
    await AsyncStorage.setItem('mealsByDate', JSON.stringify(data));
    setMeals(data[today]);
  };

  const getTotal = (field) =>
    meals.reduce((sum, item) => sum + (item[field] || 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Meals 🍽️</Text>

      <FlatList
        data={meals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            onLongPress={() =>
              Alert.alert('Delete?', item.name, [
                { text: 'Cancel' },
                { text: 'Delete', onPress: () => removeMeal(index) },
              ])
            }
          >
            <Text style={styles.food}>{item.name}</Text>
            <Text style={styles.nutrition}>
              {item.calories} cal | P: {item.protein} | C: {item.carbs} | F: {item.fat}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.totals}>
        <Text>Total Calories: {getTotal('calories')}</Text>
        <Text>Protein: {getTotal('protein')}g</Text>
        <Text>Carbs: {getTotal('carbs')}g</Text>
        <Text>Fat: {getTotal('fat')}g</Text>
      </View>

      <BarChart
        data={{
          labels: ['Cal', 'Protein', 'Carbs', 'Fat'],
          datasets: [
            {
              data: [
                getTotal('calories'),
                getTotal('protein'),
                getTotal('carbs'),
                getTotal('fat'),
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#f0fdf4',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
          labelColor: () => '#333',
          style: { borderRadius: 16 },
        }}
        style={{ marginTop: 20, borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: {
    backgroundColor: '#e0f7e9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  food: { fontSize: 18, fontWeight: 'bold' },
  nutrition: { fontSize: 14, color: '#555' },
  totals: { marginTop: 20 },
});
