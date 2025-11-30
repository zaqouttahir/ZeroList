import { supabase } from '@/src/utils/supabase';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Container } from '@/src/components/Container';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/src/components/EmptyState';
import Loader from '@/src/components/Loader';

export default function HomeScreen() {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(false);
  const [loading, setLoading] = useState(true);

  const progress = useSharedValue(0);

  useEffect(() => {
    const total = todos?.length || 0;
    const percentage = total === 0 ? 0 : (completedTasks / total) * 100;
    progress.value = withTiming(percentage, { duration: 500 });
  }, [completedTasks, todos]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('inserted_at', { ascending: false });
      if (error) {
        console.log({ error });
      } else {
        setTodos(data);
        setCompletedTasks(data.filter((todo) => todo.is_complete).length);
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) {
      return;
    }
    if (todos?.some((todo) => todo.task === newTask)) {
      Alert.alert('Task already exists');
      return;
    }
    if (newTask.trim().length < 4) {
      Alert.alert('Task must be at least 4 characters long');
      return;
    }
    const { data, error } = await supabase
      .from('todos')
      .insert({
        task: newTask,
        is_complete: false,
      })
      .select()
      .single();
    if (error) {
      console.log({ error });
    } else {
      setNewTask('');
      setTodos((prevTodos) => [data, ...prevTodos]);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <SafeAreaView className="flex-1 px-4 py-3" edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <View className="gap-5 px-4">
            <View className="flex-row items-center gap-4">
              <LinearGradient
                colors={['#ef3345', '#f472b6']}
                className="p-2"
                style={{
                  borderRadius: 8,
                }}>
                <Ionicons name="flash-outline" size={40} color="white" />
              </LinearGradient>
              <View className="gap-2">
                <Text className=" text-4xl font-semibold text-white">Today's Tasks 👀</Text>
                <Text className=" text-lg  text-gray-500">
                  {completedTasks} of {todos?.length} completed
                </Text>
              </View>
            </View>
            <View className=" flex-row items-center gap-4">
              {/* progress bar */}
              <View className="h-3 flex-1 flex-row items-center overflow-hidden rounded-full bg-gray-400">
                <Animated.View className=" h-full bg-emerald-600" style={animatedStyle} />
              </View>
              <Text className="text-lg font-semibold text-emerald-600">
                {(todos?.length ? (completedTasks / todos.length) * 100 : 0).toFixed(0)}%
              </Text>
            </View>
            <View className="flex-row items-center gap-4">
              <TextInput
                placeholder="Add a task"
                placeholderTextColor="gray"
                className="flex-1 rounded-2xl border border-gray-600 p-4 text-base text-white"
                autoCapitalize="none"
                value={newTask}
                onChangeText={setNewTask}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!newTask.trim()}
                onPress={addTask}
                className={`items-center justify-center rounded-full p-4 ${newTask.trim() ? 'bg-emerald-600' : 'bg-gray-600'}`}>
                <Ionicons name="add" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            className="my-8"
            style={{ flex: 1 }}
            contentContainerClassName="px-4 gap-4"
            keyboardShouldPersistTaps="handled"
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                setTodos={setTodos}
                setCompletedTasks={setCompletedTasks}
                editTask={editTask}
                setEditTask={setEditTask}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyState}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
}
// TODO:: handle progress bar and number of completed tasks
const TodoItem = ({
  todo,
  setTodos,
  setCompletedTasks,
  editTask,
  setEditTask,
}: {
  todo: any;
  setTodos: any;
  setCompletedTasks: any;
  editTask: boolean;
  setEditTask: (value: boolean) => void;
}) => {
  const [isCompleted, setIsCompleted] = useState(todo.is_complete);
  const [edit, setEdit] = useState(false);
  const [task, setTask] = useState(todo.task);

  const toggleComplete = async () => {
    const { data, error } = await supabase
      .from('todos')
      .update({ is_complete: !isCompleted })
      .eq('id', todo.id)
      .select()
      .single();
    if (error) {
      console.log({ error });
    } else {
      setIsCompleted(data.is_complete);
      setCompletedTasks((prev) => (data.is_complete ? prev + 1 : prev > 0 ? prev - 1 : 0));
    }
  };

  const deleteTodo = async () => {
    Alert.alert('Delete', 'Are you sure you want to delete this todo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          const { data, error } = await supabase
            .from('todos')
            .delete()
            .eq('id', todo.id)
            .select()
            .single();
          if (error) {
            console.log({ error });
          } else {
            console.log({ data });
            setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const updateTodo = async () => {
    if (!task.trim()) {
      return;
    }
    try {
      const { error } = await supabase
        .from('todos')
        .update({ task, is_complete: false })
        .eq('id', todo.id);
      if (error) {
        console.log({ error });
      } else {
        setEdit((prev) => !prev);
        setTask(task);
        setIsCompleted(false);
        setCompletedTasks((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setEditTask(false);
    }
  };

  return (
    <View className="flex-row gap-5 rounded-2xl border border-gray-600 p-4">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleComplete}
        className={`size-6 rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-gray-600'}`}
      />
      <View className="flex-1 gap-3">
        {edit ? (
          <TextInput
            placeholder="Edit task"
            placeholderTextColor="gray"
            className="flex-1 rounded-2xl border border-gray-600 p-4 text-base text-white"
            autoCapitalize="none"
            value={task}
            onChangeText={setTask}
          />
        ) : (
          <Text className="text-lg font-semibold text-white">{task}</Text>
        )}
        <View className="flex-row gap-5">
          {edit ? (
            <>
              <TouchableOpacity onPress={updateTodo} disabled={!task.trim()}>
                <Ionicons name="checkmark-circle-outline" size={30} color="#059669" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEdit((prev) => !prev);
                  setEditTask(false);
                }}>
                <Ionicons name="close-circle-outline" size={30} color="#ef3345" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={deleteTodo}>
                <Ionicons name="trash-outline" size={22} color="#ef3345" />
              </TouchableOpacity>
              {!editTask && (
                <TouchableOpacity
                  onPress={() => {
                    setEdit((prev) => !prev);
                    setEditTask(true);
                  }}>
                  <MaterialCommunityIcons name="circle-edit-outline" size={24} color="yellow" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};
