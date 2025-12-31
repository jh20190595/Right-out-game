// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 이 부분이 (tabs) 그룹을 첫 화면으로 지정합니다 */}
      <Stack.Screen name="(tabs)" /> 
      
      {/* 탭 바가 나오면 안 되는 페이지들 */}
      <Stack.Screen name="category/[type]" />
      <Stack.Screen name="game/[id]" />
    </Stack>
  );
}