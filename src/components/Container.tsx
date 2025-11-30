import { LinearGradient } from 'expo-linear-gradient';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient colors={['#191E3B', '#191E3B']} style={{ flex: 1 }}>
      {children}
    </LinearGradient>
  );
};
