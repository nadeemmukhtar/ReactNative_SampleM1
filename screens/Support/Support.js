'use strict';

import React from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Keyboard
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {appStyles, colors, dimens} from '../../config/styles';
import {getPref, getUserData, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";
import I18n from "../../utils/i18n";
import Api from "../../network/Api";
import ProgressBar from "../../components/progressBar";
import helper from "../../utils/helper";


class SupportScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
    }

    showProgress(show) {
        this.setState({loading: show});
    }

    _sendMessage = () => {
        Keyboard.dismiss();
        if (!this.state.message || this.state.message === '') {
            Alert.alert(I18n.t('alert'), I18n.t('error_write_message'));
            return;
        }
        this.showProgress(true);
        getUserData(function (userId, token) {
            const body = {
                id: userId,
                message: this.state.message
            };
            Api.sendMessage(token, body).then(function (response) {
                this.showProgress(false);
                Alert.alert(I18n.t('info'), I18n.t('message_successful'))
            }.bind(this)).catch(function (err) {
                this.showProgress(false);
                Alert.alert(I18n.t('error'), err.message);
            }.bind(this));
        }.bind(this));
    };

    render() {
        return (
            <ImageBackground source={require('../../assets/images/bg_default.png')} style={styles.container}>

                {/*<Text style={{
                    marginTop: 15,
                    marginBottom: 15,
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: '#f5fe00'
                }}>
                    {I18n.t('ContactSupport')}
                </Text>*/}

                <TextInput
                    style={{
                        borderRadius: 25,
                        backgroundColor: '#ffffff33',
                        marginBottom: 10,
                        marginTop: 5,
                        marginStart: 10,
                        marginEnd: 10,
                        textAlignVertical: "top",
                        padding: 15,
                        color: 'white',
                        height: 55 * 3
                    }}
                    multiline={true}
                    placeholder={I18n.t('Message')}
                    underlineColorAndroid="transparent"
                    placeholderTextColor={'white'}
                    returnKeyType={"done"}
                    numberOfLines={10}
                    onChangeText={text => this.setState({message: text})}
                />

                <TouchableOpacity
                    onPress={this._sendMessage}
                    style={{
                        justifyContent: 'center', alignItems: 'center',
                        alignSelf: 'center',
                        width: BTN_WRITE_WIDTH,
                        height: BTN_WRITE_HEIGHT
                    }}>
                    <Image
                        style={{
                            position: 'absolute',
                            width: BTN_WRITE_WIDTH,
                            height: BTN_WRITE_HEIGHT
                        }}
                        source={require('../../assets/images/bg_btn_gray.png')}/>
                    <Text style={{textAlign: 'center', color: 'black', fontSize: 18}}>{I18n.t('SendMessage')}</Text>
                </TouchableOpacity>
                <ProgressBar
                    extraSpacing={60}
                    loading={this.state.loading}
                />
            </ImageBackground>
        );
    }
}

const BTN_WRITE_WIDTH = dimens.screenWidth * 0.64722;
const BTN_WRITE_HEIGHT = BTN_WRITE_WIDTH * 0.21352;

const styles = StyleSheet.create({
    container: {
        width: dimens.screenWidth,
        height: dimens.screenHeight,
        paddingTop: 20
    },
    image: {
        flex: 1,
        width: dimens.screenWidth,
        resizeMode: Image.resizeMode.cover
    },
    btnSendMessage: {
        width: BTN_WRITE_WIDTH,
        height: BTN_WRITE_HEIGHT,
        resizeMode: 'contain'
    }
});

export default SupportScreen;
