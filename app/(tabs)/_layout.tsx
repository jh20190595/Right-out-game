import RumoLoadingScreen from '@/components/RumoLoadingScreen';
import { useGameStore } from '@/src/store/useGameStore';
import { Ionicons } from '@expo/vector-icons'; // 기본 아이콘 사용
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {

  const hasHydrated = useGameStore.persist.hasHydrated();

  useEffect(() => {
    if(hasHydrated) {
      SplashScreen.hideAsync();
    }
  },[hasHydrated])

  if(!hasHydrated) {
    return <RumoLoadingScreen/>
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: 'white', 
          borderTopWidth: 0.5,
          borderTopColor: '#BBB',
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#007AFF',  
        tabBarInactiveTintColor: '#888', 
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          marginTop : 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '메인',
          tabBarIcon: ({ color,focused }) => <Ionicons name= { focused ? 'home-sharp': 'home' } size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: '컬렉션',
          tabBarIcon: ({ color ,focused }) => <Ionicons name={ focused ? 'trophy': 'trophy-outline' }  size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}