import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
        {/* (tabs) 그룹을 첫 화면 */}
      <Stack.Screen name="(tabs)" /> 
      
      {/* 탭 바가 나오지않는 화면들 */}
      <Stack.Screen name="category/[type]/index" />
      <Stack.Screen name="game/[id]/index" />
    </Stack>
  );
}