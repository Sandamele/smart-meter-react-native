import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const Index = () => {
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const appIsReady = async () => {
        await axios.get(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}`)
          .then((data) => {
            if (data.data.serverRunning) {
              setTimeout(() => {
                router.navigate("/login");
              }, 2000);
            }
          });
      };
      appIsReady();
    }, [])
  );

  return (
    <View style={styles.container}>
      <MaterialIcons name="electric-bolt" size={150} color="gold" />
      <Text style={styles.logo}>Smart Power Pay</Text>
      <ActivityIndicator size={60} color="white" />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F87315",
  },
  logo: {
    color: "white",
    fontSize: 35,
    marginTop: 20,
    marginBottom: 20,
  },
});
