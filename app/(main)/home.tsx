import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/useAuth';
import { supabase } from '@/db/client/supabase';
import { useRouter } from 'expo-router';
import { AlbumCard } from '@/components/albums/AlbumCard';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
const MOCK_ALBUMS = [
  {
    id: '1',
    title: 'Summer Vibes 2024',
    description: 'A collection of upbeat tracks for the sunny days ahead.',
    coverImage: 'https://placehold.co/200/orange/white?text=Summer',
    tags: ['Pop', 'Summer', 'Roadtrip']
  },
  {
    id: '2',
    title: 'Coding Focus',
    description: 'Deep work instrumentals to get in the zone and ship code.',
    coverImage: 'https://placehold.co/200/333333/white?text=Focus',
    tags: ['Electronic', 'Instrumental', 'Work']
  },
  {
    id: '3',
    title: 'Late Night Jazz',
    description: 'Smooth jazz for relaxing evenings with a glass of wine.',
    coverImage: 'https://placehold.co/200/4a148c/white?text=Jazz',
    tags: ['Jazz', 'Relax', 'Night']
  },
  {
    id: '4',
    title: 'Gym Pump',
    description: 'High energy beats to crush your workout.',
    coverImage: 'https://placehold.co/200/d32f2f/white?text=Gym',
    tags: ['Rock', 'Workout', 'Energy']
  }
];

export default function Main() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Albums</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_ALBUMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlbumCard
            title={item.title}
            description={item.description}
            coverImage={item.coverImage}
            tags={item.tags}
            onPress={() => {
              router.push({
                pathname: '/(main)/album/[id]',
                params: { 
                  id: item.id,
                  title: item.title,
                  coverImage: item.coverImage,
                  description: item.description
                }
              });
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
