import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import React, { useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/store";
type Props = {};

const Dashboard = (props: Props) => {
  const router = useRouter();
  const {authToken, logout, username} = useAuthStore();
  useEffect(()=> {
    if (authToken === null) router.push("/login");
  },[authToken])
  const handleLogout = () => {
    logout();
    router.push("/login");
  }
  return (
    <View style={styles.container}>
      <View style={styles.account}>
        <Text style={styles.username}>Hi {username}</Text>
        <MaterialCommunityIcons name="account" size={24} color="white" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <TouchableHighlight style={styles.blockContainer} underlayColor="#FFE0B2" onPress={() =>router.push("/my_profile") }>
        <View style={styles.block}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="account-circle"
              size={55}
              color="#F87315"
            />
          </View>
          <View style={styles.blockHeader}>
            <Text style={styles.header}>My Profile</Text>
            <Text style={styles.subHeader}>View and edit your profile</Text>
          </View>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.blockContainer} onPress={() =>router.push("/beneficiary") }>
        <View style={styles.block}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={55}
              color="#F87315"
            />
          </View>
          <View style={styles.blockHeader}>
            <Text style={styles.header}>Beneficiary</Text>
            <Text style={styles.subHeader}>Manage your beneficiaries</Text>
          </View>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.blockContainer} onPress={handleLogout}>
        <View style={styles.block}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="logout"
              size={55}
              color="#F87315"
            />
          </View>
          <View style={styles.blockHeader}>
            <Text style={styles.header}>Logout</Text>
            <Text style={styles.subHeader}>Sign out of your account</Text>
          </View>
        </View>
      </TouchableHighlight>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF2E0",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  account: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FF7043",
  },
  username: {
    color: "white",
    fontSize: 20,
  },
  blockContainer: {
    margin: 20,
  },
  block: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 10,
  },
  icon: {
    backgroundColor: "#FFEDD5",
    padding: 5,
    borderRadius: 10,
  },
  blockHeader: {
    marginLeft: 10,
    marginTop: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
    color: "#7C2D12",
  },
  subHeader: {
    color: "#EA580B",
    fontSize: 15,
    marginTop: 10,
  },
});
