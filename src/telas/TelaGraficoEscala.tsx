import React, { useState } from 'react';
import { View, ScrollView, Dimensions,TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import ComponenteBarraHorarios, { BARRA_HORARIOS_ALTURA } from '../componentes/ComponenteBarraHorarios';
import ComponenteGrafico from '../componentes/ComponenteGrafico';
import ComponenteListaDeAnestesistas from '../componentes/ComponenteListaDeAnestesistas';
import NavegadorDeData from '../componentes/NavegadorDeData';
import { Procedimento } from '../componentes/ProcedimentosAgendados';
import RetanguloArrastavel from '../componentes/RetanguloArrastavel';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Sidebar from '../componentes/sidebar/sidebar';
import TelaAnestesistas from './CRUD/Anestesistas/TelaAnestesistas';
import CabeçalhoGlobal from '../componentes/CabeçalhoGlobal'


interface Props {
    procedimentos?: Procedimento[];
}

const ALTURA_ANESTESISTA = 50;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = {
    telaGraficoEscala: {
        // Seus estilos vão aqui, por exemplo:
        flex: 1,
        backgroundColor: 'white',
        // ... outros estilos que você desejar
    }
};


const TelaGraficoEscala: React.FC<Props> = (props) => {
    
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [telaAtual, setTelaAtual] = useState<'principal' | 'crudAnestesistas'>('principal');
   
    const anestesistasIniciais = [
        { id: 1, posicao: 'C6', nome: 'Caio' },
        { id: 2, posicao: 'C12', nome: 'Gabriel' },
        { id: 3, posicao: 'C13-23', nome: 'Matheus' },
        { id: 4, posicao: '1', nome: 'Stefano' },
        { id: 5, posicao: '2', nome: 'J. Rodolfo' },
        { id: 6, posicao: '3', nome: 'Vivancos' },
        { id: 7, posicao: '4', nome: 'Yogi' },
        { id: 8, posicao: '5', nome: 'Renato' },
        { id: 9, posicao: '6', nome: 'Colli' },
        { id: 10, posicao: '7', nome: 'Mucke' },
        { id: 11, posicao: '8', nome: 'Michel' },
        { id: 12, posicao: '9', nome: 'Samuel' },
        { id: 13, posicao: '10', nome: 'Nadim' },
        { id: 14, posicao: '11', nome: 'Oscar' },
        { id: 15, posicao: '12', nome: 'Edilson' },
        { id: 16, posicao: '13', nome: 'L. Felicio' },
        { id: 17, posicao: '14', nome: 'Shigella' },
        //... (e assim por diante)
        //... (e assim por diante)
    ];


    const [anestesistas, setAnestesistas] = useState(anestesistasIniciais);
    const [horizontalScrollOffset, setHorizontalScrollOffset] = useState(0);
    const [verticalScrollOffset, setVerticalScrollOffset] = useState(0);
    const [dataAtual, setDataAtual] = useState(new Date());
    const alturaListaAnestesistas = ALTURA_ANESTESISTA * anestesistas.length;
    const scrollViewRef = React.useRef(null);


    // Filtrando os procedimentos baseado na data atual
    const procedimentosDoDia = props.procedimentos
  ? props.procedimentos.filter(
      proc => proc.data.toISOString().slice(0,10) === dataAtual.toISOString().slice(0,10)
    )
  : [];

    return (

<View style={styles.telaGraficoEscala}>
    {sidebarVisible && (
        <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 5,
                    backgroundColor: 'transparent' // Garantindo que o View seja clicável
                }}
            />
        </TouchableWithoutFeedback>
    )}
    <CabeçalhoGlobal title="ANESTESISTAS" onMenuPress={() => setSidebarVisible(!sidebarVisible)} />
    {sidebarVisible && <Sidebar onItemSelect={(itemId) => {
    console.log("Item selecionado:", itemId);
    if (itemId === 1) {
        setTelaAtual('crudAnestesistas');
        setSidebarVisible(false);
        console.log("Tela Atual:", telaAtual);
    }
}} />}

        
        {telaAtual === 'crudAnestesistas' ? (
    <TelaAnestesistas />
) : (
<GestureHandlerRootView style={{ flex: 1 }}> 
        
        <View style={{ flex: 1 }}>
            {/* Navegador de Data */}
            <NavegadorDeData 
                dataAtual={dataAtual} 
                onMudancaData={setDataAtual}
            />

            {/* Lista de Anestesistas */}
            <View 
                style={{ 
                    position: 'absolute', 
                    zIndex: 2, 
                    height: (alturaListaAnestesistas) + BARRA_HORARIOS_ALTURA, 
                    top: BARRA_HORARIOS_ALTURA*2,
                    overflow: 'hidden',
                }}
            >
                <View 
                    style={{ 
                        transform: [{ translateY: -verticalScrollOffset - (BARRA_HORARIOS_ALTURA * 0.7) }]
                    }}
                >
                    <ComponenteListaDeAnestesistas 
                        anestesistas={anestesistas} 
                        height={alturaListaAnestesistas*1.2}
                    />
                </View>
            </View>

            {/* Barra de Horários */}
            <View style={{ 
                zIndex: 2, 
                marginLeft: 150, 
                width: screenWidth*3.6,
                overflow: 'hidden'
            }}>
                <View style={{ transform: [{ translateX: -horizontalScrollOffset }] }}>
                    <ComponenteBarraHorarios width={screenWidth * 3.6} />
                </View>
            </View>

            {/* Componente Gráfico */}
            <ScrollView 
                style={{ flex: 1, marginTop: 0, marginLeft: 150 }}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                    setVerticalScrollOffset(event.nativeEvent.contentOffset.y);
                }}
            >
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) => {
                        setHorizontalScrollOffset(event.nativeEvent.contentOffset.x);
                    }}
                >
                    
                    <ComponenteGrafico 
                        width={screenWidth * 3.6}
                        height={screenHeight * 2}
                        procedimentos={procedimentosDoDia}
                    />
                </ScrollView>
            </ScrollView>
        </View>
     </GestureHandlerRootView>
    )}
 </View>
        
    );
                };

export default TelaGraficoEscala;
