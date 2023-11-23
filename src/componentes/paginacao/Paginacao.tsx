import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type PaginacaoProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Paginacao: React.FC<PaginacaoProps> = ({ currentPage, totalPages, onPageChange }) => {
    console.log("currentPage:", currentPage);
    console.log("totalPages:", totalPages);
    
    
    return (
        <View style={styles.paginationContainer}>
            {currentPage > 1 && (
                <TouchableOpacity onPress={() => onPageChange(currentPage - 1)} style={styles.paginationText}>
                    <Text>Anterior</Text>
                </TouchableOpacity>
            )}
            
            {[...Array(totalPages)].map((_, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onPageChange(index + 1)}
                    style={[
                        styles.paginationText, 
                        (currentPage === index + 1) ? styles.activePage : styles.inactivePage
                    ]}
                >
                    <Text>{index + 1}</Text>
                </TouchableOpacity>
            ))}

            {currentPage < totalPages && (
                <TouchableOpacity onPress={() => onPageChange(currentPage + 1)} style={styles.paginationText}>
                    <Text>Próxima</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    paginationText: {
        margin: 5,
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    activePage: {
        backgroundColor: 'skyblue'
    },
    inactivePage: {
        backgroundColor: 'white'
    }
});

export default Paginacao;
