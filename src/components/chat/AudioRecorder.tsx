import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AudioRecorderProps {
  onCancel: () => void;
  onSend: () => void;
  translateX?: Animated.Value;
  isLocked?: boolean;
}

export default function AudioRecorder({ onCancel, onSend, translateX, isLocked }: AudioRecorderProps) {
  const [duration, setDuration] = useState(0);
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Pulse animation for the recording indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const caps = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${caps}:${secs.toString().padStart(2, '0')}`;
  };

  const slideStyle = translateX ? {
    opacity: translateX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    }),
    transform: [{
        translateX: translateX.interpolate({
            inputRange: [-100, 0],
            outputRange: [-20, 0], 
            extrapolate: 'clamp',
        })
    }]
  } : {};

  if (isLocked) {
      return (
        <View style={[
            styles.container, 
            { 
                height: 'auto', 
                minHeight: 120, 
                alignItems: 'flex-end', 
                paddingBottom: 16,
                paddingHorizontal: 16,
                backgroundColor: '#f5f5f5',
                borderRadius: 24,
                marginHorizontal: 10,
                marginBottom: 10,
            }
        ]}> 
            <View style={{ alignItems: 'center', gap: 12 }}>
                 <Text style={[styles.timerText, { fontSize: 24, marginLeft: 0 }]}>{formatTime(duration)}</Text>
                 <TouchableOpacity onPress={onCancel} style={{ padding: 8 }}>
                     <Ionicons name="trash-outline" size={32} color="#FF3B30" />
                 </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={onSend} 
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 24, 
                backgroundColor: '#007AFF', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 4
              }}
            >
                <Ionicons name="arrow-up" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.centerContainer, slideStyle]}>
         <Ionicons name="chevron-back" size={20} color="#8E8E93" />
         <Text style={styles.cancelText}>Swipe to cancel</Text>
      </Animated.View>

      <View style={styles.leftContainer}>
        <Animated.View style={{ opacity: pulseAnim }}>
            <Ionicons name="mic" size={20} color="#FF3B30" />
        </Animated.View>
        <Text style={styles.timerText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0, // Parent handles padding if needed, or keep 0
    height: 40, // Match typical input height roughly, parent has padding
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#000',
    fontVariant: ['tabular-nums'],
    marginLeft: 10,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to left/start
    opacity: 0.5,
  },
  cancelText: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 4,
  },
});
