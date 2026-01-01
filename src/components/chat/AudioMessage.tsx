import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

interface AudioMessageProps {
  uri: string;
  tintColor?: string; // To adapt to sender/receiver bubble styles
}

export default function AudioMessage({ uri, tintColor = '#fff' }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    setIsLoading(true);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
          setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error loading sound", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setPosition(0);
        setIsPlaying(false);
        soundRef.current?.setPositionAsync(0);
      }
    }
  };

  const togglePlayback = async () => {
    if (!soundRef.current) {
      await loadSound();
      return;
    }

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      if (position >= (duration || 0)) {
          await soundRef.current.setPositionAsync(0);
      }
      await soundRef.current.playAsync();
    }
  };

  const formatTime = (millis: number) => {
    if (!millis) return "0:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayback} disabled={isLoading} style={styles.playButton}>
        {isLoading ? (
          <ActivityIndicator color={tintColor} size="small" />
        ) : (
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color={tintColor} 
          />
        )}
      </TouchableOpacity>
      
      <View style={styles.progressContainer}>
         <View style={styles.track}>
            <View 
                style={[
                    styles.thumb, 
                    { 
                        backgroundColor: tintColor,
                        width: duration ? `${(position / duration) * 100}%` : 0 
                    }
                ]} 
            />
         </View>
         <Text style={[styles.durationText, { color: tintColor }]}>
            {isPlaying || position > 0 ? formatTime(position) : (duration ? formatTime(duration) : "")}
         </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150, // Fixed width for audio player bubble
    paddingVertical: 5,
  },
  playButton: {
    marginRight: 10,
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  track: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden' // for the progress bar
  },
  thumb: {
    height: '100%',
    borderRadius: 2,
  },
  durationText: {
    fontSize: 10,
    opacity: 0.8,
  }
});
