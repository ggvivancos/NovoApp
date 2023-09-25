import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaGraficoEscala from '../telas/TelaGraficoEscala';
import NovoAnestesista from '../telas/anestesistas/NovoAnestesista'; // Ajuste o caminho conforme necessário
import IndexAnestesista from '../telas/anestesistas/IndexAnestesista';



const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaGraficoEscala">
    <Stack.Screen 
        name="TelaGraficoEscala"
        component={TelaGraficoEscala}
        options={{ headerShown: false }}
    />
    <Stack.Screen 
        name="IndexAnestesista" 
        component={IndexAnestesista}
        options={{ headerShown: false }} 
    />
    <Stack.Screen 
        name="NovoAnestesista" 
        component={NovoAnestesista} 
        options={{ headerShown: false }} 
    />
</Stack.Navigator>

    </NavigationContainer>
  );
}

export default AppNavigator;
