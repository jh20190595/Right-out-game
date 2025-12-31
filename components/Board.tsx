import { useSettingsStore } from '@/src/store/useSettingsStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STAGES } from './stages';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MARGIN = 2;

type Props = {
    id: string;
    type: string;
};

export default function Board({ id, type }: Props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const { isVibrationOn } = useSettingsStore();

    const stage = STAGES[type as keyof typeof STAGES]?.find((s) => s.id.toString() === id);
    const GRID_SIZE = stage?.gridSize || 3;
    const OBSTACLES = stage?.obstacles || [];
    const SHUFFLE_STEPS = stage?.shuffleSteps || 10;

    const CELL_SIZE = (SCREEN_WIDTH - 100) / GRID_SIZE - (MARGIN * 2);

    const [board, setBoard] = useState<boolean[]>(Array(GRID_SIZE * GRID_SIZE).fill(false));

    useEffect(() => {
        if (stage) shuffleBoard();
    }, [id, type]);

    const handleHaptic = (type: 'light' | 'success' | 'error') => {
        if (!isVibrationOn) return;

        switch (type) {
            case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
            case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
        }
    }

    const shuffleBoard = () => {
        let newBoard = Array(GRID_SIZE * GRID_SIZE).fill(false);

        for (let i = 0; i < SHUFFLE_STEPS; i++) {
            const randomIdx = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));

            if (!OBSTACLES.includes(randomIdx)) {
                Toggle(newBoard, randomIdx);
            }
        }
        setBoard(newBoard);
    };

    const Toggle = (targetBoard: boolean[], index: number) => {
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;

        const positions = [
            [row, col], [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
        ];

        positions.forEach(([r, c]) => {
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                const target = r * GRID_SIZE + c;
                if (!OBSTACLES.includes(target)) {
                    targetBoard[target] = !targetBoard[target];
                }
            }
        });
    };

    const toggleLight = (index: number) => {
        if (OBSTACLES.includes(index)) {
            handleHaptic('error')
            return;
        }

        handleHaptic('light')

        setBoard((prev) => {
            const newBoard = [...prev];
            Toggle(newBoard, index);

            const isWin = newBoard.every((cell, idx) => OBSTACLES.includes(idx) ? true : !cell);

            if (isWin) {
                handleHaptic('success')
                setTimeout(() => {
                    Alert.alert("🎉 Stage Clear!", "퍼즐을 완성했습니다!", [
                        { text: "확인", onPress: () => router.back() }
                    ]);
                }, 300);
            }
            return newBoard;
        });
    };

    if (!stage) return <View style={styles.container}><Text>Stage Not Found</Text></View>;

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
                <Text style={styles.stageTitle}>Level {id}</Text>
            </View>

            <View style={styles.boardWrapper}>
                <View style={[styles.board, { width: SCREEN_WIDTH - 40 }]}>
                    {board.map((cell, idx) => {
                        const isObstacle = OBSTACLES.includes(idx);
                        return (
                            <Pressable
                                key={idx}
                                onPress={() => toggleLight(idx)}
                                style={({ pressed }) => [
                                    styles.cell,
                                    {
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        backgroundColor: isObstacle ? '#444' : (cell ? '#FFD43B' : '#FFF'),
                                        opacity: pressed ? 0.8 : 1,
                                    },
                                    cell && !isObstacle && styles.activeCellShadow
                                ]}
                            >
                                {isObstacle && <Ionicons name="close" size={CELL_SIZE * 0.5} color="#666" />}
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F5FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    titleContent: {
        alignItems: 'center',
    },
    stageType: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        letterSpacing: 1,
    },
    stageTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#333',
    },
    boardWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: '#E2E8F0',
        padding: 10,
        borderRadius: 24,
    },
    cell: {
        borderRadius: 12,
        margin: MARGIN,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    activeCellShadow: {
        shadowColor: '#FFD43B',
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },

    guideText: {
        fontSize: 14,
        color: '#777',
        fontWeight: '600',
    }
});