import { useSettingsStore } from '@/src/store/useSettingsStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = 3;
const CELL_SIZE = (SCREEN_WIDTH - 100) / GRID_SIZE;

export default function TutorialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { isVibrationOn } = useSettingsStore();

  const [step, setStep] = useState(1);
  const [board, setBoard] = useState([
    false, false, false,
    false, true, false,
    false, false, false
  ]);

  const isCleared = board.every(cell => !cell);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
    if (isVibrationOn) {
      Haptics.impactAsync(style);
    }
  };

  const toggleLight = (index: number) => {
    if (step === 3 && index !== 4) return;

    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);

    const newBoard = [...board];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    [[row, col], [row + 1, col], [row - 1, col], [row, col - 1], [row, col + 1]].forEach(([r, c]) => {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        newBoard[r * GRID_SIZE + c] = !newBoard[r * GRID_SIZE + c];
      }
    });
    setBoard(newBoard);

    if (step === 3) setStep(4);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 50 }]}>
      {router.canGoBack() && (
        <View style={[styles.header, { top: insets.top + 20, left: 25, zIndex: 10 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color="#FFF" />
          </Pressable>
        </View>
      )}

      <View style={styles.guideContainer}>
        <Text style={styles.title}>
            {step === 1 && "💡 라이트아웃 소개"}
            {step === 2 && "📜 게임 규칙"}
            {step === 3 && "👆 직접 해보기"}
            {step === 4 && (isCleared ? "🎉 훌륭합니다!" : "🎯 연습 모드")}
        </Text>
        <Text style={styles.desc}>
          {step === 1 && "모든 전등을 끄는 클래식 퍼즐 게임입니다.\n두뇌를 풀가동해 보세요!"}
          {step === 2 && "전등을 누르면 자신과 상하좌우\n인접한 전등의 불빛이 반전됩니다."}
          {step === 3 && "가운데 전등을 터치해서\n십자 모양으로 불이 켜지는 걸 확인하세요."}
          {step === 4 && (isCleared ? "모든 불을 껐습니다.\n이제 실전으로 가볼까요?" : "이제 남은 전등을 모두 꺼보세요!")}
        </Text>
      </View>

      <View style={[styles.board, (step < 3) && { opacity: 0.3 }]}>
        {board.map((cell, idx) => (
          <Pressable
            key={idx}
            onPress={() => (step >= 3) && toggleLight(idx)}
            style={[
              styles.cell,
              { backgroundColor: cell ? '#FFD700' : '#333' },
              step === 3 && idx === 4 && styles.highlightCell
            ]}
          >
             {step === 3 && idx === 4 && <Ionicons name="finger-print" size={30} color="white" />}
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        {step < 3 ? (
          <Pressable 
            style={styles.button} 
            onPress={() => { 
                setStep(step + 1); 
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light); 
            }}
          >
            <Text style={styles.buttonText}>다음 단계</Text>
          </Pressable>
        ) : isCleared ? (
          <Pressable 
            style={[styles.button, { backgroundColor: '#4CD964' }]} 
            onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
                router.replace('/(tabs)');
            }}
          >
            <Text style={styles.buttonText}>게임 시작하기</Text>
          </Pressable>
        ) : (
            <Text style={styles.hintText}>전구를 모두 꺼야 시작할 수 있습니다</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', alignItems: 'center', paddingHorizontal: 20 },
  header: { position: 'absolute' },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  guideContainer: { height: 160, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 15 },
  desc: { fontSize: 16, color: '#BBB', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  board: { flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH - 60, marginTop: 40, justifyContent: 'center' },
  cell: { width: CELL_SIZE - 10, height: CELL_SIZE - 10, margin: 5, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  highlightCell: { 
    borderWidth: 4, 
    borderColor: '#FFF', 
    transform: [{ scale: 1.1 }],
    shadowColor: "#FFF",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10
  },
  footer: { marginTop: 60, width: '100%', alignItems: 'center' },
  button: { backgroundColor: '#007AFF', paddingVertical: 16, paddingHorizontal: 50, borderRadius: 30 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  hintText: { color: '#555', fontSize: 14, fontWeight: '600' }
});