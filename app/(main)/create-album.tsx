import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCreateAlbum } from '@/hooks/useCreateAlbum';

export default function CreateAlbum() {
  const router = useRouter();
  const { createAlbum, isLoading, error } = useCreateAlbum();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // const [tagInput, setTagInput] = useState('');
  // const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);

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
    const id = await createAlbum({ 
      name: title, 
      description: description || undefined 
    });
    
    if (id) {
      router.back();
    } else if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleImagePick = () => {
    // Mock image picker
    setCoverImage('https://placehold.co/400/orange/white?text=New+Album');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Album</Text>
        <TouchableOpacity onPress={handleCreate} style={styles.headerBtn} disabled={!title || isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={[styles.doneText, !title && styles.disabledText]}>Done</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Cover Image Section */}
          <View style={styles.imageSection}>
            <TouchableOpacity style={styles.imagePlaceholder} onPress={handleImagePick} activeOpacity={0.8}>
              {coverImage ? (
                <Image source={{ uri: coverImage }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.placeholderContent}>
                  <Ionicons name="camera" size={40} color="#007AFF" />
                  <Text style={styles.uploadText}>Add Cover Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Album Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Summer Vibes"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's this album about?"
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80, // Circular
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
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
