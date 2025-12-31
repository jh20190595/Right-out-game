import { STAGES } from "@/components/stages";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const STAGE_SIZE = (SCREEN_WIDTH - 100) / 3

export default function CategoryScreen() {
    const { type,color} = useLocalSearchParams<{ type: string, color : string}>();
    const stages = STAGES[type as keyof typeof STAGES] || [];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 30,backgroundColor : color }]}>
            <View style ={[styles.header, { top : insets.top, left : insets.left + 10}]}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={35} color="#FFF" />
                </Pressable>
            </View>
            <FlatList
                data={stages}
                numColumns={3}
                showsVerticalScrollIndicator = {false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 10 }}
                columnWrapperStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                    <Pressable style={styles.cell}>
                        <Text>스테이지 {item.id}</Text>
                    </Pressable>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems : 'center'
    },
    header : {
        flexDirection : 'row',
        position : 'absolute',
    },
    cell: {
        width: STAGE_SIZE,
        height: STAGE_SIZE,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
})