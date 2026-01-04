import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import AudioMessage from '@/components/chat/AudioMessage';
import AudioRecorder from '@/components/chat/AudioRecorder';

import { useMessages } from '@/hooks/useMessages';
import { useSong } from '@/hooks/useSong';
import { useAuthStore } from '@/store/useAuth';
import { useCreateMessage } from '@/hooks/useCreateMessage';
import { useAudioRecording } from '@/hooks/chat/useAudioRecording';
import { useTranslation } from '@/i18n';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messageText, setMessageText] = useState('');
  const userId = useAuthStore(s => s.userId);
  const { song } = useSong(id, userId || "");
  const { items: messages, refresh, sync } = useMessages(userId || "", id);
  const { createMessage, isLoading: isSending } = useCreateMessage();
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const onRefresh = async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false)
  };

  const handleSendAudio = useCallback(async (uri: string) => {
    console.log("audio uri: ", uri)
    await createMessage({
      songId: id,
      content: t.chat.audioMessage,
      type: 'audio',
      mediaUri: uri
    });

    // Optimistic update: refresh from local SQLite immediately
    await refresh();

    // Sync with server in background (don't await)
    sync();
  }, [id, createMessage, sync, refresh, t.chat.audioMessage]);

  const {
    isRecording,
    isLocked,
    recordedUri,
    pan,
    panY,
    cancelRecording,
    forceStopRecording, // Use this for the 'send' action when locked (or validation before send)
    panResponder
  } = useAudioRecording(handleSendAudio);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    const content = messageText.trim();
    setMessageText(''); // Clear input immediately for snappy UX

    await createMessage({
      songId: id,
      content
    });

    // Optimistic update: refresh from local SQLite immediately
    await refresh();

    // Sync with server in background (don't await)
    sync();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>{t.common.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{song?.name ?? t.chat.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            {item.type === 'audio' && item.mediaUri ? (
              <AudioMessage uri={item.mediaUri} />
            ) : (
              <Text style={styles.messageText}>{item.content}</Text>
            )}
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.inputContainer}>
          {isRecording ? (
            <View style={{ flex: 1 }}>
              <AudioRecorder
                onCancel={cancelRecording}
                onSend={forceStopRecording}
                translateX={pan}
                isLocked={isLocked}
              />
            </View>
          ) : (
            <>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="images-outline" size={24} color="#007AFF" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder={t.chat.messagePlaceholder}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
            </>
          )}

          {messageText.length > 0 ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
              <Ionicons name="arrow-up-circle" size={32} color={isSending ? "#ccc" : "#007AFF"} />
            </TouchableOpacity>
          ) : (
            !isLocked && (
              <Animated.View
                style={[
                  styles.iconButton,
                  isRecording && { transform: [{ scale: 1.2 }] },
                  { transform: [{ translateY: panY }] }
                ]}
                {...panResponder.panHandlers}
              >
                <Ionicons
                  name={isRecording ? "mic" : "mic-outline"}
                  size={24}
                  color={isRecording ? "#FF3B30" : "#007AFF"}
                />
              </Animated.View>
            )
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
    backgroundColor: '#f6f6f6',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    alignSelf: 'flex-end', // Sender side only
    backgroundColor: '#007AFF',
    borderRadius: 20,
    borderBottomRightRadius: 4, // distinct shape for sender
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    backgroundColor: '#f6f6f6',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  iconButton: {
    padding: 4,
  },
  sendButton: {
    padding: 0,
  },
});
