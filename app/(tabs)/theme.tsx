import { StyleSheet, Text, View } from "react-native";

export default function Theme() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎨 테마 변경 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCDCDC' },
  text: { fontSize: 20, fontWeight: 'bold' }
});