import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SongListItemProps {
  trackNumber: number;
  title: string;
  duration: string;
  artist?: string;
  onPress?: () => void;
  isPlaying?: boolean;
}

export function SongListItem({ trackNumber, title, duration, artist, onPress, isPlaying }: SongListItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.container, isPlaying && styles.activeContainer]}>
      <View style={styles.left}>
        {isPlaying ? (
           <Ionicons name="volume-high" size={16} color="#007AFF" style={styles.icon} />
        ) : (
          <Text style={styles.number}>{trackNumber}</Text>
        )}
        <View>
          <Text style={[styles.title, isPlaying && styles.activeText]} numberOfLines={1}>{title}</Text>
          {artist && <Text style={styles.artist} numberOfLines={1}>{artist}</Text>}
        </View>
      </View>
      <Text style={styles.duration}>{duration}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeContainer: {
    backgroundColor: '#f8faff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 24,
    marginRight: 12,
    textAlign: 'center',
  },
  number: {
    fontSize: 14,
    color: '#888',
    width: 24,
    marginRight: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activeText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  artist: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  duration: {
    fontSize: 14,
    color: '#888',
    marginLeft: 12,
  },
});
