import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { db, schema } from '@/db/client/sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/sqlite/migrations';

export default function App() {
  return (
    <Main />
  );
}

function Main() {
  const { success, error } = useMigrations(db, migrations);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!success) {
      return
    }

    const fetchUsers = async () => {
      console.log('fetching users');
      const users = await db.query.users.findMany();
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
      <Button title="Add user" onPress={() => {
        db.insert(schema.users).values({ name: 'John Doe', email: 'john.doe@example.com' }).then(() => {
          console.log('user added');
        });
      }} />
      <Button title="Get users" onPress={async () => {
        setLoading(true);
        const users = await db.query.users.findMany();
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
});
