import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, Text, TextInput } from 'react-native';

export default function RootLayout() {

  useEffect(() => {
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    (Text as any).defaultProps.allowFontScaling = false;

    if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
    (TextInput as any).defaultProps.allowFontScaling = false;
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F5FA"/>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="category/[type]/index" />
      <Stack.Screen name="game/[id]/index" />
    </Stack>
    </>
  );
}