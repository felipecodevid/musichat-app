import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '@/db/client/sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/sqlite/migrations';
import { MessagesService } from '@/services/messages-service/messages-service';
import { useMessages } from '@/hooks/useMessages';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuth';
import { useRouter } from 'expo-router';
import { supabase } from '@/db/client/supabase';

export default function Main() {
  const router = useRouter();
  const { error } = useMigrations(db, migrations);
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);

  const { items, refresh, sync } = useMessages(userId ?? '')

  const [message, setMessage] = useState("")

  const handleLogout = () => {
    supabase.auth.signOut()
    logout();
    router.replace('/');
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Button title="Sign Out" onPress={handleLogout} color="#FF3B30" />
      </View>

      <TextInput 
        style={styles.input} 
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
      />
      <Button title="Create message" onPress={async () => {
        try {
          if (!userId) {
            console.error("No user ID found")
            return
          }
          const messagesService = new MessagesService(userId)
  
          await messagesService.addMessage(message)
          setMessage(""); // Clear input
          await sync()
        } catch (error) {
          console.log(error)
        }
      }}></Button>

      <View style={styles.spacer} />
      <Button title="Sync & Refresh" onPress={sync} />

      <View style={styles.list}>
        {items.map((item) => (
          <Text key={item.id} style={styles.item}>{item.content}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
  list: {
    marginTop: 20,
    gap: 8,
  },
  item: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  }
});
