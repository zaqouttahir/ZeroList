import { Container } from '@/src/components/Container';
import Loader from '@/src/components/Loader';
import ProgressStat from '@/src/components/ProgressStat';
import { supabase } from '@/src/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [totalTodos, setTotalTodos] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);
  const [pendingTodos, setPendingTodos] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('is_complete')
        .order('inserted_at', { ascending: false });
      if (error) {
        console.log({ error });
      } else {
        setTotalTodos(data.length);
        setCompletedTodos(data.filter((todo) => todo.is_complete).length);
        setPendingTodos(data.filter((todo) => !todo.is_complete).length);
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const deleteAllTodos = async () => {
    Alert.alert('Delete All Todos', 'Are you sure you want to delete all todos?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          setLoading(true);
          try {
            const { error } = await supabase.from('todos').delete().gt('id', 0);
            if (error) {
              console.log({ error });
              setLoading(false);
            } else {
              setTotalTodos(0);
              setCompletedTodos(0);
              setPendingTodos(0);
            }
          } catch (error) {
            console.log({ error });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <SafeAreaView className="flex-1 gap-5  px-8 py-5" edges={['top']}>
        <View className="flex-row gap-4">
          <LinearGradient
            colors={['#ef3345', '#f472b6']}
            className="p-2"
            style={{
              borderRadius: 8,
            }}>
            <Ionicons name="settings-sharp" size={40} color="white" />
          </LinearGradient>
          <View className="gap-2">
            <Text className=" text-4xl font-semibold text-white">Settings</Text>
          </View>
        </View>

        <ScrollView className=" flex-1" showsVerticalScrollIndicator={false}>
          {/* progress stats */}
          <View className="gap-5 rounded-lg  p-2">
            <Text className="text-xl font-semibold text-white">Progress Stats</Text>

            <View className="gap-3">
              <ProgressStat txt="Total Todos" number={totalTodos} icon="list" color="#4E71FF" />
              <ProgressStat
                txt="Completed Todos"
                number={completedTodos}
                icon="checkmark-circle"
                color="#10b981"
              />
              <ProgressStat
                txt="Pending Todos"
                number={pendingTodos}
                icon="hourglass"
                color="#f59e0b"
              />
            </View>
          </View>
          {/* preferences */}
          <View className="gap-5 rounded-lg p-2">
            <Text className="text-xl font-semibold text-white">Preferences</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between bg-slate-800 px-2 py-3">
                <View className="flex-row items-center gap-6">
                  <View className="rounded-lg bg-[#4E71FF] p-2">
                    <Ionicons name="moon-outline" size={24} color="white" />
                  </View>
                  <Text className="text-lg font-semibold text-white">Dark Mode</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#767577', true: '#4E71FF' }}
                  thumbColor={'#fff'}
                  ios_backgroundColor={'#4E71FF'}
                />
              </View>
              <View className="flex-row items-center justify-between bg-slate-800 px-2 py-3">
                <View className="flex-row items-center gap-6">
                  <View className="rounded-lg bg-[#10b981] p-2">
                    <Ionicons name="notifications-outline" size={24} color="white" />
                  </View>
                  <Text className="text-lg font-semibold text-white">Notifications</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: '#767577', true: '#10b981' }}
                  thumbColor={'#fff'}
                  ios_backgroundColor={'#10b981'}
                />
              </View>
              <View className="flex-row items-center justify-between bg-slate-800 px-2 py-3">
                <View className="flex-row items-center gap-6">
                  <View className="rounded-lg bg-[#f59e0b] p-2">
                    <Ionicons name="sync-outline" size={24} color="white" />
                  </View>
                  <Text className="text-lg font-semibold text-white">Auto Sync</Text>
                </View>
                <Switch
                  value={autoSync}
                  onValueChange={setAutoSync}
                  trackColor={{ false: '#767577', true: '#f59e0b' }}
                  thumbColor={'#fff'}
                  ios_backgroundColor={'#f59e0b'}
                />
              </View>
            </View>
            {/* */}
          </View>
          {/* danger zone */}
          <View className="mb-4 mt-5 rounded-lg bg-slate-800 p-2">
            <Text className="text-xl font-semibold text-white">Danger Zone</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={deleteAllTodos}
              className="mt-5 flex-row items-center gap-2">
              <Ionicons name="warning-outline" size={28} color="#ef4444" />
              <Text className="text-lg font-semibold text-red-500">Delete All Todos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
}
