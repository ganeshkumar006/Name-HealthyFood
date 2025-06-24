import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MealsScreen from './screens/MealsScreen';
import SearchScreen from './screens/SearchScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';
import { Ionicons } from '@expo/vector-icons';
// import useNotifications from './hooks/useNotifications'; // ❌ disable if using Expo Go
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // useNotifications(); // ❌ optional, skip in Expo Go

  useEffect(() => {
    const checkLogin = async () => {
      const skip = await AsyncStorage.getItem('skipLogin');
      if (skip === 'true') {
        setUser('guest');
        setChecking(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
        setChecking(false);
      });

      return unsubscribe;
    };

    checkLogin();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => setUser('logged')} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Meals') iconName = 'fast-food';
            else if (route.name === 'Search') iconName = 'search';
            else if (route.name === 'History') iconName = 'calendar';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Meals" component={MealsScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
