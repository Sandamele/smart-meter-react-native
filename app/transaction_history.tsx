import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import useAuthStore from "@/store/store";
import Loader from "./components/ui/Loader";
type TransactionHistory = {
  units: number;
  id: string;
  token: string;
  cost: string;
  createdAt: string;
};
export default function transaction_history() {
  const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const localParams = useLocalSearchParams();
  const { id } = localParams;
  const {authToken} = useAuthStore()
  const [transactionHistories, setTransactionHistories] = useState<TransactionHistory []>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getTransactionHistories = async () => {
      setLoading(true);
      await axios.get(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/transaction-histories?beneficiaryId=${id}`,
        {headers: {"Authorization":`Bearer ${authToken}`}})
        .then((data) => {
          setTransactionHistories(data.data.data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false)
          console.log(error);
        })
    }

    getTransactionHistories();
  },[id])
  const transactionHistoryDate= (date: string) => {
    const convertDate = new Date(date);
    return `${MONTH[convertDate.getMonth()]} ${convertDate.getDate() > 9 ? convertDate.getDate() : "0" + convertDate.getDate()}, ${convertDate.getFullYear()}`
  }
  return (
    <View style={styles.container}>
      {transactionHistories.length > 0 ? <ScrollView>
        {transactionHistories.length > 0 && transactionHistories.map((transactionHistory) => (
          <View style={styles.card} key={transactionHistory.id}>
          <View style={styles.tokenContainer}>
            <Text style={styles.token}>Token: {transactionHistory.token}</Text>
          </View>
          <View style={styles.grid}>
            <Text>R {transactionHistory.cost} (<MaterialIcons name="electric-bolt" size={12} color="gold" /> {Math.ceil(transactionHistory.units)} KWh)</Text>
            <Text>{transactionHistoryDate(transactionHistory.createdAt)}</Text>
          </View>
        </View>
        ))}
      </ScrollView> : 
      <View style={styles.noResults}>
      <MaterialIcons
        name="account-balance"
        size={125}
        color="#F87315"
      />
      <Text style={{ fontSize: 25 }}>No Transaction History</Text>
    </View>
      }
      <Loader visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card:{
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "rgba(50, 50, 93, 0.25)",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    padding: 20,
    marginBottom: 20,
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  money: {
    fontSize: 16,
    color: "#6A7280",
  },
  tokenContainer: {
    backgroundColor: "#FFF2E0",
    padding: 5,
    borderRadius: 8,
    marginBottom: 10
  },
  token: {
    color: "#F87315",
    fontSize: 16,
    textAlign: "center"
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
