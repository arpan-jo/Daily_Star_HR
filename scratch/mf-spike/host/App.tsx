import React, {Suspense, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// The whole point of the spike: this import is resolved over HTTP at runtime
// from the `todo` container, not bundled into the host.
const TodoApp = React.lazy(() => import('todo/TodoApp'));

const App = () => {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <SafeAreaView style={s.fill}>
        <TouchableOpacity style={s.back} onPress={() => setOpen(false)}>
          <Text style={s.backTxt}>‹ Host</Text>
        </TouchableOpacity>
        {/* A remote that fails to load must not take the host down with it. */}
        <RemoteBoundary>
          <Suspense fallback={<ActivityIndicator style={s.fill} size="large" />}>
            <TodoApp />
          </Suspense>
        </RemoteBoundary>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.fill, s.center]}>
      <Text style={s.title}>MF Host</Text>
      <TouchableOpacity style={s.btn} onPress={() => setOpen(true)}>
        <Text style={s.btnTxt}>Open Todo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

class RemoteBoundary extends React.Component<
  {children: React.ReactNode},
  {error?: Error}
> {
  state: {error?: Error} = {};

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  render() {
    // Print it: a version-mismatched singleton shows up here as "Invalid hook
    // call", which is the single most useful signal in this spike.
    return this.state.error ? (
      <View style={[s.fill, s.center]}>
        <Text style={s.err}>{String(this.state.error?.message)}</Text>
      </View>
    ) : (
      this.props.children
    );
  }
}

export default App;

const s = StyleSheet.create({
  fill: {flex: 1},
  center: {alignItems: 'center', justifyContent: 'center', gap: 16},
  title: {fontSize: 22, fontWeight: '700'},
  btn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnTxt: {color: 'white', fontWeight: '600'},
  back: {padding: 12},
  backTxt: {fontSize: 16, color: '#2563eb'},
  err: {color: '#b91c1c', padding: 24, textAlign: 'center'},
});
