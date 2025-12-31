import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Setting() { 
    const { isVibrationOn, toggleVibration } = useSettingsStore();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleResetData = () => {
        Alert.alert(
            "데이터 초기화",
            "모든 스테이지 클리어 기록이 삭제됩니다. 정말 초기화하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                { 
                    text: "초기화", 
                    style: "destructive", 
                    onPress: () => {
                        alert("데이터가 초기화되었습니다.");
                    } 
                }
            ]
        );
    };

    const handleContact = () => {
        Linking.openURL('mailto:support@example.com?subject=게임 문의하기');
    };

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>설정</Text>
                <View style={{ width: 40 }} /> 
            </View>

            <Text style={styles.sectionLabel}>게임 설정</Text>
            <View style={styles.group}>
                <View style={styles.settingRow}>
                    <View style={styles.leftContent}>
                        <Ionicons name="volume-medium-outline" size={22} color="#4A90E2" />
                        <Text style={styles.settingText}>효과음</Text>
                    </View>
                    <Switch
                        value={isVibrationOn}
                        onValueChange={toggleVibration}
                        trackColor={{ false: "#ddd", true: "#51CF66" }}
                    />
                </View>
            </View>

 
            <Text style={styles.sectionLabel}>지원</Text>
            <View style={styles.group}>
                <Pressable style={styles.settingRow} onPress={() => router.push('/tutorialModal')}>
                    <View style={styles.leftContent}>
                        <Ionicons name="book-outline" size={22} color="#34C759" />
                        <Text style={styles.settingText}>튜토리얼 다시보기</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </Pressable>
                <Pressable style={styles.settingRow} onPress={handleContact}>
                    <View style={styles.leftContent}>
                        <Ionicons name="help-circle-outline" size={22} color="#5856D6" />
                        <Text style={styles.settingText}>도움말 및 문의</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </Pressable>
                <View style={[styles.settingRow, styles.noBorder]}>
                    <View style={styles.leftContent}>
                        <Ionicons name="information-circle-outline" size={22} color="#8E8E93" />
                        <Text style={styles.settingText}>버전 정보</Text>
                    </View>
                    <Text style={styles.versionText}>1.0.0 (Latest)</Text>
                </View>
            </View>

            <Text style={styles.sectionLabel}>데이터 관리</Text>
            <View style={styles.group}>
                <Pressable style={[styles.settingRow, styles.noBorder]} onPress={handleResetData}>
                    <View style={styles.leftContent}>
                        <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
                        <Text style={[styles.settingText, { color: "#FF6B6B" }]}>진행 데이터 초기화</Text>
                    </View>
                </Pressable>
            </View>

            <Text style={styles.footerText}>© 2025 YourGameStudio. All rights reserved.</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F5FA', paddingHorizontal: 20 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 25
    },
    backButton: { padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
    sectionLabel: { fontSize: 13, color: '#888', marginBottom: 8, marginLeft: 5, fontWeight: '600' },
    group: {
        backgroundColor: '#fff',
        borderRadius: 18,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E1E9F0'
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F5FA',
    },
    noBorder: { borderBottomWidth: 0 },
    leftContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingText: { fontSize: 16, color: '#333', fontWeight: '600' },
    versionText: { fontSize: 14, color: '#BBB', fontWeight: '500' },
    footerText: { textAlign: 'center', fontSize: 12, color: '#BBB', marginTop: 10 }
});