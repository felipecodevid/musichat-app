import { useState, useRef, useEffect } from 'react';
import { Alert, Animated, PanResponder, PanResponderGestureState, GestureResponderEvent } from 'react-native';
import { Audio } from 'expo-av';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  // Refs to track state inside PanResponder callbacks preventing stale closures
  const isLockedRef = useRef(false);
  const isRecordingRef = useRef(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartTime = useRef<number | null>(null);

  const pan = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  // Sync state with refs
  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permission to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      recordingStartTime.current = Date.now();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const cancelRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
    } catch (e) {
      console.error("Error stopping recording during cancel", e);
    }

    setIsRecording(false);
    setIsLocked(false);
    recordingStartTime.current = null;
    pan.setValue(0);
    panY.setValue(0);
  };

  const stopRecording = async () => {
    if (!recordingStartTime.current) return;

    // If locked, we don't stop on release. 
    if (isLockedRef.current) return;

    await forceStopRecording();
  };

  const forceStopRecording = async () => {
    if (!recordingStartTime.current) return;

    const duration = Date.now() - recordingStartTime.current;

    if (duration < 1000) {
      // Too short
      await cancelRecording();
      return;
    }

    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        if (uri) {
          console.log('Recording stopped and stored at', uri);
          setRecordedUri(uri);
          Alert.alert("Recorded!", "Audio saved to state.");
        }
        recordingRef.current = null;
      }
    } catch (error) {
      console.error("Error stopping recording", error);
    }

    setIsRecording(false);
    setIsLocked(false);
    recordingStartTime.current = null;
    pan.setValue(0);
    panY.setValue(0);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startRecording();
      },
      onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const locked = isLockedRef.current;

        // Handle Horizontal Slide (Cancel)
        if (gestureState.dx < 0 && !locked) {
          pan.setValue(gestureState.dx);
        }

        // Handle Vertical Slide (Lock)
        if (gestureState.dy < 0 && !locked) {
          panY.setValue(gestureState.dy);
          if (gestureState.dy < -50) {
            setIsLocked(true);
            panY.setValue(0); // Reset visual offset
            pan.setValue(0);
          }
        }
      },
      onPanResponderRelease: async (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const locked = isLockedRef.current;

        if (locked) {
          return;
        }

        if (gestureState.dx < -100) {
          await cancelRecording();
        } else {
          await stopRecording();
        }

        Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
      },
      onPanResponderTerminate: () => cancelRecording(),
    })
  ).current;

  return {
    isRecording,
    isLocked,
    recordedUri,
    pan,
    panY,
    cancelRecording,
    forceStopRecording,
    panResponder
  };
};
