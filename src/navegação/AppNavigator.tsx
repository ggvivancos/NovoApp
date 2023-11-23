import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaGraficoEscala from '../telas/TelaGraficoEscala';
import NovoAnestesista from '../telas/anestesistas/NovoAnestesista';
import IndexAnestesista from '../telas/anestesistas/IndexAnestesista';
import NovoCirurgiao from '../telas/cirurgioes/NovoCirurgiao';
import IndexCirurgiao from '../telas/cirurgioes/IndexCirurgiao';

// Importações adicionais
import NovoHospital from '../telas/hospitais/NovoHospital';
import IndexHospital from '../telas/hospitais/IndexHospital';
import NovoConvenio from '../telas/convenios/NovoConvenio';
import IndexConvenio from '../telas/convenios/IndexConvenio';
//import NovoSalaDeCirurgia from '../telas/salasdecirurgia/NovoSalaDeCirurgia';
//import IndexSalaDeCirurgia from '../telas/salasdecirurgia/IndexSalaDeCirurgia';
import NovoSetor from '../telas/setoresesalas/NovoSetor';
//import IndexSetor from '../telas/setores/IndexSetor';
import NovoProcedimento from '../telas/procedimentos/NovoProcedimento';
import IndexProcedimento from '../telas/procedimentos/IndexProcedimento';
import NovoEspecialidade from '../telas/especialidades/NovoEspecialidade';
import IndexEspecialidade from '../telas/especialidades/IndexEspecialidade';
import NovoGrupoDeAnestesia from '../telas/gruposdeanestesia/NovoGrupoDeAnestesia';
import IndexGrupoDeAnestesia from '../telas/gruposdeanestesia/IndexGrupoDeAnestesia';
//import NovoAgendamento from '../telas/agendamentos/NovoAgendamento';
//import IndexAgendamento from '../telas/agendamentos/IndexAgendamento';
import NovoCor from '../telas/cores/NovoCor';
import IndexCor from '../telas/cores/IndexCor';
import IndexSetorESala from '../telas/setoresesalas/IndexSetorESala';
import NovoSalaDeCirurgia from '../telas/setoresesalas/NovoSalaDeCirurgia';

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
        <Stack.Screen 
            name="IndexEspecialidade" 
            component={IndexEspecialidade}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoEspecialidade" 
            component={NovoEspecialidade}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexGrupoDeAnestesia" 
            component={IndexGrupoDeAnestesia}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoGrupoDeAnestesia" 
            component={NovoGrupoDeAnestesia}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexConvenio" 
            component={IndexConvenio}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoConvenio" 
            component={NovoConvenio}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexHospital" 
            component={IndexHospital}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoHospital" 
            component={NovoHospital}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexCor" 
            component={IndexCor}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoCor" 
            component={NovoCor}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexSetorESala" 
            component={IndexSetorESala}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoSetor" 
            component={NovoSetor}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoSalaDeCirurgia" 
            component={NovoSalaDeCirurgia}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexProcedimento" 
            component={IndexProcedimento}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoProcedimento" 
            component={NovoProcedimento}
            options={{ headerShown: false }} 
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
