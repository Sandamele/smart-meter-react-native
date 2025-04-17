import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Input from "./components/ui/Input";
import Button from "./components/ui/Button";
import useAuthStore from "@/store/store";
import axios from "axios";
import { useRouter } from "expo-router";
import { Alert } from 'react-native';
import Loader from "./components/ui/Loader";

type Props = {};

const MyProfile = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationProfile, setValidationProfile] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
  })
  const [validationResetPassword, setValidationResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const {authToken} = useAuthStore();
  const [reload, setReload] = useState(false);
  if (authToken === null) router.push("/login");
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/auth/me`, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      setLoading(false)
      setFirstname(response.data.data.firstname === null ? "": response.data.data.firstname );
      setLastname(response.data.data.lastname === null ? "": response.data.data.lastname );
      setPhoneNumber(response.data.data.phoneNumber === null ? "": response.data.data.phoneNumber);
    }

    getProfile()
  },[reload])
  const handleUpdateProfile = async () => {
    const errors = {
      firstname: firstname ? "" : "Firstname required",
      lastname: lastname ? "" : "Lastname required",
      phoneNumber: 
        phoneNumber === "" 
          ? "Phone number required" 
          : phoneNumber.length !== 10 
          ? "Phone number must be 10 digits" 
          : ""
    };
    setValidationProfile(errors);
    if (Object.values(errors).some((error) => error !== "")) return;
    setLoading(true);
    const body = {firstname, lastname, phoneNumber}
      await axios.put(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/auth/update`,body, {
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${authToken}`}
      })
      .then((data) => {
        setLoading(false)
          Alert.alert('Profile', 'Profile updated');
      })
      .catch((error) => {
        setLoading(false)
        console.log(error.response.data)
      })
  }
  const handleResetPassword = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const errors = {
      currentPassword: currentPassword ? "" : "Required",
      newPassword: newPassword ? passwordRegex.test(newPassword)
      ? ""
      : "Password must be at least 6 characters, include a capital letter, a lowercase letter, and a number"
    : "Password is required",
      confirmPassword: confirmPassword === newPassword ? "" : "Password do not match",
    }
    setValidationResetPassword(errors);
    if (Object.values(errors).some((error) => error !== "")) return;
    setLoading(true);
    await axios.post(`${process.env.EXPO_PUBLIC_SMART_METER_BACKEND}/api/v1/auth/reset-password`,{
      currentPassword, newPassword
    }, {headers: {"Authorization" :`Bearer ${authToken}`}})
    .then(() => {
      setLoading(false)
      Alert.alert('Reset Password', 'Password Changed');
      setConfirmPassword("");
      setCurrentPassword("");
      setNewPassword("");
      setErrorMessage("");
    })
    .catch((error) => {
      setLoading(false)
      setErrorMessage(error.response.data.error.message)
    })
  }
  return (
    <ScrollView style={styles.container}>

      <View style={styles.box}>
        <Text style={styles.header}>Profile Detials</Text>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Input
            text={firstname}
            setText={setFirstname}
            placeholder={"First Name"}
          />
           {!!validationProfile.firstname && (
          <Text style={styles.error}>{validationProfile.firstname}</Text>
        )}
        </View>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Input
            text={lastname}
            setText={setLastname}
            placeholder={"Last Name"}
          />
          {!!validationProfile.lastname && (
          <Text style={styles.error}>{validationProfile.lastname}</Text>
        )}
        </View>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Input
            text={phoneNumber}
            setText={setPhoneNumber}
            placeholder={"Phone Number"}
          />
          {!!validationProfile.phoneNumber && (
          <Text style={styles.error}>{validationProfile.phoneNumber}</Text>
        )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleUpdateProfile}/>
        </View>
      </View>
      {/* Reset Password */}
      <View style={styles.box}>
        <Text style={styles.header}>Reset Password</Text>
        {!!errorMessage && (
          <Text style={styles.error}>{errorMessage}</Text>)}
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Input
            text={currentPassword}
            setText={setCurrentPassword}
            placeholder="Current Password"
            isPassword={true}
          />
          {!!validationResetPassword.currentPassword && (
          <Text style={styles.error}>{validationResetPassword.currentPassword}</Text>)}
        </View>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Input
            text={newPassword}
            setText={setNewPassword}
            placeholder="New Password"
            isPassword={true}
          />
          {!!validationResetPassword.newPassword && (
          <Text style={styles.error}>{validationResetPassword.newPassword}</Text>)}
        </View>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <Input
            text={confirmPassword}
            setText={setConfirmPassword}
            placeholder="Confirm Password"
            isPassword={true}
          />
          {!!validationResetPassword.confirmPassword && (
          <Text style={styles.error}>{validationResetPassword.confirmPassword}</Text>)}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Reset" onPress={handleResetPassword}/>
        </View>
      </View>
      <Loader visible={loading} />
    </ScrollView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF2E0",
    flex: 1,
    padding: 20,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  box: {
    backgroundColor: "#FFF",
    marginBottom: 35,
    padding: 20,
    borderRadius: 10
  },
  header: {
    fontSize: 25,
    marginBottom: 10,
    textAlign: "center",
    color: "#7C2D12",
    fontWeight: 500
  },
  error: {
    color: "red",
    marginLeft: 10,
    fontSize: 14,
  },
});
