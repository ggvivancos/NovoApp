import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RetanguloArrastavel from './RetanguloArrastavel';  // Ajuste o caminho conforme necessário

const TesteScreen: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <RetanguloArrastavel />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TesteScreen;
