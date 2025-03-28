import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen
          name="my_profile"
          options={{
            title: "My Profile",
            headerStyle: { backgroundColor: "#F87315" },
            headerTintColor: "#FFF",
          }}
        />
        <Stack.Screen
          name="beneficiary"
          options={{
            title: "Beneficiary",
            headerStyle: { backgroundColor: "#F87315" },
            headerTintColor: "#FFF",
          }}
        />
        <Stack.Screen
          name="payment"
          options={{ title: "Payment",
            headerStyle: { backgroundColor: "#F87315" },
            headerTintColor: "#FFF",
          }}
        />
        <Stack.Screen
          name="transaction_history"
          options={{
            title: "Transaction History",
            headerStyle: { backgroundColor: "#F87315" },
            headerTintColor: "#FFF",
          }}
        />
      </Stack>
  );
}
