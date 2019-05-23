import {dimens} from "../config/styles";
import React from "react";
import {Bars} from 'react-native-loader';
import {Text, View} from "react-native";
import I18n from "../utils/i18n";

class ProgressBar extends React.PureComponent {
    render() {
        const extraSpacing = this.props.extraSpacing ? this.props.extraSpacing : 0;
        return (
            this.props.loading ? <View style={{
                backgroundColor: '#00000090',
                width: dimens.screenWidth,
                height: dimens.screenHeight - extraSpacing,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Bars size={20} color="white"/>

                <Text style={{marginTop: 10, color: 'white'}}>
                    {I18n.t('please_wait')}
                </Text>
            </View> : null
        );
    }
}

export default ProgressBar;