import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Text, Button, Provider as PaperProvider, DarkTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setDate(now.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);
      const difference = nextMidnight - now;

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (input.trim() === '') return;

    if (editId !== null) {
      setTasks(tasks.map(task => (task.id === editId ? { ...task, task: input } : task)));
      setEditId(null);
    } else {
      setTasks([...tasks, { id: tasks.length.toString(), task: input, completed: false }]);
    }

    setInput('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompleted = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const editTask = (id, task) => {
    setEditId(id);
    setInput(task);
  };

  return (
    <PaperProvider theme={DarkTheme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <Text style={{ fontSize: 32, color: 'white' }}>Today</Text>
            <Text style={{ fontSize: 16, color: 'grey' }}>Tasks will reset in {timeLeft}</Text>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleTaskCompleted(item.id)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                    marginHorizontal: 20,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: item.completed ? '#6750a4' : '#333',
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 18, color: 'white' }}>{item.task}</Text>
                  <TouchableOpacity onPress={() => editTask(item.id, item.task)}>
                    <Icon name="pencil" size={24} color="white" style={{ marginHorizontal: 10 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <Icon name="delete" size={24} color="white" style={{ marginHorizontal: 10 }} />
                  </TouchableOpacity>
                  {item.completed && (
                    <Animated.View style={{ opacity: fadeAnim }}>
                      <Icon name="check" size={24} color="white" style={{ marginHorizontal: 10 }} />
                    </Animated.View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 20,
              borderTopWidth: 1,
              borderColor: '#333',
            }}
          >
            <TextInput
              style={{
                flex: 1,
                marginRight: 10,
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#333',
                color: 'white',
              }}
              placeholder="Add a task"
              placeholderTextColor="#aaa"
              value={input}
              onChangeText={setInput}
            />
            <Button icon="plus" mode="contained" onPress={addTask}>
              {editId !== null ? 'Save' : 'Add'}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
