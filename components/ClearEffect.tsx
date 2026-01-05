import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  visible: boolean;
};

export default function ClearEffect({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ConfettiCannon
        count={200}           // 폭죽 가루 개수
        origin={{ x: SCREEN_WIDTH / 2, y: -20 }} // 화면 상단 중앙에서 발사
        autoStart={true}      // 컴포넌트가 나타나자마자 시작
        fadeOut={true}        // 끝날 때 서서히 투명해짐
        fallSpeed={3000}      // 떨어지는 속도 (ms)
        explosionSpeed={350}  // 팡 터지는 속도
        colors={['#FFD700', '#FF6B6B', '#51CF66', '#339AF0', '#B197FC']} // 테마 색상
      />
    </View>
  );
}