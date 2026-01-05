import { useGameStore } from '@/src/store/useGameStore';
import { useSettingsStore } from '@/src/store/useSettingsStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ClearEffect from './ClearEffect';
import { STAGES } from './Stages';
import { WinModal } from './WinModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MARGIN = 2;
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

type Props = {
    id: string;
    type: string;
    onWin: () => void;
};

export default function Board({ id, type, onWin }: Props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [isWin, setIsWin] = useState(false);
    const [moveCount, setMoveCount] = useState(0);

    const { isVibrationOn } = useSettingsStore();
    const saveResult = useGameStore((state) => state.saveResult);

    const isDaily = type === '일일';

    // 1. 스테이지 설정 수정 (일일 미션 5x5 -> 4x4로 변경)
    const stage = isDaily
        ? {
            gridSize: 4, // 👈 4x4로 변경하여 난이도 조절
            obstacles: [],
            shuffleSteps: 12 + (parseInt(id.replace('daily-', '')) % 8) // 👈 셔플 횟수도 적절히 하향
        }
        : STAGES[type as keyof typeof STAGES]?.find((s) => s.id.toString() === id);

    const GRID_SIZE = stage?.gridSize || 3;
    const OBSTACLES = stage?.obstacles || [];
    const SHUFFLE_STEPS = stage?.shuffleSteps || 10;
    
    const CELL_SIZE = (SCREEN_WIDTH - 100) / GRID_SIZE - (MARGIN * 2);

    const [board, setBoard] = useState<boolean[]>(Array(GRID_SIZE * GRID_SIZE).fill(false));

    useEffect(() => {
        if (stage || isDaily) {
            resetGame();
        }
    }, [id, type]);

    const resetGame = () => {
        setIsWin(false);
        setMoveCount(0);
        shuffleBoard();
    };

    const handleHaptic = (hapticType: 'light' | 'success' | 'error') => {
        if (!isVibrationOn) return;
        switch (hapticType) {
            case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
            case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
        }
    };

    const shuffleBoard = () => {
        let newBoard = Array(GRID_SIZE * GRID_SIZE).fill(false);

        const now = new Date();
        const dayNum = isDaily ? parseInt(id.replace('daily-', '')) : 0;
        const seedBase = Number(`${now.getFullYear()}${now.getMonth() + 1}${dayNum}`);

        for (let i = 0; i < SHUFFLE_STEPS; i++) {
            let randomIdx;
            if (isDaily) {
                randomIdx = Math.floor(seededRandom(seedBase + i) * (GRID_SIZE * GRID_SIZE));
            } else {
                randomIdx = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
            }

            if (!OBSTACLES.includes(randomIdx)) {
                Toggle(newBoard, randomIdx);
            }
        }
        setBoard(newBoard);
    };

    const Toggle = (targetBoard: boolean[], index: number) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const positions = [[row, col], [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];

        positions.forEach(([r, c]) => {
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                const target = r * GRID_SIZE + c;
                if (!OBSTACLES.includes(target)) {
                    targetBoard[target] = !targetBoard[target];
                }
            }
        });
    };
    const calculateStars = () => {

        const baseSteps = SHUFFLE_STEPS + 5; 
        
        if (moveCount <= baseSteps) return 3;
        if (moveCount <= baseSteps * 2.0) return 2; 
        return 1;
    };

    const toggleLight = (index: number) => {
        if (OBSTACLES.includes(index) || isWin) {
            handleHaptic('error');
            return;
        }

        handleHaptic('light');
        setMoveCount(prev => prev + 1);

        setBoard((prev) => {
            const newBoard = [...prev];
            Toggle(newBoard, index);

            if (newBoard.every(cell => !cell)) {
                handleHaptic('success');
                setIsWin(true);
                const starCount = calculateStars();
                saveResult(type, id, starCount);
            }
            return newBoard;
        });
    };

    const displayTitle = isDaily
        ? `${new Date().getMonth() + 1}월 ${id.replace('daily-', '')}일`
        : `Level ${id}`;

    if (!stage && !isDaily) return <View style={styles.container}><Text>Stage Not Found</Text></View>;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </Pressable>
                <Pressable onPress={() => router.push('/setting')}>
                    <Ionicons name="settings-outline" size={28} color="#333" />
                </Pressable>
            </View>

            <View style={styles.titleContent}>
                <Text style={styles.stageType}>{type}</Text>
                <Text style={styles.stageTitle}>{displayTitle}</Text>
                <View style={styles.moveBadge}>
                    <Text style={styles.moveText}>이동: {moveCount}</Text>
                </View>
            </View>

            <View style={styles.boardWrapper}>
                <View style={[styles.board, { width: SCREEN_WIDTH - 40 }]}>
                    {board.map((cell, idx) => {
                        const isObstacle = OBSTACLES.includes(idx);
                        return (
                            <Pressable
                                disabled={isWin}
                                key={idx}
                                onPress={() => toggleLight(idx)}
                                style={({ pressed }) => [
                                    styles.cell,
                                    {
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        backgroundColor: isObstacle ? '#475569' : (cell ? '#FFD43B' : '#FFF'),
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                    cell && !isObstacle && styles.activeCellShadow
                                ]}
                            >
                                {isObstacle && <Ionicons name="close-circle" size={CELL_SIZE * 0.4} color="#CBD5E1" />}
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {isWin && (
                <>
                    <ClearEffect visible={isWin} />
                    <WinModal
                        stars={calculateStars()}
                        onExit={() => router.push(`/category/${type}`)}
                        onNext={onWin}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F5FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginTop: 15 },
    backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    titleContent: { alignItems: 'center', marginTop: 10 },
    stageType: { fontSize: 13, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.5, marginBottom: 4 },
    stageTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B' },
    moveBadge: { marginTop: 10, backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    moveText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
    boardWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', backgroundColor: '#CBD5E1', padding: 12, borderRadius: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
    cell: { borderRadius: 14, margin: MARGIN, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
    activeCellShadow: { shadowColor: '#FFD43B', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
});