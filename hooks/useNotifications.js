/* global alert */
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export default function useNotifications() {
  useEffect(() => {
    const setup = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        alert('⚠️ Notification permission not granted');
        return;
      }

      // Cancel any existing notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a daily reminder at 8:00 PM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🍽️ Healthy Food Reminder',
          body: 'Don’t forget to log your meals today!',
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    };

    setup();
  }, []);
}

