import { Difficulty } from '@/components/stages';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = SCREEN_WIDTH * 0.40;

const CATEGORIES: { id: Difficulty; title: string; color: string; desc: string; bgColor: string }[] = [
  { id: '일일', title: '일일', color: '#FF6B6B', desc: '매일 새로운 도전', bgColor: '#FFF0F0' },
  { id: '쉬움', title: '쉬움', color: '#51CF66', desc: '입문자를 위한 3x3', bgColor: '#F4FFF4' },
  { id: '보통', title: '보통', color: '#FCC419', desc: '숙련자를 위한 4x4', bgColor: '#FFF9DB' },
  { id: '어려움', title: '어려움', color: '#339AF0', desc: '전문가용 5x5 장애물', bgColor: '#E7F5FF' },
  { id: '극한', title: '극한', color: '#B197FC', desc: '예술적인 극한 난이도', bgColor: '#F3F0FF' },
];

export default function MainScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (!hasLaunched) {
      await AsyncStorage.setItem('hasLaunched', 'true');
      router.replace('/tutorialModal');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      <View style={styles.header}>
        <Pressable onPress={ () => router.push({
          pathname : "/setting"
        })}>
          <Ionicons name="settings-outline" size={28} color="#007AFF"/>
        </Pressable>
      </View>

      <View style={styles.content}>   
        <ScrollView
          horizontal
          snapToInterval={BOX_WIDTH + 20}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.catBox,
                { backgroundColor: cat.bgColor }, 
                pressed && styles.pressed
              ]}
              onPress={() => router.push({
                pathname: `/category/[type]`,
                params: { type : cat.id,title: cat.title, color: cat.color }
              })}
            >
              <View style={styles.screenInner}>
                <View style={[styles.iconCircle, { backgroundColor: cat.color + '22' }]}>
                  <Text style={{ fontSize: 24 }}>{cat.id === '일일' ? '📅' : '💡'}</Text>
                </View>
                
                <Text style={[styles.catTitle, { color: cat.color }]}>{cat.title}</Text>
                <Text style={styles.catDesc}>{cat.desc}</Text>
                
                <View style={[styles.playBadge, { backgroundColor: cat.color }]}>
                  <Text style={styles.playText}>플레이</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F5FA' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  content: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    marginLeft: 25,
    marginBottom: 15,
  },
  scrollContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    gap: 20,
  },
  catBox: {
    width: BOX_WIDTH,
    height: BOX_WIDTH * 1.4,
    borderRadius: 30,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  screenInner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  catTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  catDesc: {
    color: '#777',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  playBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  playText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});