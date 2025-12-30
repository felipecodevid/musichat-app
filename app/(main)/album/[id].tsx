import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ChatListItem } from '@/components/chat/ChatListItem';

// Mock Chats Generator
const generateChats = (albumId: string) => {
  return Array.from({ length: 15 }).map((_, i) => ({
    id: `${albumId}-chat-${i + 1}`,
    name: `User ${i + 1}`,
    lastMessage: i % 2 === 0 ? 'Hey, what do you think about this track?' : 'This beat is absolutely fire! 🔥',
    timestamp: '10:30 AM',
    unreadCount: i % 3 === 0 ? 2 : 0,
    avatarUrl: `https://placehold.co/100/purple/white?text=${String.fromCharCode(65 + i)}`,
    tags: i % 2 === 0 ? ['Feedback', 'Vibe'] : ['General']
  }));
};

export default function AlbumChatList() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams<{ id: string, title: string }>();
  
  const chats = generateChats(id);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>{title || 'Albums'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.actionButton}>
             <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            name={item.name}
            lastMessage={item.lastMessage}
            timestamp={item.timestamp}
            unreadCount={item.unreadCount}
            avatarUrl={item.avatarUrl}
            tags={item.tags}
            onPress={() => console.log('Chat pressed', item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
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
    backgroundColor: '#f6f6f6', // Light gray iOS style header
  },
  headerRow: {
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
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
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1, 
  },
  actionButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c6c6c8',
    marginLeft: 82, // Align with text start (Avatar width + margins)
  },
});
