import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { db, schema } from '@/db/client/sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/sqlite/migrations';
import uuid from 'react-native-uuid';

export default function App() {
  return (
    <Main />
  );
}

function Main() {
  const { success, error } = useMigrations(db, migrations);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!success) {
      return
    }

    const fetchUsers = async () => {
      console.log('fetching users');
      const users = await db.query.messages.findMany();
      console.log('users fetched');
      console.log(users);
      setUsers(users as any);
      setLoading(false);
    };
    fetchUsers();
  }, [success]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <TextInput
        style={styles.input}
        placeholder="Enter content"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Add message" onPress={async () => {
        try {
          console.log("adding message")
          await db.insert(schema.messages).values({ content: content || 'Hello', id: uuid.v4() })
          console.log("message added")
          setContent('');
        } catch (error) {
          console.log(error);
        }
      }} />
      <Button title="Get messages" onPress={async () => {
        setLoading(true);
        const users = await db.query.messages.findMany();
        setUsers(users as any);
        setLoading(false);
      }} />
      <Text>{loading ? 'Loading...' : 'Loaded'}</Text>
      <Text>{JSON.stringify(users, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});
