import { ActivityIndicator, StyleSheet, View } from "react-native";
interface LoaderProps {
  visible: boolean;
}

export default function Loader({ visible }: LoaderProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={90} color="#FF9825" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the whole screen
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensure it's above other content
  },
});
