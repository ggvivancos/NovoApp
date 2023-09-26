// src/styles/themes.js
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

export const colors = {
    primary: '#000000',  // preto
    secondary: '#87CEEB',  // skyblue
    tertiary: '#32CD32',  // verde (como o botão padrão do aplicativo, você pode ajustar conforme necessário)
    text: '#FFFFFF'  // branco
};

export const fonts = {
    regular: {
        fontSize: moderateScale(13),
        color: colors.text,
    },
    large: {
        fontSize: moderateScale(20),
        color: colors.text,
    }
    // Adicione outras variações de fonte conforme necessário.
};

// Continue adicionando outros estilos globais, como espaçamentos padrão, estilos de botão, etc.
