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

  const [step, setStep] = useState(1);

  const [board, setBoard] = useState([
    false, false, false,
    false, true, false,
    false, false, false
  ]);

  const isCleared = board.every(cell => !cell);

  const toggleLight = (index: number) => {

    if (step === 3 && index !== 4) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

      <View style ={[styles.header, {top : insets.top+ 30 , left : insets.left + 30}]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={30} color="#888" />
        </Pressable>
      </View>

      <View style={styles.guideContainer}>
        {step === 1 && <Text style={styles.title}>💡 라이트아웃 소개</Text>}
        {step === 2 && <Text style={styles.title}>📜 게임 규칙</Text>}
        {step === 3 && <Text style={styles.title}>👆 직접 해보기</Text>}
        {step === 4 && <Text style={styles.title}>🎉 {isCleared ? '훌륭합니다!' : '거의 다 됐어요!'}</Text>}

        <Text style={styles.desc}>
          {step === 1 && "모든 전등을 끄는 클래식 퍼즐 게임입니다.\n두뇌를 풀가동해 보세요!"}
          {step === 2 && "전등을 누르면 자신과 상하좌우\n인접한 전등의 불빛이 반전됩니다."}
          {step === 3 && "가운데 전등을 터치해서\n십자 모양으로 불이 켜지는 걸 확인하세요."}
          {step === 4 && isCleared ? "모든 불을 껐습니다.\n이제 실전으로 가볼까요?" : step === 4 && "이제 남은 전등을 모두 꺼보세요!"}
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
          />
        ))}
      </View>


      <View style={styles.footer}>
        {step < 3 ? (
          <Pressable style={styles.button} onPress={() => { setStep(step + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
            <Text style={styles.buttonText}>다음 단계</Text>
          </Pressable>
        ) : isCleared ? (
          <Pressable style={[styles.button, { backgroundColor: '#4CD964' }]} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.buttonText}>게임 시작하기</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', alignItems: 'center', paddingHorizontal: 20 },
  header : { position : 'absolute'},
  guideContainer: { height: 150, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', color: '#FFF', marginBottom: 15 },
  desc: { fontSize: 16, color: '#BBB', textAlign: 'center', lineHeight: 24 },
  board: { flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH - 60, marginTop: 40, justifyContent: 'center' },
  cell: { width: CELL_SIZE - 10, height: CELL_SIZE - 10, margin: 5, borderRadius: 10 },
  highlightCell: { borderWidth: 3, borderColor: '#FFF', transform: [{ scale: 1.1 }] },
  footer: { marginTop: 60, width: '100%', alignItems: 'center' },
  button: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});