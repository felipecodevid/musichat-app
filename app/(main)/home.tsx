import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/useAuth';
import { supabase } from '@/db/client/supabase';
import { useRouter } from 'expo-router';
import { AlbumCard } from '@/components/albums/AlbumCard';
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlbums } from '@/hooks/useAlbums';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { syncAll } from '@/db/sync';
import { useTranslation } from '@/i18n';

export default function Main() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const userId = useAuthStore((state) => state.userId);
  const { items: albums, refresh } = useAlbums(userId || '');
  const { t } = useTranslation();

  // Sync data and refresh UI when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        console.log("Running sync all for: ", userId)
        // Sync with server when app comes to foreground
        syncAll(userId)
          .then(() => refresh())
          .catch(console.error);
      }
    }, [userId])
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.home.title}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {albums.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="musical-notes" size={48} color="#fff" />
          </View>
          <Text style={styles.emptyTitle}>{t.home.emptyTitle}</Text>
          <Text style={styles.emptySubtitle}>
            {t.home.emptySubtitle}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(main)/create-album')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.emptyButtonText}>{t.home.createAlbum}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlbumCard
              title={item.name}
              description={item.description || ''}
              coverImage={undefined}
              tags={item.tags ? JSON.parse(item.tags) : []}
              onPress={() => {
                router.push({
                  pathname: '/(main)/album/[id]',
                  params: {
                    id: item.id,
                    title: item.name,
                    coverImage: '',
                    description: item.description || ''
                  }
                });
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/(main)/create-album')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },
  logoutButton: {
    padding: 8,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Space for FAB
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // iOS Blue or Brand Color
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
