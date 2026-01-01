import { Stack } from 'expo-router';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '@/db/client/sqlite';
import migrations from '@/db/migrations/sqlite/migrations';
import { Text, View } from 'react-native';

// Import background module to ensure TaskManager.defineTask runs at startup
import './background';

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Running migrations...</Text>
      </View>
    );
  }

  console.log('SQLite migrations applied');

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}
