import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCreateSong } from '@/hooks/useCreateSong';

export default function CreateSong() {
  const router = useRouter();
  const { albumId, albumTitle } = useLocalSearchParams<{ albumId: string, albumTitle: string }>();
  const { createSong, isLoading, error } = useCreateSong();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const [tagInput, setTagInput] = useState('');
  // const [tags, setTags] = useState<string[]>([]);

  // const handleAddTag = () => {
  //   if (tagInput.trim()) {
  //     setTags([...tags, tagInput.trim()]);
  //     setTagInput('');
  //   }
  // };

  // const removeTag = (indexToRemove: number) => {
  //   setTags(tags.filter((_, index) => index !== indexToRemove));
  // };

  const handleCreate = async () => {
    if (!albumId) {
      Alert.alert('Error', 'Album ID is missing');
      return;
    }

    const id = await createSong({ 
      albumId,
      name, 
      description: description || undefined 
    });
    
    if (id) {
      router.back();
    } else if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Chat</Text>
        <TouchableOpacity onPress={handleCreate} style={styles.headerBtn} disabled={!name || isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={[styles.doneText, !name && styles.disabledText]}>Done</Text>
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
              Adding to <Text style={styles.albumName}>{albumTitle || 'Album'}</Text>
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Chat Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Verse Ideas, Feedback Request"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's this chat about?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          {/* Tags Section - Hidden for now */}
          {/* <View style={styles.formGroup}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag..."
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={handleAddTag} disabled={!tagInput.trim()} style={styles.addTagButton}>
                <Ionicons name="add-circle" size={28} color={tagInput.trim() ? "#007AFF" : "#ccc"} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(index)} hitSlop={8}>
                     <Ionicons name="close-circle" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View> */}
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
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  addTagButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#444',
  },
});
