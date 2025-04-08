import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Input from "./components/ui/Input";
import { Link, useRouter } from "expo-router";
import Button from "./components/ui/Button";
import axios from "axios";
import useAuthStore from "../store/store";
import Loader from "./components/ui/Loader";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const {setAuthToken, setUsername} = useAuthStore();
  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {
      email: email
      ? emailRegex.test(email)
        ? ""
        : "Invalid email format"
      : "Email is required",
      password: password ? "" : "Password is required",
    };

    setValidation(errors);

    if (Object.values(errors).some((error) => error !== "")) return;
    setLoading(true);
      const body = {
        email: email.toLocaleLowerCase(),
        password,
      }
        await axios.post(`https://smart-meter-backend-y19r.onrender.com/api/v1/auth/login`, body, {headers: {"Content-Type": "application/json"}}).then((data) => {
          setAuthToken(data.data.data.token);
          setUsername(data.data.data.username);
          setLoading(false);
          router.push("/dashboard");
        })
        .catch(async (error) => {
          setLoading(false);
          if (error.response.data.error && error.response.data.error.length > 0) {
            setValidation((prev) => ({...prev,  [error.response.data.error[0].field] : error.response.data.error[0].message}))
          } else {
            setError(error.response.data.error.message);
            setTimeout(() => {
              setError("");
            }, 3000)
          }
        })

  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Login to continue</Text>
      <View style={{ width: "100%", marginBottom: 5 }}>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={{ width: "100%", marginBottom: 20 }}>
        <Input
          text={email}
          setText={setEmail}
          placeholder={"Email"}
          isPassword={false}
        />
        {!!validation.email && (
          <Text style={styles.error}>{validation.email}</Text>
        )}
      </View>
      <View style={{ width: "100%", marginBottom: 20 }}>
        <Input
          text={password}
          setText={setPassword}
          placeholder={"Password"}
          isPassword={true}
        />
        {!!validation.password && (
          <Text style={styles.error}>{validation.password}</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <Text>
        I do not have an account?{" "}
        <Link
          href={{ pathname: "/register", params: { name: "Bacon" } }}
          style={styles.link}
        >
          Register Now
        </Link>
      </Text>
      <Loader visible={loading}/>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    backgroundColor: "#FEF3E0",
  },
  header: {
    color: "#5D4037",
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: "#B5A394",
    marginBottom: 25,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  link: {
    color: "#0790ba",
  },
  error: {
    color: "red",
    marginLeft: 10,
    fontSize: 14,
  },
});
