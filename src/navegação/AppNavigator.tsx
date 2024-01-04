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
import NovoSetor from '../telas/setoresesalas/NovoSetor';
import NovoProcedimento from '../telas/procedimentos/NovoProcedimento';
import IndexProcedimento from '../telas/procedimentos/IndexProcedimento';
import NovoEspecialidade from '../telas/especialidades/NovoEspecialidade';
import IndexEspecialidade from '../telas/especialidades/IndexEspecialidade';
import NovoGrupoDeAnestesia from '../telas/gruposdeanestesia/NovoGrupoDeAnestesia';
import IndexGrupoDeAnestesia from '../telas/gruposdeanestesia/IndexGrupoDeAnestesia';
import NovoAgendamento from '../telas/agendamentos/NovoAgendamento';
import IndexAgendamento from '../telas/agendamentos/IndexAgendamento';
import NovoCor from '../telas/cores/NovoCor';
import IndexCor from '../telas/cores/IndexCor';
import IndexSetorESala from '../telas/setoresesalas/IndexSetorESala';
import NovoSalaDeCirurgia from '../telas/setoresesalas/NovoSalaDeCirurgia';
import IndexPaciente from '../telas/pacientes/IndexPaciente';
import NovoPaciente from '../telas/pacientes/NovoPaciente';
import IndexStatus from '../telas/status/IndexStatus';
import NovoStatus from '../telas/status/NovoStatus';
import IndexRecursoComplementar from '../telas/recursoscomplementares/IndexRecursoComplementar';
import NovoRecursoComplementar from '../telas/recursoscomplementares/NovoRecursoComplementar';
import IndexFornecedor from '../telas/fornecedores/IndexFornecedor';
import NovoFornecedor from '../telas/fornecedores/NovoFornecedor';
import IndexOPME from '../telas/OPME/IndexOPME';
import NovoOPME from '../telas/OPME/NovoOPME';


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
        <Stack.Screen 
            name="IndexPaciente" 
            component={IndexPaciente}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoPaciente" 
            component={NovoPaciente}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexAgendamento" 
            component={IndexAgendamento}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoAgendamento" 
            component={NovoAgendamento}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexStatus" 
            component={IndexStatus}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoStatus" 
            component={NovoStatus}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexRecursoComplementar" 
            component={IndexRecursoComplementar}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoRecursoComplementar" 
            component={NovoRecursoComplementar}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexFornecedor" 
            component={IndexFornecedor}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoFornecedor" 
            component={NovoFornecedor}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="IndexOPME" 
            component={IndexOPME}
            options={{ headerShown: false }} 
        />
        <Stack.Screen 
            name="NovoOPME" 
            component={NovoOPME}
            options={{ headerShown: false }} 
        />


        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
