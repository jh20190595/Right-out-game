import useCalendar from "@/src/hooks/useCalendar";
import { useStages } from "@/src/hooks/useStages";
import { useGameStore } from "@/src/store/useGameStore"; // 스토어 임포트
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    type: string;
    color: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_WIDTH = (SCREEN_WIDTH - 50) / 7;

export default function DaliyStages({ type, color }: Props) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { year, month, dayArray } = useCalendar();
    const { currentColor, totalStages } = useStages(type);
    
    const progress = useGameStore((state) => state.progress);
    const dailyProgress = progress[type] || {}; 

    const todayDate = new Date().getDate();

    return (
        <View style={styles.container}>
            <View style={[styles.headerBg, { height: insets.top + 120, backgroundColor: currentColor + '22' }]} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable onPress={() => router.push('/(tabs)')} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={30} color={currentColor} />
                </Pressable>
                <View style={styles.titleContainer}>
                    <Text style={[styles.headerTitle, { color: currentColor }]}>{type} 미션</Text>
                    <Text style={styles.headerSubTitle}>{totalStages} 개의 전용 퍼즐</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.calendarContainer}>
                <Text style={styles.dateTitle}>{year}년 {month + 1}월</Text>
                
                <View style={styles.weekHeader}>
                    {WEEK_DAYS.map((day, i) => (
                        <Text key={i} style={[styles.weekText, i === 0 && { color: '#FF6B6B' }, i === 6 && { color: '#339AF0' }]}>
                            {day}
                        </Text>
                    ))}
                </View>

                <FlatList
                    data={dayArray}
                    numColumns={7}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.calendarRow}
                    renderItem={({ item }) => {
                        const isToday = item === todayDate;
                        const isLocked = item !== null && item > todayDate;

          
                        const stageKey = `daily-${item}`;
                        const stageData = dailyProgress[stageKey];
                        const isCleared = stageData?.cleared || false;
                        const starCount = stageData?.stars || 0;

                        return (
                            <View style={styles.dayCell}>
                                {item !== null ? (
                                    <Pressable
                                        disabled={isLocked}
                                        onPress={() => router.push({
                                            pathname: `/game/[id]`,
                                            params: { id: stageKey, type: type }
                                        })}
                                        style={({ pressed }) => [
                                            styles.dayInner,
                                            isToday && { backgroundColor: currentColor + '15', borderWidth: 1.5, borderColor: currentColor },
                                            isCleared && { backgroundColor: '#FFF' },
                                            pressed && { scale: 0.95, opacity: 0.7 }
                                        ]}
                                    >
                                        {isLocked ? (
                                            <Ionicons name="lock-closed" size={16} color="#CCC" />
                                        ) : (
                                            <>
                                                <Text style={[
                                                    styles.dayText, 
                                                    isToday && { color: currentColor, fontWeight: '900' },
                                                    isCleared && { marginBottom: 2 } 
                                                ]}>
                                                    {item}
                                                </Text>
                                                {isCleared && (
                                                    <View style={styles.starRow}>
                                                        {[1, 2, 3].map((s) => (
                                                            <Ionicons 
                                                                key={s} 
                                                                name="star" 
                                                                size={8} 
                                                                color={s <= starCount ? "#FCC419" : "#EEE"} 
                                                            />
                                                        ))}
                                                    </View>
                                                )}
                                            </>
                                        )}
                                    </Pressable>
                                ) : (
                                    <View style={styles.dayInner} />
                                )}
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F5FA' },
    headerBg: { position: 'absolute', top: 0, left: 0, right: 0, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 20, zIndex: 10 },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    titleContainer: { alignItems: 'center', marginTop : 30 },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    headerSubTitle: { fontSize: 12, color: '#888', marginTop: 2 },
    calendarContainer: { marginTop: 100, paddingHorizontal: 25, flex: 1 },
    dateTitle: { fontSize: 22, fontWeight: '800', color: '#333', marginBottom: 25 },
    weekHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5 },
    weekText: { width: DAY_WIDTH - 10, textAlign: 'center', fontSize: 13, fontWeight: '700', color: '#999' },
    calendarRow: { justifyContent: 'space-between', marginBottom: 12 },
    dayCell: { width: DAY_WIDTH - 8, aspectRatio: 1 },
    dayInner: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 16, 
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    dayText: { fontSize: 15, fontWeight: '600', color: '#444' },
    starRow: { flexDirection: 'row', gap: 1 }
});