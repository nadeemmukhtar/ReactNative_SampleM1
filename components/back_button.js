import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity, Platform, I18nManager} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import I18n from "../utils/i18n";
import {constants} from "../config/constants";

const BORDER_RADIUS = 7;
const BUTTON_HEIGHT = 50;

class BackButton extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.goBack(null)}
                style={{
                    padding: 13,
                    marginTop: getStatusBarHeight(true),
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'white'
                }}>
                <Image
                    style={{
                        width: 25, height: 25,
                        resizeMode: 'contain',
                        transform: [{scaleX: constants.isRTL ? -1 : 1}]
                    }}
                    source={require('../assets/images/ic_back.png')}
                />
                <Text style={{fontSize: 18}}>
                    {I18n.t('back')}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: BORDER_RADIUS
    }
});

export default BackButton;
