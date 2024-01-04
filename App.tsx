import React from 'react';
import { enableScreens } from 'react-native-screens';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppNavigator from './src/navegação/AppNavigator';
import { AgendamentoProvider } from './src/context/AgendamentoContext'; // Importe o AgendamentoProvider

enableScreens();

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (

        <AgendamentoProvider>
            <QueryClientProvider client={queryClient}>
             
                <AppNavigator />
            
            </QueryClientProvider>
        </AgendamentoProvider>
    );
}

export default App;
