import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ProgressStatProps {
  txt: string;
  number: number;
  icon: string;
  color: string;
}
export default function ProgressStat({ txt, number, icon, color }: ProgressStatProps) {
  return (
    <View
      className="flex-row items-center gap-6 rounded-lg border-s-4 bg-slate-800 px-2 py-3"
      style={{ borderColor: color }}>
      <View className="p-2">
        <Ionicons name={icon} size={34} color={color} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-2xl font-bold text-white">{number}</Text>
        <Text className="text-lg font-medium text-gray-500">{txt}</Text>
      </View>
    </View>
  );
}
