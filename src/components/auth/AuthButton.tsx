import { Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export const AuthButton = ({ title, loading, style, ...props }: AuthButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.button, loading && styles.buttonDisabled, style]} 
      activeOpacity={0.8}
      disabled={loading || props.disabled}
      {...props}
    >
      <Text style={styles.buttonText}>
        {loading ? 'Please wait...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
