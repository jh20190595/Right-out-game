import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  visible: boolean;
};

export default function ClearEffect({ visible }: Props) {


    const animationRef = useRef<LottieView>(null);
    
    useEffect(() => {
        if(visible) {
            animationRef.current?.play();
        } else {
            animationRef.current?.reset();
        }
    },[visible])

    if(!visible) return null;

  return (
    <View style={styles.container} pointerEvents='none'>
        <LottieView
            ref={animationRef}
            source={require('../assets/animations/confetti.json')}
            autoPlay={false}
            loop = {false}
            style={styles.lottie}
        />
    </View>
    /*<View style={[StyleSheet.absoluteFill,{zIndex : 999}]} pointerEvents="none">
      <ConfettiCannon
        count={200}           // 폭죽 가루 개수
        origin={{ x: SCREEN_WIDTH / 2, y: -20 }} // 화면 상단 중앙에서 발사
        autoStart={true}      // 컴포넌트가 나타나자마자 시작
        fadeOut={true}        // 끝날 때 서서히 투명해짐
        fallSpeed={3000}      // 떨어지는 속도 (ms)
        explosionSpeed={350}  // 팡 터지는 속도
        colors={['#FFD700', '#FF6B6B', '#51CF66', '#339AF0', '#B197FC']} // 테마 색상
      />
    </View>*/
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});