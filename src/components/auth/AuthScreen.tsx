import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuth';
import { supabase } from '@/db/client/supabase';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { useTranslation } from '@/i18n';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setGlobalUserId = useAuthStore((state) => state.setUserId);

  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLogin(!isLogin);
  };

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t.common.error, t.auth.fillAllFields);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert(t.common.error, t.auth.passwordsDoNotMatch);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setGlobalUserId(data.user.id);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setGlobalUserId(data.user.id);
          Alert.alert(t.auth.success, t.auth.accountCreated);

          if (!data.session) {
            setIsLogin(true);
          }
        }
      }
    } catch (error: any) {
      Alert.alert(t.common.error, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={require('../../../assets/icon.png')} style={styles.icon} />
          <Text style={styles.title}>MusiChat</Text>
          <Text style={styles.subtitle}>
            {isLogin ? t.auth.welcomeBack : t.auth.createAccount}
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label={t.auth.email}
            icon="mail-outline"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AuthInput
            label={t.auth.password}
            icon="lock-closed-outline"
            placeholder={t.auth.passwordPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <AuthInput
              label={t.auth.confirmPassword}
              icon="lock-closed-outline"
              placeholder={t.auth.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <AuthButton
            title={isLogin ? t.auth.signIn : t.auth.signUp}
            onPress={handleAuth}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? t.auth.noAccount : t.auth.hasAccount}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.linkText}>
                {isLogin ? t.auth.signUp : t.auth.signIn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  form: {
    width: '100%',
    gap: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  linkText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
