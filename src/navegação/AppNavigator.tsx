import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaGraficoEscala from '../telas/TelaGraficoEscala';
import TelaAnestesistas from '../telas/CRUD/Anestesistas/TelaAnestesistas';


const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaGraficoEscala">
        <Stack.Screen name="TelaGraficoEscala" component={TelaGraficoEscala} />
        <Stack.Screen name="TelaAnestesistas" component={TelaAnestesistas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
