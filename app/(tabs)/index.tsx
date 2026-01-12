import InfoModal from '@/components/RumoInfo';
import { Difficulty, STAGES } from '@/components/Stages';
import { useGameStore } from '@/src/store/useGameStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, PixelRatio, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const scale = SCREEN_WIDTH / 360; 
function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const BOX_WIDTH = SCREEN_WIDTH * 0.42; 

const ACHIEVEMENTS = [
  { id: 1, title: '첫 발걸음', req: 1, color: '#94A3B8' },
  { id: 2, title: '불끄기 입문', req: 30, color: '#E67E22' },
  { id: 3, title: '밤의 파수꾼', req: 50, color: '#3498DB' },
  { id: 4, title: '빛의 인도자', req: 100, color: '#F1C40F' },
  { id: 5, title: '루모 마스터', req: 180, color: '#9B59B6' },
];

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
  const [isShowModal , setIsShowModal] = useState(false);
  const progress = useGameStore((state) => state.progress);
  const stats = useMemo(() => useGameStore.getState().getStats(), [progress]);

  const gradeInfo = useMemo(() => {
    const current = [...ACHIEVEMENTS].reverse().find(a => stats.totalStars >= a.req) 
                 || { title: '입문자', color: '#94A3B8', req: 0 };
    const next = ACHIEVEMENTS.find(a => stats.totalStars < a.req);
    const percent = next ? Math.min((stats.totalStars / next.req) * 100, 100) : 100;

    return {
      title: current.title,
      color: current.color,
      nextTitle: next?.title,
      remaining: next ? next.req - stats.totalStars : 0,
      percent: percent,
      isMax: !next
    };
  }, [stats.totalStars]);

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

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
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push("/collection")} style={styles.iconBtn}>
            <Ionicons name='trophy-outline' size={normalize(24)} color='#007AFF' />
          </Pressable>
          <Pressable onPress={() => router.push("/setting")} style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={normalize(24)} color='#007AFF' />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        overScrollMode='never'
      >
        <View style={styles.content}>
          <ScrollView
            horizontal
            snapToInterval={BOX_WIDTH + 16}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContainer,{ gap :16 }]}
          >
            {CATEGORIES.map((cat, index) => {
              const isAlwaysUnlocked = cat.title === "일일" || cat.title === "쉬움";
              const prevCategoryTitle = CATEGORIES[index - 1]?.title;
              const prevProgress = progress[prevCategoryTitle] || {};
              const prevStages = STAGES[prevCategoryTitle as keyof typeof STAGES] || [];
              const lastStageId = prevStages.length > 0 ? prevStages[prevStages.length - 1].id.toString() : null;
              const isPrevCleared = lastStageId ? prevProgress[lastStageId]?.cleared : false;
              const isUnlocked = isAlwaysUnlocked || isPrevCleared;

              return (
                <Pressable
                  disabled={!isUnlocked}
                  key={cat.id}
                  style={({ pressed }) => [
                    styles.catBox,
                    { backgroundColor: isUnlocked ? cat.bgColor : "#E9ECEF" },
                    pressed && styles.pressed
                  ]}
                  onPress={() => router.push({
                    pathname: `/category/[type]`,
                    params: { type: cat.id, color: cat.color }
                  })}
                >
                  <View style={styles.screenInner}>
                    <View style={[styles.iconCircle, { backgroundColor: isUnlocked ? cat.color + '22' : '#DEE2E6' }]}>
                      {cat.id === '일일' ? <Text style={{ fontSize: normalize(22) }}>📅</Text> : 
                       isUnlocked ? <Text style={{ fontSize: normalize(22) }}>💡</Text> : 
                       <Ionicons name='lock-closed' size={normalize(24)} color="#adb5bd" />}
                    </View>

                    <View style={{ alignItems: 'center', marginVertical: 8 }}>
                      <Text style={[styles.catTitle, { color: isUnlocked ? cat.color : "#adb5bd" }]}>{cat.title}</Text>
                    </View>
                    
                    <Text style={styles.catDesc} numberOfLines={2}>{cat.desc}</Text>

                    <View style={[styles.playBadge, { backgroundColor: isUnlocked ? cat.color : '#adb5bd' }]}>
                      <Text style={[styles.playText, { color: '#FFF' }]}>플레이</Text>
                    </View>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>다음 등급까지</Text>
            <Text style={styles.progressValue}>{Math.floor(gradeInfo.percent)}%</Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[
              styles.progressBarFill, 
              { width: `${gradeInfo.percent}%`, backgroundColor: gradeInfo.color }
            ]} />
          </View>

          <Text style={styles.progressSubText} adjustsFontSizeToFit numberOfLines={1}>
            {!gradeInfo.isMax ? (
              <>
                <Text style={{fontWeight: '800', color: '#1E293B'}}>{gradeInfo.nextTitle}</Text> 달성까지 별 <Text style={{color: gradeInfo.color, fontWeight: '900'}}>{gradeInfo.remaining}개</Text> 남았습니다!
              </>
            ) : (
              "모든 등급을 정복했습니다! 🏆"
            )}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Rumo</Text>
          <Pressable style={{ marginLeft: 6 }} onPress={() => setIsShowModal(true)}>
            <Ionicons name='information-circle-outline' size={normalize(18)} color="#94A3B8"/>
          </Pressable>
          {isShowModal && <InfoModal visible={isShowModal} onClose={() => setIsShowModal(false)}/>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FA' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: Platform.OS === 'android' ? 10 : 15,
    paddingBottom: 10 
  },
  headerRight: { flexDirection: 'row', gap: 15 },
  iconBtn: { padding: 4 },
  content: { marginTop: 5 },
  scrollContainer: { paddingHorizontal: 25, paddingBottom: 20 },
  catBox: { 
    width: BOX_WIDTH, 
    minHeight: BOX_WIDTH * 1.35, 
    borderRadius: 28, 
    padding: 16, 
    elevation: 4, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  screenInner: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  iconCircle: { width: normalize(50), height: normalize(50), borderRadius: normalize(25), justifyContent: 'center', alignItems: 'center' },
  catTitle: { fontSize: normalize(18), fontWeight: '900', textAlign: 'center' },
  catDesc: { color: '#64748B', fontSize: normalize(10.5), textAlign: 'center', lineHeight: normalize(14), height: normalize(28) },
  playBadge: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 15, marginTop: 8 },
  playText: { fontSize: normalize(12), fontWeight: '800' },
  progressSection: {
    marginHorizontal: 25,
    marginTop: 25,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressTitle: { fontSize: normalize(14), fontWeight: '700', color: '#64748B' },
  progressValue: { fontSize: normalize(15), fontWeight: '900', color: '#1E293B' },
  progressBarBg: { width: '100%', height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressSubText: { marginTop: 12, fontSize: normalize(12), color: '#94A3B8', textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 40, 
  },
  footerText: {
    fontSize: normalize(32),
    fontWeight: '800',
    color: '#CBD5E1' 
  },
});