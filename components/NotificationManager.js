import { Pressable, View, Text, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { format } from 'date-fns-tz';
import { themeBackgroundColor } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function NotificationManager({ selectedDate, trailName, isLiked, changedHandler, selectedTime }) {

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [timeDifference, setTimeDifference] = useState(0);

  const handlePressCalendar = async() => {
    setIsCalendarVisible((prevIsCalendarVisible) => {
      changedHandler(!prevIsCalendarVisible);
      return !prevIsCalendarVisible;
    });  
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give permission to send notification");
        return;
      }
      Notifications.scheduleNotificationAsync({
        content: {
          title: "visit notification",
          body: `Remember to visit ${trailName} today!`,
        },
        trigger: { seconds: timeDifference },
      });

    } catch (err) {
      console.log("schedule notification error ", err);
    }

  }

  const verifyPermission = async () => {
    const status = await Notifications.getPermissionsAsync();
    if (status.granted) {
      return true;
    }
    const response = await Notifications.requestPermissionsAsync({
      ios: { allowBadge: true },
    });
    return response.granted;
  };


  useEffect(() => {
    const calculateTimeDifference = () => {
      // Scheduled time
      const scheduledDateTime = new Date(selectedDate);

      // Calculate the time difference in milliseconds
      const differenceInMilliseconds = scheduledDateTime - selectedTime;

      // Convert the time difference to seconds
      const seconds = Math.floor(differenceInMilliseconds / 1000);
      //console.log(seconds);
      setTimeDifference(seconds);
    };

    // Call the function initially
    calculateTimeDifference();

    // Set up a timer to recalculate the time difference every second
    const timer = setInterval(calculateTimeDifference, 1000);

    // Clear the timer when the component is unmounted
    return () => clearInterval(timer);
  }, [selectedDate]);


  /** 
  const scheduleNotificationHandler = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give permission to send notification");
        return;
      }
      Notifications.scheduleNotificationAsync({
        content: {
          title: "visit notification",
          body: `Remember to visit ${trailName} today!`,
        },
        trigger: { seconds: timeDifference },
      });

    } catch (err) {
      console.log("schedule notification error ", err);
    }
  };
*/

  return (
    <View>
      {isLiked && 
          <Pressable onPress={handlePressCalendar}>
            {({ pressed }) => (
              <Icon
               name={'calendar'}
               size={25}
               color={pressed ? 'gray' : themeBackgroundColor}
               style={{marginLeft: 15, marginTop: 7}}
             />
            )}
          </Pressable>
        }
    </View>
  );
}
