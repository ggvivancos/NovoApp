import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaGraficoEscala from '../telas/TelaGraficoEscala';
import NovoAnestesista from '../telas/anestesistas/NovoAnestesista';
import IndexAnestesista from '../telas/anestesistas/IndexAnestesista';
import NovoCirurgiao from '../telas/cirurgioes/NovoCirurgiao';
import IndexCirurgiao from '../telas/cirurgioes/IndexCirurgiao';

// Importações adicionais
//import NovoHospital from '../telas/hospitais/NovoHospital';
//import IndexHospital from '../telas/hospitais/IndexHospital';
//import NovoConvenio from '../telas/convenios/NovoConvenio';
//import IndexConvenio from '../telas/convenios/IndexConvenio';
//import NovoSalaDeCirurgia from '../telas/salasdecirurgia/NovoSalaDeCirurgia';
//import IndexSalaDeCirurgia from '../telas/salasdecirurgia/IndexSalaDeCirurgia';
//import NovoSetor from '../telas/setores/NovoSetor';
//import IndexSetor from '../telas/setores/IndexSetor';
//import NovoProcedimento from '../telas/procedimentos/NovoProcedimento';
//import IndexProcedimento from '../telas/procedimentos/IndexProcedimento';
//import NovoEspecialidade from '../telas/especialidades/NovoEspecialidade';
//import IndexEspecialidade from '../telas/especialidades/IndexEspecialidade';
//import NovoGrupoDeAnestesia from '../telas/gruposdeanestesia/NovoGrupoDeAnestesia';
//import IndexGrupoDeAnestesia from '../telas/gruposdeanestesia/IndexGrupoDeAnestesia';
//import NovoAgendamento from '../telas/agendamentos/NovoAgendamento';
//import IndexAgendamento from '../telas/agendamentos/IndexAgendamento';

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
        {/* Outras rotas, como Anestesista e Cirurgião já existentes... */}
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
        <Stack.Screen 
            name="IndexCirurgiao" 
            component={IndexCirurgiao}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoCirurgiao" 
            component={NovoCirurgiao}
            options={{ headerShown: false }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
