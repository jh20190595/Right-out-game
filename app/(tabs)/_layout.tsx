import { Ionicons } from '@expo/vector-icons'; // 기본 아이콘 사용
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: '#DCDCDC', 
          borderTopWidth: 1,
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
        name="theme"
        options={{
          title: '테마',
          tabBarIcon: ({ color ,focused }) => <Ionicons name={ focused ? 'color-palette': 'color-palette-outline' }  size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}