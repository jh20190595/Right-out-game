import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = 5;
const MARGIN = 2;
const CELL_SIZE = (SCREEN_WIDTH - 100) / GRID_SIZE - (MARGIN * 2);

export default function GameScreen() {

  const insets = useSafeAreaInsets();

  const [board, setBoard] = useState(Array(GRID_SIZE * GRID_SIZE).fill(false))

  const shuffleBoard = () => {

    let newBoard = Array(GRID_SIZE * GRID_SIZE).fill(false);

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const randomIdx = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));

      const row = Math.floor(randomIdx / GRID_SIZE);
      const col = randomIdx % GRID_SIZE;

      const positions = [
        [row, col],
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      positions.forEach(([r, c]) => {
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
          const target = r * GRID_SIZE + c;
          newBoard[target] = !newBoard[target];
        }
      });
    }

    setBoard(newBoard);
  };

  useEffect(() => {
    shuffleBoard();
  },[])


  const toggleLight = (index: number) => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setBoard(prev => {

      const newBoard = [...prev]
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      const rotation = [
        [row, col],
        [row + 1, col],
        [row - 1, col],
        [row, col - 1],
        [row, col + 1],
      ]

      rotation.forEach(([row, col]) => {
        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
          const newCell = row * GRID_SIZE + col
          newBoard[newCell] = !newBoard[newCell]
        }
      })

      const gameWin = newBoard.every(prev => prev === false)
      if (gameWin) {
        setTimeout(() => alert('게임종료'), 200)
      }

      return newBoard
    })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.board}>
        {board.map((cell, idx) => (
          <Pressable
            key={idx}
            onPress={() => toggleLight(idx)}
            style={[
              styles.cell,
              {
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: cell ? '#FFD700' : '#333',
                shadowColor: cell ? '#FFD700' : 'transparent',
                shadowOpacity: 0.8,
                shadowRadius: 10,
                elevation: cell ? 10 : 0,
              }
            ]}
          />
        ))}
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  board: { flexDirection: 'row', flexWrap: 'wrap', width: SCREEN_WIDTH - 60, justifyContent: 'center' },
  cell: { borderWidth: 1, borderColor: '#000', borderRadius: 8, margin: MARGIN },
});