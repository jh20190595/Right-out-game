import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InfoModal({ visible, onClose }: InfoModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Ionicons name="sparkles" size={40} color="#FCC419" style={{marginBottom: 15}} />
          <Text style={styles.title}>Rumo</Text>
          <Text style={styles.desc}>
            Rumo는 에스페란토어로 {"\n"}
            <Text style={{fontWeight: '900', color: '#1E293B'}}>'빛나다, 소문나다'</Text>라는 의미를 담고 있습니다.{"\n\n"}
            퍼즐의 모든 불을 끄고{"\n"}당신의 지혜를 빛나게 해보세요.
          </Text>
          
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '80%', backgroundColor: '#FFF', borderRadius: 30, padding: 30, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#1E293B', marginBottom: 15 },
  desc: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 25 },
  closeBtn: { backgroundColor: '#1E293B', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
  closeText: { color: '#FFF', fontWeight: '800' }
});