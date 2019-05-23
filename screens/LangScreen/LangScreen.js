'use strict';

import React from 'react';
import {Alert, I18nManager, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {colors, dimens} from '../../config/styles';
import {getPref, getUserData, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";
import I18n from "../../utils/i18n";
import moment from "../WeightDiary/WeightDiary";
import Api from "../../network/Api";
import Preference from 'react-native-preference';
import RNFetchBlobReadStream from "react-native-fetch-blob/class/RNFetchBlobReadStream";
import RNRestart from 'react-native-restart';

let lang = "";

class LangScreen extends React.Component {
    state = {
        showEastonian: "transparent",
        showEnglish: "transparent",
        showFinnish: "transparent",
        showRussian: "transparent",
        showHebrew: "transparent"
    }

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this._checkLanguageSelected();
        //console.log('Drawer position', constants.isRTL, I18nManager.isRTL, constants.isRTL === I18nManager.isRTL ? 'right' : 'left');
    }

    _checkLanguageSelected() {
        var selectedLanguage = Preference.get("language");
        if (selectedLanguage == "en")
            this.setState({
                showEastonian: "transparent",
                showEnglish: "#4b7700",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        if (selectedLanguage == "et")
            this.setState({
                showEastonian: "#4b7700",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        if (selectedLanguage == "fi")
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "#4b7700",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        if (selectedLanguage == "ru")
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "#4b7700",
                showHebrew: "transparent"
            });
        if (selectedLanguage == "he")
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "#4b7700"
            });


    }

    _langSelected(language) {
        if (language == "et") {
            lang = "et";
            I18nManager.forceRTL(false);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            this.setState({
                showEastonian: "#4b7700",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        }
        if (language == "en") {
            lang = "en";
            I18nManager.forceRTL(false);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            console.log("isRTL--" + constants.isRTL);
            this.setState({
                showEastonian: "transparent",
                showEnglish: "#4b7700",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        }
        if (language == "fi") {
            lang = "fi";
            I18nManager.forceRTL(false);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            console.log("isRTL--" + constants.isRTL);
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "#4b7700",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        }
        if (language == "ru") {
            lang = "ru";
            I18nManager.forceRTL(false);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            console.log("isRTL--" + constants.isRTL);
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "#4b7700",
                showHebrew: "transparent"
            });
        }
        if (language == "he") {
            lang = "he";
            //I18nManager.
            I18nManager.forceRTL(true);
            constants.isRTL = true;
            Preference.set('screenDrawer', "right");
            console.log("isRTL--" + constants.isRTL);
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "#4b7700"
            });
        }
    }

    _enterPressed = () => {
        if (lang == "") {
            Alert.alert("Please select any language first!");
        } else {
            console.log("LanguageSelected--" + lang);
            Preference.set('language', lang);
            I18n.locale = lang;
            console.log("LanguageSelected--" + lang);
            this.props.navigation.navigate("stackNavigator");
            RNRestart.Restart();
            //this.props.navigation.navigate("Home");
        }

    };
    _cancelPressed = () => {
        this.props.navigation.navigate("stackNavigator");
    };

    render() {
        return (
            <ImageBackground source={require('../../assets/images/bg_splash.png')} style={styles.container}>
                <View style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}>
                    <Text style={{
                        alignSelf: 'center',
                        color: 'white',
                        fontSize: 22,
                        marginBottom: 30
                    }}>
                        {I18n.t('text_language') + ":"}
                    </Text>
                    <TouchableOpacity onPress={() => this._langSelected("et")}>
                        <View style={{
                            height: 60, borderRadius: 30, backgroundColor: this.state.showEastonian
                            , justifyContent: "center", flexDirection: "row", alignItems: "center", marginStart: 10
                        }}>
                            <Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontSize: 22,
                                marginStart: 50,
                                marginEnd: 50,
                            }}>
                                Eesti
                            </Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._langSelected("en")}>
                        <View style={{
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: this.state.showEnglish,
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            marginStart: 10,
                            marginTop: 5,
                        }}>
                            <Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontSize: 22,
                                marginStart: 50,
                                marginEnd: 50,
                            }}>
                                English
                            </Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._langSelected("fi")}>
                        <View style={{
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: this.state.showFinnish,
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            marginStart: 10,
                            marginTop: 5,
                        }}>
                            <Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontSize: 22,
                                marginStart: 50,
                                marginEnd: 50,
                            }}>
                                Suomi
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._langSelected("ru")}>
                        <View style={{
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: this.state.showRussian,
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            marginStart: 10,
                            marginTop: 5,
                        }}>
                            <Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontSize: 22,
                                marginStart: 50,
                                marginEnd: 50,
                            }}>
                                Русский
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._langSelected("he")}>
                        <View style={{
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: this.state.showHebrew,
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            marginStart: 10,
                            marginTop: 5,
                        }}>
                            <Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontSize: 22,
                                marginStart: 50,
                                marginEnd: 50,
                            }}>
                                עברית
                            </Text>
                        </View>
                    </TouchableOpacity>


                    <View style={{
                        flexDirection: "row", marginTop: 30, width: "100%"
                        , alignItems: "center", justifyContent: "center"
                    }}>
                        <TouchableOpacity onPress={this._cancelPressed} style={{
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: "#EBEBEB",
                            width: "40%"
                        }}>
                            <View style={{
                                height: "100%", width: "100%",
                                justifyContent: "center", flexDirection: "row", alignItems: "center"
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontSize: 18,
                                }}>{I18n.t('cancel')}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._enterPressed} style={{
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: "#EBEBEB",
                            width: "40%",
                            marginStart: 20
                        }}>
                            <View style={{
                                height: "100%", width: "100%",
                                justifyContent: "center", flexDirection: "row", alignItems: "center"
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontSize: 18,
                                }}>{I18n.t('select')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    navigateToHome() {
        this.props.navigation.navigate('Home');
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({
        //         routeName: 'Home'
        //     })]
        // });
        // this.props.navigation.dispatch(resetAction);
    }

    navigateToLogin() {
        this.props.navigation.navigate('Login');
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({routeName: 'Login'})]
        // });
        // this.props.navigation.dispatch(resetAction);
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: dimens.screenHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        width: dimens.screenWidth,
        resizeMode: Image.resizeMode.cover
    }
});

export default LangScreen;
