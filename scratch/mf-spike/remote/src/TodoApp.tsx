import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Todo = {id: string; text: string; done: boolean};

/**
 * Deliberately dependency-free: `react` and `react-native` only, both shared
 * singletons. Adding anything else to this file muddies what the spike proves.
 * Hooks here are the singleton test — a second React throws on first render.
 */
const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draft, setDraft] = useState('');

  const add = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setTodos(list => [{id: `${Date.now()}`, text, done: false}, ...list]);
    setDraft('');
  };

  return (
    <View style={s.screen}>
      <Text style={s.badge}>rendered from remote "todo"</Text>
      <View style={s.composer}>
        <TextInput
          style={s.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a task…"
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={s.add} onPress={add}>
          <Text style={s.addTxt}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={t => t.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={s.empty}>Nothing here yet.</Text>}
        renderItem={({item}) => (
          <TouchableOpacity
            style={s.row}
            onPress={() =>
              setTodos(list =>
                list.map(t => (t.id === item.id ? {...t, done: !t.done} : t)),
              )
            }>
            <Text style={[s.text, item.done && s.done]}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TodoApp;

const s = StyleSheet.create({
  screen: {flex: 1, padding: 12, gap: 10},
  badge: {fontSize: 11, color: '#2563eb', fontWeight: '700'},
  composer: {flexDirection: 'row', gap: 8},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  add: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  addTxt: {color: 'white', fontWeight: '600'},
  row: {paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e4e4e7'},
  text: {fontSize: 15},
  done: {textDecorationLine: 'line-through', color: '#a1a1aa'},
  empty: {textAlign: 'center', marginTop: 40, color: '#a1a1aa'},
});
