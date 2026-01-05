import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type WinModalProps = {
  stars: number;
  onExit: () => void;
  onNext: () => void;
  isLast?: boolean;
};

export const WinModal = ({ stars, onExit, onNext, isLast }: WinModalProps) => {

  const starAnim1 = useRef(new Animated.Value(0)).current;
  const starAnim2 = useRef(new useRef(new Animated.Value(0))).current;
  const anims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = anims.map((anim, index) => {
      return Animated.spring(anim, {
        toValue: index < stars ? 1 : 0, 
        tension: 50,
        friction: 4,
        useNativeDriver: true,
        delay: index * 500,
      });
    });

    Animated.sequence([
      Animated.delay(300),
      Animated.parallel(animations)
    ]).start();
  }, [stars]);

  return (
    <View style={styles.overlay}>
      <Animated.View style={styles.card}>
        
        <View style={styles.starRow}>
          {anims.map((anim, i) => (
            <Animated.View 
              key={i} 
              style={{ 
                transform: [
                  { scale: anim }, 
                  { rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-30deg', '0deg']
                    }) 
                  }
                ],
                opacity: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1, 1]
                })
              }}
            >
              <Ionicons 
                name={i < stars ? "star" : "star-outline"} 
                size={50} 
                color={i < stars ? "#FCC419" : "#DDD"} 
                style={styles.star}
              />
            </Animated.View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={onExit} style={[styles.button, styles.exitButton]}>
            <Text style={styles.exitButtonText}>목록으로</Text>
          </Pressable>
          
          <Pressable onPress={onNext} style={[styles.button, styles.nextButton]}>
            <Text style={styles.nextButtonText}>
              {isLast ? "완료" : "다음 단계"}
            </Text>
            {!isLast && <Ionicons name="arrow-forward" size={18} color="#FFF" />}
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 35,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333',
    marginBottom: 25,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 35,
    height: 60,
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  exitButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  exitButtonText: {
    color: '#495057',
    fontWeight: '700',
    fontSize: 17,
  },
  nextButton: {
    backgroundColor: '#333',
  },
  nextButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 17,
  },
});

export default WinModal; 