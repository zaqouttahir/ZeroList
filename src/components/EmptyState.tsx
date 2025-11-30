import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export default function EmptyState() {
  return (
    <View className="mt-10 flex-1 items-center justify-center">
      <View className="flex-1 items-center justify-center">
        <Ionicons name="clipboard-outline" size={60} color="gray" />
      </View>
      <View className="mt-4">
        <Text className="text-center text-lg font-semibold text-gray-500">No todos yet!</Text>
        <Text className="text-center text-lg font-semibold text-gray-500">
          Add your first todo above to get started
        </Text>
      </View>
    </View>
  );
}
