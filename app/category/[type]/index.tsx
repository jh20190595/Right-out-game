import { STAGES } from "@/components/stages";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STAGE_SIZE = (SCREEN_WIDTH - 80) / 3;

export default function CategoryScreen() {
    const { type,title, color } = useLocalSearchParams<{ type: string, title: string, color: string }>();
    const stages = STAGES[type as keyof typeof STAGES] || [];
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isCleared, setIsCleared] = useState(5);

    console.log(type)

    return (
        <View style={styles.container}>
            <View style={[styles.headerBg, { height: insets.top + 120, backgroundColor: color + '22' }]} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.5 }]}
                >
                    <Ionicons name="chevron-back" size={30} color={color || "#333"} />
                </Pressable>
                <View style={styles.titleContainer}>
                    <Text style={[styles.headerTitle, { color: color || "#333" }]}>{title || "STAGES"}</Text>
                    <Text style={styles.headerSubTitle}>{stages.length} 개의 퍼즐</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={stages}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item, index }) => {
                    const isUnlocked = index < isCleared
                    return (
                        <Pressable
                            disabled={!isUnlocked}
                            style={({ pressed }) => [
                                styles.cell,
                                pressed && isUnlocked && styles.cellPressed,
                                { opacity: isUnlocked ? 1.0 : 0.4 }
                            ]}
                            onPress={() => isUnlocked && router.push({
                                pathname: `/game/[id]`,
                                params: { id: item.id.toString(), type: type }
                            })}

                        >
                            <View style={[styles.cellInner, { backgroundColor: '#FFF' }]}>
                                {!isUnlocked ? (
                                    <Ionicons name="lock-closed" size={20} color="#CCC" />
                                ) : (
                                    <>
                                        <Text style={[styles.stageNumber, { color: color || "#555" }]}>{item.id}</Text>
                                        <View style={[styles.statusDot, { backgroundColor: color || "#DDD" }]} />
                                    </>
                                )}
                            </View>
                        </Pressable>
                    )
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F5FA',
    },
    headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    headerSubTitle: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    listContent: {
        paddingHorizontal: 25,
        paddingTop: 20,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
        gap: 15,
        marginBottom: 15,
    },
    cell: {
        width: STAGE_SIZE,
        height: STAGE_SIZE,
    },
    cellInner: {
        flex: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cellPressed: {
        transform: [{ scale: 0.92 }],
        opacity: 0.8,
    },
    stageNumber: {
        fontSize: 18,
        fontWeight: '700',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 8,
        opacity: 0.5,
    },
});