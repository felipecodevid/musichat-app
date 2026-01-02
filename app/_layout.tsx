import { Stack, useRouter, useSegments } from 'expo-router';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '@/db/client/sqlite';
import migrations from '@/db/migrations/sqlite/migrations';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { I18nProvider } from '@/i18n';
import { useEffect, useState } from 'react';
import { supabase } from '@/db/client/supabase';
import { useAuthStore } from '@/store/useAuth';
import { registerBackgroundSync } from './background';

// Import background module to ensure TaskManager.defineTask runs at startup
import './background';

function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Image source={require('../assets/icon.png')} style={styles.icon} />
      <ActivityIndicator size="large" color="#000000" style={styles.loader} />
    </View>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const setGlobalUserId = useAuthStore((state) => state.setUserId);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setGlobalUserId(session.user.id);
        await registerBackgroundSync();
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setGlobalUserId(session.user.id);
        await registerBackgroundSync();
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady || isAuthenticated === null) return;

    const inAuthGroup = segments[0] === '(main)';

    if (isAuthenticated && !inAuthGroup) {
      router.replace('/(main)/home');
    } else if (!isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isReady, isAuthenticated, segments]);

  if (!isReady) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <SplashScreen />;
  }

  if (!success) {
    return <SplashScreen />;
  }

  console.log('SQLite migrations applied');

  return (
    <I18nProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="(main)" options={{ animation: 'none' }} />
        </Stack>
      </AuthGate>
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 24,
  },
  loader: {
    marginTop: 24,
  },
});
