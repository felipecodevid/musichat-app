import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

export const AuthInput = ({ label, icon, style, ...props }: AuthInputProps) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#A0A0A0"
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    height: '100%',
  },
});
