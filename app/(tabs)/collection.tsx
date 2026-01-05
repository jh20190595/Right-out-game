import { useGameStore } from '@/src/store/useGameStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ACHIEVEMENTS = [
    { id: 1, title: '첫 발걸음', req: 1, icon: 'flashlight-outline', color: '#94A3B8' },
    { id: 2, title: '불끄기 입문', req: 30, icon: 'flame', color: '#E67E22' },
    { id: 3, title: '밤의 파수꾼', req: 50, icon: 'shield-checkmark', color: '#3498DB' },
    { id: 4, title: '빛의 인도자', req: 100, icon: 'sunny', color: '#F1C40F' },
    { id: 5, title: '루모 마스터', req: 180, icon: 'trophy', color: '#9B59B6' },
];

export default function CollectionScreen() {
    const insets = useSafeAreaInsets();
    const progress = useGameStore((state) => state.progress);
    const stats = useMemo(() => useGameStore.getState().getStats(), [progress]);
    const { totalStars, clearedCount } = stats;

    const gradeInfo = useMemo(() => {
        const current = [...ACHIEVEMENTS].reverse().find(a => totalStars >= a.req) || { title: '입문자', color: '#94A3B8' };
        const next = ACHIEVEMENTS.find(a => totalStars < a.req);
        return {
            title: current.title,
            color: current.color,
            nextTitle: next?.title,
            remaining: next ? next.req - totalStars : 0,
            isMax: !next
        };
    }, [totalStars]);

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerCard}>
                    <View style={[styles.profileCircle, { backgroundColor: gradeInfo.color }]}>
                        <Ionicons name="person" size={40} color="#FFF" />
                    </View>
                    <Text style={styles.userName}>{gradeInfo.title}</Text>
                    
                    {!gradeInfo.isMax && (
                        <Text style={styles.remainingText}>
                            {gradeInfo.nextTitle}까지 별 {gradeInfo.remaining}개 남음
                        </Text>
                    )}
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{clearedCount}</Text>
                            <Text style={styles.statLabel}>클리어</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={[styles.statValue, { color: '#FCC419' }]}>{totalStars}</Text>
                            <Text style={styles.statLabel}>총 별점</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>나의 컬렉션</Text>

                <View style={styles.grid}>
                    {ACHIEVEMENTS.map((item) => {
                        const isUnlocked = totalStars >= item.req;
                        const progressVal = Math.min(totalStars / item.req, 1);

                        return (
                            <View key={item.id} style={[styles.itemCard, !isUnlocked && styles.lockedCard]}>
                                <View style={[
                                    styles.iconCircle, 
                                    { backgroundColor: isUnlocked ? item.color : '#E2E8F0' }
                                ]}>
                                    <Ionicons 
                                        name={isUnlocked ? (item.icon as any) : "lock-closed"} 
                                        size={32} 
                                        color={isUnlocked ? "#FFF" : "#94A3B8"} 
                                    />
                                </View>

                                <Text style={[styles.itemTitle, !isUnlocked && styles.lockedText]}>
                                    {item.title}
                                </Text>
                                <Text style={styles.itemReq}>별 {item.req}개 필요</Text>

                                {!isUnlocked ? (
                                    <View style={styles.progressContainer}>
                                        <View style={styles.progressBar}>
                                            <View style={[styles.progressInner, { width: `${progressVal * 100}%` }]} />
                                        </View>
                                        <Text style={styles.progressPercent}>{Math.floor(progressVal * 100)}%</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.unlockedBadge, { backgroundColor: item.color + '22' }]}>
                                        <Text style={[styles.unlockedText, { color: item.color }]}>달성 완료</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F0F5FA' },
    container: { flex: 1 },
    contentContainer: { padding: 20, paddingBottom: 100 },
    headerCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 25, alignItems: 'center', marginTop: 10, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20 },
    profileCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    userName: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 5 },
    remainingText: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginBottom: 20 },
    statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20 },
    statBox: { alignItems: 'center' },
    statValue: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
    statLabel: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '600' },
    divider: { width: 1, height: '100%', backgroundColor: '#F1F5F9' },
    sectionTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginTop: 35, marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    itemCard: { width: (width - 55) / 2, backgroundColor: '#FFF', borderRadius: 24, padding: 20, alignItems: 'center', marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    lockedCard: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', elevation: 0 },
    iconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    itemTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
    lockedText: { color: '#94A3B8' },
    itemReq: { fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: '700' },
    progressContainer: { width: '100%', alignItems: 'center', marginTop: 15 },
    progressBar: { width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
    progressInner: { height: '100%', backgroundColor: '#475569' },
    progressPercent: { fontSize: 10, color: '#64748B', marginTop: 5, fontWeight: '800' },
    unlockedBadge: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
    unlockedText: { fontSize: 11, fontWeight: '900' }
});