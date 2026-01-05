import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Setting() { 
    const { isVibrationOn, toggleVibration } = useSettingsStore();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const version = Constants.expoConfig?.version || "1.0.0";


    const handlePrivacyPolicy = () => {

        const url = 'https://gist.github.com/jh20190595/6e15c405e1c305e2328efae70ab64a6e'; 
        
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("오류", "링크를 열 수 없습니다.");
            }
        });
    };

  
    const showOpenSourceLicense = () => {
        Alert.alert(
            "오픈소스 라이선스",
            "이 앱은 React Native, Expo, Zustand, Ionicons 등 오픈소스 소프트웨어를 사용하여 제작되었습니다. 모든 라이선스를 준수합니다.",
            [{ text: "확인" }]
        );
    };

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={{ 
                paddingTop: insets.top + 20, 
                paddingBottom: insets.bottom + 40 
            }}
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
                <View style={[styles.settingRow, styles.noBorder]}>
                    <View style={styles.leftContent}>
                        <Ionicons name="volume-medium-outline" size={22} color="#4A90E2" />
                        <Text style={styles.settingText}>진동 및 효과음</Text>
                    </View>
                    <Switch
                        value={isVibrationOn}
                        onValueChange={toggleVibration}
                        trackColor={{ false: "#ddd", true: "#51CF66" }}
                        thumbColor={isVibrationOn ? "#fff" : "#f4f3f4"}
                    />
                </View>
            </View>

      
            <Text style={styles.sectionLabel}>지원 및 법적 고지</Text>
            <View style={styles.group}>
       
                <Pressable style={styles.settingRow} onPress={() => router.push('/tutorialModal')}>
                    <View style={styles.leftContent}>
                        <Ionicons name="book-outline" size={22} color="#34C759" />
                        <Text style={styles.settingText}>튜토리얼 다시보기</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </Pressable>

                <Pressable style={styles.settingRow} onPress={handlePrivacyPolicy}>
                    <View style={styles.leftContent}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#FF9500" />
                        <Text style={styles.settingText}>개인정보 처리방침</Text>
                    </View>
                    <Ionicons name="link-outline" size={18} color="#ccc" />
                </Pressable>

                <Pressable style={styles.settingRow} onPress={showOpenSourceLicense}>
                    <View style={styles.leftContent}>
                        <Ionicons name="document-text-outline" size={22} color="#5856D6" />
                        <Text style={styles.settingText}>오픈소스 라이선스</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </Pressable>

                <View style={[styles.settingRow, styles.noBorder]}>
                    <View style={styles.leftContent}>
                        <Ionicons name="information-circle-outline" size={22} color="#8E8E93" />
                        <Text style={styles.settingText}>버전 정보</Text>
                    </View>
                    <Text style={styles.versionText}>{version}</Text>
                </View>
            </View>

            <Text style={styles.footerText}>© 2026 Rumo. All rights reserved.</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F0F5FA', 
        paddingHorizontal: 20 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 25 
    },
    backButton: { 
        padding: 5 
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: '800', 
        color: '#333' 
    },
    sectionLabel: { 
        fontSize: 13, 
        color: '#888', 
        marginBottom: 8, 
        marginLeft: 5, 
        fontWeight: '600' 
    },
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
        borderBottomColor: '#F0F5FA' 
    },
    noBorder: { 
        borderBottomWidth: 0 
    },
    leftContent: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12 
    },
    settingText: { 
        fontSize: 16, 
        color: '#333', 
        fontWeight: '600' 
    },
    versionText: { 
        fontSize: 14, 
        color: '#BBB', 
        fontWeight: '500' 
    },
    footerText: { 
        textAlign: 'center', 
        fontSize: 12, 
        color: '#BBB', 
        marginTop: 10 
    }
});