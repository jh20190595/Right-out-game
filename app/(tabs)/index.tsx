import { Difficulty } from '@/components/stages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = SCREEN_WIDTH * 0.35

const CATEGORIES: { id: Difficulty; title: string; color: string; desc: string }[] = [
  { id: 'DAILY', title: 'DAILY EVENT', color: '#FF3B30', desc: '매일 새로운 도전' },
  { id: 'EASY', title: 'EASY MODE', color: '#4CD964', desc: '입문자를 위한 3x3' },
  { id: 'NORMAL', title: 'NORMAL MODE', color: '#FFCC00', desc: '숙련자를 위한 4x4' },
  { id: 'HARD', title: 'HARD MODE', color: '#007AFF', desc: '전문가용 5x5 장애물' },
  { id: 'EXTREME', title: 'EXTREME', color: '#AF52DE', desc: '예술적인 극한 난이도' },
];

export default function MainScreen() {

  const checkFirstLaunch = async () => {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if(!hasLaunched) {
        await AsyncStorage.setItem('hasLaunched', 'true')
        router.replace('/tutorialModal',)
    }
  }

  const router = useRouter();
  const insets = useSafeAreaInsets();


  return (
    <View style={styles.container}>

      <ScrollView 
        horizontal 
        snapToInterval={BOX_WIDTH} 
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => (
          <Pressable 
            key={cat.id}
            style={({ pressed }) => [
              styles.catBox,
              { borderColor: cat.color },
              pressed && styles.pressed
            ]}
            onPress={() => router.push({
              pathname: `/category/${cat.id}`,
              params: { title: cat.title, color: cat.color }
            })}
          >
            <View style={styles.screenInner}>
              <Text style={[styles.catTitle, { color: cat.color }]}>{cat.title}</Text>
              <Text style={styles.catDesc}>{cat.desc}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    paddingTop: 60,
  },
  scrollContainer: {
    paddingHorizontal: 60,
    paddingTop : 60,
    gap: 20,
  },
  catBox: {
    width: BOX_WIDTH,
    height: BOX_WIDTH * 1.2,
    backgroundColor: '#1A1A1A', 
    borderRadius: 15,
    borderWidth: 8,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  screenInner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  catDesc: {
    color: '#AAA',
    fontSize: 11,
    textAlign: 'center',
  },
});