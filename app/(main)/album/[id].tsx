import { View, StyleSheet, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ChatListItem } from '@/components/chat/ChatListItem';
import { useSongs } from '@/hooks/useSongs';
import { useDeleteSong } from '@/hooks/useDeleteSong';
import { useAuthStore } from '@/store/useAuth';
import { useCallback } from 'react';
import { useTranslation } from '@/i18n';

export default function AlbumChatList() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams<{ id: string, title: string }>();
  const userId = useAuthStore((state) => state.userId);
  const { t } = useTranslation();
  const { deleteSong } = useDeleteSong();

  const { items: chats, refresh } = useSongs(userId || '', id);

  // Refresh list when screen comes into focus (e.g. after creating a song)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [id])
  );

  // Handle long press to show edit/delete menu
  const handleLongPress = (item: { id: string; name: string; description: string | null }) => {
    Alert.alert(
      item.name,
      undefined,
      [
        {
          text: t.common.edit,
          onPress: () => {
            router.push({
              pathname: '/(main)/album/edit-song',
              params: {
                songId: item.id,
                songName: item.name,
                songDescription: item.description || '',
                albumId: id,
                albumTitle: title
              }
            });
          },
        },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t.albumChatList.deleteChatTitle,
              t.albumChatList.deleteChatConfirm.replace('%{name}', item.name),
              [
                {
                  text: t.common.cancel,
                  style: 'cancel',
                },
                {
                  text: t.common.delete,
                  style: 'destructive',
                  onPress: async () => {
                    const success = await deleteSong(item.id);
                    if (success) {
                      refresh();
                    } else {
                      Alert.alert(t.common.error, t.albumChatList.deleteError);
                    }
                  },
                },
              ]
            );
          },
        },
        {
          text: t.common.cancel,
          style: 'cancel',
        },
      ]
    );
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Parse tags from JSON string
  const parseTags = (tagsJson: string | null): string[] => {
    if (!tagsJson) return [];
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [];
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>{title || t.common.albums}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>{t.albumChatList.title}</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({
            pathname: '/(main)/album/create-song',
            params: { albumId: id, albumTitle: title }
          })}
        >
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#c7c7cc" />
          <Text style={styles.emptyText}>{t.albumChatList.emptyTitle}</Text>
          <Text style={styles.emptySubtext}>{t.albumChatList.emptySubtitle}</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              name={item.name}
              lastMessage={item.description || t.albumChatList.noMessagesYet}
              timestamp={formatTimestamp(item.updatedAt)}
              unreadCount={0}
              tags={parseTags(item.tags)}
              onPress={() => router.push({
                pathname: '/(main)/chat/[id]',
                params: { id: item.id }
              })}
              onLongPress={() => handleLongPress(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push({
          pathname: '/(main)/album/create-song',
          params: { albumId: id, albumTitle: title }
        })}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3c3c43',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#8e8e93',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
