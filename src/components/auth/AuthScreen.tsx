import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuth';
import { supabase } from '@/db/client/supabase';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { useTranslation } from '@/i18n';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AuthMethod = 'selection' | 'email';

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('selection');
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

  const handleSelectEmail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAuthMethod('email');
  };

  const handleSelectGoogle = () => {
    // TODO: Implement Google auth
    console.log('Google auth selected');
  };

  const handleBackToSelection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAuthMethod('selection');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
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

  const renderMethodSelection = () => (
    <View style={styles.methodSelection}>
      <TouchableOpacity
        style={styles.methodButton}
        onPress={handleSelectEmail}
        activeOpacity={0.7}
      >
        <View style={styles.methodIconContainer}>
          <Ionicons name="mail-outline" size={24} color="#1A1A1A" />
        </View>
        <Text style={styles.methodButtonText}>{t.auth.continueWithEmail}</Text>
        <Ionicons name="chevron-forward" size={20} color="#999999" />
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>{t.auth.or}</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity
        style={styles.methodButton}
        onPress={handleSelectGoogle}
        activeOpacity={0.7}
      >
        <View style={styles.methodIconContainer}>
          <Ionicons name="logo-google" size={24} color="#4285F4" />
        </View>
        <Text style={styles.methodButtonText}>{t.auth.continueWithGoogle}</Text>
        <Ionicons name="chevron-forward" size={20} color="#999999" />
      </TouchableOpacity>
    </View>
  );

  const renderEmailForm = () => (
    <View style={styles.form}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToSelection}>
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>

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
  );

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
            {authMethod === 'selection'
              ? t.auth.chooseMethod
              : isLogin
                ? t.auth.welcomeBack
                : t.auth.createAccount}
          </Text>
        </View>

        {authMethod === 'selection' ? renderMethodSelection() : renderEmailForm()}
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
  methodSelection: {
    width: '100%',
    gap: 16,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  methodIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  backButton: {
    marginBottom: 8,
    alignSelf: 'flex-start',
    padding: 4,
  },
});
