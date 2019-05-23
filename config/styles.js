import {Image, StyleSheet} from "react-native";

const Dimensions = require("Dimensions");

export const colors = {
    background: '#F5F2F9',
    errorText: '#FA3256',
    headerText: 'white',
    headerBackground: '#571b3c',
    buttonBackground: 'white',
    windowBackground: "white",
    buttonBorder: 'black',
    pressedBackground: '#b0f4e1',
    buttonText: 'white',
    inputBackground: '#FFFFFF',
    inputDivider: '#E4E2E5',
    textColor: '#571b3c',
    accent: '#951c6b'
};

export const dimens = {
    fieldsBorderRadius: 25,
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
};

export const appStyles = StyleSheet.create({
    tabs: {height: 23, resizeMode: 'contain'}
});