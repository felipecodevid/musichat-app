import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEditSong } from '@/hooks/useEditSong';
import { useSongs } from '@/hooks/useSongs';
import { useAuthStore } from '@/store/useAuth';
import { useTranslation } from '@/i18n';

export default function EditSong() {
  const router = useRouter();
  const { songId, songName, songDescription, albumId, albumTitle } = useLocalSearchParams<{
    songId: string;
    songName: string;
    songDescription?: string;
    albumId: string;
    albumTitle: string;
  }>();
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.userId);
  const { editSong, isLoading, error } = useEditSong();
  const { refresh } = useSongs(userId || '', albumId);

  // Initialize form with existing song data
  const [name, setName] = useState(songName || '');
  const [description, setDescription] = useState(songDescription || '');

  const handleSave = async () => {
    if (!songId) {
      Alert.alert(t.common.error, t.editSong.errorSongIdMissing);
      return;
    }

    const success = await editSong({
      songId,
      name,
      description: description || undefined,
    });

    if (success) {
      await refresh();
      router.back();
    } else if (error) {
      Alert.alert(t.common.error, error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.cancelText}>{t.common.cancel}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.editSong.title}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn} disabled={!name || isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={[styles.doneText, !name && styles.disabledText]}>{t.common.done}</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Album Context */}
          <View style={styles.albumContext}>
            <Ionicons name="disc-outline" size={20} color="#8e8e93" />
            <Text style={styles.albumContextText}>
              {t.editSong.editingIn} <Text style={styles.albumName}>{albumTitle || t.createSong.album}</Text>
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.createSong.chatName}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.createSong.chatNamePlaceholder}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t.createSong.description}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t.createSong.descriptionPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerBtn: {
    padding: 4,
    minWidth: 60,
  },
  cancelText: {
    fontSize: 17,
    color: '#007AFF',
  },
  doneText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'right',
  },
  disabledText: {
    color: '#ccc',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  albumContext: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
    gap: 8,
  },
  albumContextText: {
    fontSize: 14,
    color: '#8e8e93',
  },
  albumName: {
    fontWeight: '600',
    color: '#3c3c43',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    minHeight: 100,
  },
});
