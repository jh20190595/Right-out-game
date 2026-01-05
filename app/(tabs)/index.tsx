import InfoModal from '@/components/RumoInfo';
import { Difficulty, STAGES } from '@/components/Stages';
import { useGameStore } from '@/src/store/useGameStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = SCREEN_WIDTH * 0.40;

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
          <Pressable onPress={() => router.push("/collection")}>
            <Ionicons name='trophy-outline' size={26} color='#007AFF' />
          </Pressable>
          <Pressable onPress={() => router.push("/setting")}>
            <Ionicons name="settings-outline" size={26} color='#007AFF' />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ScrollView
            horizontal
            snapToInterval={BOX_WIDTH + 20}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
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
                    <View style={[styles.iconCircle, { backgroundColor: isUnlocked ? cat.color + '22' : '#E9ECEF' }]}>
                      {cat.id === '일일' ? <Text style={{ fontSize: 24 }}>📅</Text> : 
                       isUnlocked ? <Text style={{ fontSize: 24 }}>💡</Text> : 
                       <Ionicons name='lock-closed' size={26} color="#495057" />}
                    </View>

                    <View style={{ alignItems: 'center' }}>
                      <Text style={[styles.catTitle, { color: isUnlocked ? cat.color : "#999" }]}>{cat.title}</Text>
                      {cat.id === "일일" && (
                        <Text style={{ fontSize: 12, fontWeight: '600', color: cat.color, marginTop: 2 }}>
                          {month}월 {date}일
                        </Text>
                      )}
                    </View>
                    
                    <Text style={styles.catDesc}>{cat.desc}</Text>

                    <View style={[styles.playBadge, { backgroundColor: isUnlocked ? cat.color : '#999' }]}>
                      <Text style={[styles.playText, { color: isUnlocked ? '#FFF' : '#777' }]}>플레이</Text>
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

          {!gradeInfo.isMax ? (
            <Text style={styles.progressSubText}>
              <Text style={{fontWeight: '800', color: '#1E293B'}}>{gradeInfo.nextTitle}</Text> 달성까지 별 <Text style={{color: gradeInfo.color, fontWeight: '900'}}>{gradeInfo.remaining}개</Text> 남았습니다!
            </Text>
          ) : (
            <Text style={styles.progressSubText}>축하합니다! 모든 등급을 정복했습니다. 🏆</Text>
          )}
        </View>
      </ScrollView>

      <View style = {styles.footer}>
          <Text style = {styles.footerText}>Rumo</Text>
          <Pressable style = {{ marginBottom : 8}} onPress={() => setIsShowModal(true)}>
            <Ionicons name='information-circle-outline' size={16} color="#94A3B8"/>
          </Pressable>
          {isShowModal && <InfoModal visible = {isShowModal} onClose={() => setIsShowModal(false)}/>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F5FA' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 },
  headerRight: { flexDirection: 'row', gap: 15 },
  content: { marginTop: 10 },
  scrollContainer: { paddingHorizontal: 25, paddingBottom: 25, gap: 20 },
  catBox: { width: BOX_WIDTH, height: BOX_WIDTH * 1.4, borderRadius: 32, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  pressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  screenInner: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  catTitle: { fontSize: 18, fontWeight: '900', textAlign: 'center' },
  catDesc: { color: '#777', fontSize: 11, textAlign: 'center', lineHeight: 16 },
  playBadge: { paddingVertical: 8, paddingHorizontal: 22, borderRadius: 20 },
  playText: { fontSize: 12, fontWeight: '800' },
  progressSection: {
    marginHorizontal: 25,
    marginTop: 40,
    padding: 22,
    backgroundColor: '#FFF',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressTitle: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  progressValue: { fontSize: 16, fontWeight: '900', color: '#1E293B' },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 6 },
  progressSubText: {
    marginTop: 15,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  footer : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    paddingBottom : 100,
    marginTop : 10,
  },
  footerText : {
    fontSize : 36,
    fontWeight : 800,
    color : '#475569'
  },
});