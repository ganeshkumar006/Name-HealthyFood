import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ToastAndroid,
  Platform,
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
    const currentMeals = data[today] || [];

    const removedItem = currentMeals[index];
    data[today] = currentMeals.filter((_, i) => i !== index);
    await AsyncStorage.setItem('mealsByDate', JSON.stringify(data));
    setMeals(data[today]);

    if (Platform.OS === 'android' && removedItem) {
      ToastAndroid.show(`${removedItem.name} deleted`, ToastAndroid.SHORT);
    }
  };

  const getTotal = (field) =>
    meals.reduce((sum, item) => sum + (item[field] || 0), 0);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.food}>{item.name}</Text>
        <Text style={styles.nutrition}>
          {item.calories} cal | P: {item.protein} | C: {item.carbs} | F: {item.fat}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert('Delete?', item.name, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', onPress: () => removeMeal(index), style: 'destructive' },
          ])
        }
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>✖</Text>
      </TouchableOpacity>
    </View>
  );

  const chartData = [
    getTotal('calories'),
    getTotal('protein'),
    getTotal('carbs'),
    getTotal('fat'),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Meals 🍽️</Text>

      <FlatList
        data={meals}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
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
          datasets: [{ data: chartData }],
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  food: { fontSize: 18, fontWeight: 'bold' },
  nutrition: { fontSize: 14, color: '#555' },
  deleteButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 20,
    color: 'red',
  },
  totals: { marginTop: 20 },
});
