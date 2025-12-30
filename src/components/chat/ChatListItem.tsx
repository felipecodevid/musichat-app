import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  avatarUrl?: string; // Optional, can use placeholder
  unreadCount?: number;
  tags?: string[];
  onPress?: () => void;
}

export function ChatListItem({ name, lastMessage, timestamp, avatarUrl, unreadCount, tags, onPress }: ChatListItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <Image 
        source={{ uri: avatarUrl || 'https://placehold.co/100/png?text=C' }} 
        style={styles.avatar} 
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{name}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage}
          </Text>
          {unreadCount && unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>

        {tags && tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#e1e4e8',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6c757d',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#25D366', // WhatsApp Green
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  tag: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#54656f',
  }
});
