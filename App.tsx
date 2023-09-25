import React from 'react';
import { enableScreens } from 'react-native-screens'; 
import { QueryClient, QueryClientProvider } from 'react-query'; // Importações necessárias
import AppNavigator from './src/navegação/AppNavigator';

enableScreens();

const queryClient = new QueryClient(); // Crie uma instância do QueryClient

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AppNavigator />
        </QueryClientProvider>
    );
}

export default App;
