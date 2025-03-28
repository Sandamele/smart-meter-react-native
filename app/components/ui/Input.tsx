import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

export default function Input({
  text,
  setText,
  placeholder,
  isPassword=false,
  isEditable=true
}: {
  text: string;
  setText: (value: string) => void;
  placeholder: string;
  isPassword?: boolean
  isEditable?: boolean
}) {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      value={text}
      onChangeText={setText}
      secureTextEntry={isPassword}
      editable={isEditable}
      placeholderTextColor="#888"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "100%",
    paddingLeft: 20,
    borderRadius: 8,
    color: "black",
    backgroundColor: "#fff",
    cursor: "pointer"
  },
});
