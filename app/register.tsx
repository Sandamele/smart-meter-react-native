import { StyleSheet, Text, View } from "react-native";
import Input from "./components/ui/Input";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import Button from "./components/ui/Button";
import axios from "axios";
import Loader from "./components/ui/Loader";
export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleCreateAccount = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    const errors = {
      username: username ? "" : "Username is required",
      email: email
        ? emailRegex.test(email)
          ? ""
          : "Invalid email format"
        : "Email is required",
      password: password
        ? passwordRegex.test(password)
          ? ""
          : "Password must be at least 6 characters, include a capital letter, a lowercase letter, and a number"
        : "Password is required",
    };

    setValidation(errors);

    if (Object.values(errors).some((error) => error !== "")) return;
    setLoading(true)
    const body = {
      email: email.toLowerCase(),
      username,
      password,
    };

    try {
      await axios.post(
        `https://smart-meter-backend-y19r.onrender.com/api/v1/auth/register`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      router.push("/login");
    } catch (error) {
      setLoading(false);
      setError("Either username or email is already taken");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Account</Text>
      <Text style={styles.subHeader}>Secure & Easy Access</Text>
      <View style={{ width: "100%", marginBottom: 5 }}>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={{ width: "100%", marginBottom: 20 }}>
        <Input
          text={username}
          setText={setUsername}
          placeholder={"Username"}
          isPassword={false}
        />
        {!!validation.username && (
          <Text style={styles.error}>{validation.username}</Text>
        )}
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
        <Button title="Sign Up" onPress={handleCreateAccount} />
      </View>
      <Text>
        Already have an account?{" "}
        <Link
          href={{ pathname: "/login", params: { name: "Bacon" } }}
          style={styles.link}
        >
          Login
        </Link>
      </Text>
      <Loader visible={loading} />
    </View>
  );
}

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
