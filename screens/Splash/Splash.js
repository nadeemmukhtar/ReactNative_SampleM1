'use strict';

import React from 'react';
import {Alert, I18nManager, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {colors, dimens} from '../../config/styles';
import {getPref, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";
import I18n from "../../utils/i18n";
import Preference from "react-native-preference";
import RNRestart from 'react-native-restart';
let deviceLocale=Preference.get("language");

let lang = "";
if (Preference.get("language") == undefined) {
    if (deviceLocale == "en") {
        I18n.locale = "en";
        I18nManager.forceRTL(false);
        Preference.set("language", "en");
        console.log("SelectedLanguage1--inside i18n1" + deviceLocale);
    } else if (deviceLocale == "et") {
        I18n.locale = deviceLocale;
        I18nManager.forceRTL(false);
        Preference.set("language", "et");
        console.log("SelectedLanguage1--inside i18n2" + deviceLocale);
    } else if (deviceLocale == "fi") {
        I18n.locale = deviceLocale;
        I18nManager.forceRTL(false);
        Preference.set("language", "fi");
        console.log("SelectedLanguage1--inside i18n3" + deviceLocale);
    } else if (deviceLocale == "ru") {
        I18n.locale = deviceLocale;
        I18nManager.forceRTL(false);
        Preference.set("language", "ru");
        console.log("SelectedLanguage1--inside i18n4" + deviceLocale);
    } else if (deviceLocale == "he") {
        I18n.locale = deviceLocale;
        I18nManager.forceRTL(true);
        Preference.set("language", "he");
        console.log("SelectedLanguage1--inside i18n5" + deviceLocale);
    }

} else {
    I18n.locale = Preference.get("language");
    if (Preference.get("language") == "he") {
        console.log("SelectedLanguage2--inside i18n forceRTL true " + Preference.get("language"));
        if (!I18nManager.isRTL) {
            //RNRestart.Restart();
            console.log("SplashScreen not RTL-" + Preference.get("language"));
            I18nManager.allowRTL(!I18nManager.isRTL)
            I18nManager.forceRTL(!I18nManager.isRTL)
            //I18nManager.forceRTL(true);
            setTimeout(()=>{
                RNRestart.Restart();
            },1000);
        }

    } else {
        console.log("SelectedLanguage2--inside i18n forceRTL false" + Preference.get("language"));
        //I18nManager.forceRTL(false);
    }
    // console.log("SelectedLanguage2--inside i18n" + Preference.get("language"));
}


class SplashScreen extends React.Component {
    state = {
        loading: false,
        languageSelection: false,
        mainScreen: false,
        showEastonian: "transparent",
        showEnglish: "transparent",
        showFinnish: "transparent",
        showRussian: "transparent",
        showHebrew: "transparent"
    }

    constructor(props) {
        super(props);
        this._langSelected = this._langSelected.bind(this);
        this.checkLangSelected = this.checkLangSelected.bind(this);

    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        //console.log('Drawer position', constants.isRTL, I18nManager.isRTL, constants.isRTL === I18nManager.isRTL ? 'right' : 'left');
        /* setTimeout(() => {
             getPref(PrefKeys.ACCESS_TOKEN, function (token) {
                 if (token) {
                     this.navigateToHome();
                 } else
                     this.navigateToLogin();
             }.bind(this));
         }, 2000);*/
        this.checkLangSelected();
    }

    checkLangSelected() {
        if (Preference.get("firstLaunch") == undefined || Preference.get("firstLaunch") == "") {
            console.log("SelectedLanguage2--firstLaunch--" + Preference.get("firstLaunch"));
            //Preference.set("firstLaunch",true);
            this.setState({languageSelection: true, mainScreen: false});
        } else {
            if (Preference.get("firstLaunch") == true) {
                console.log("SelectedLanguage2--firstLaunch--" + Preference.get("firstLaunch"));
                this.setState({languageSelection: false, mainScreen: true});
                setTimeout(() => {
                    getPref(PrefKeys.ACCESS_TOKEN, function (token) {
                        if (token) {
                            this.navigateToHome();
                        } else
                            this.navigateToLogin();
                    }.bind(this));
                }, 2000);
            } else {
                this.setState({languageSelection: true, mainScreen: false});
                console.log("SelectedLanguage2--firstLaunch--" + Preference.get("firstLaunch"));
            }
        }
    }

    _langSelected(language) {
        console.log("SelectedLanguage--deviceLocale3--" + language);
        if (language == "et") {
            lang = "et";
            I18nManager.forceRTL(true);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            this.setState({
                showEastonian: "#568600",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        }
        if (language == "en") {
            lang = "en";
            I18nManager.forceRTL(true);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            this.setState({
                showEastonian: "transparent",
                showEnglish: "#568600",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        }
        if (language == "fi") {
            lang = "fi";
            I18nManager.forceRTL(true);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "#568600",
                showRussian: "transparent",
                showHebrew: "transparent"
            });
        }
        if (language == "ru") {
            lang = "ru";
            I18nManager.forceRTL(true);
            constants.isRTL = false;
            Preference.set('screenDrawer', "left");
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "#568600",
                showHebrew: "transparent"
            });
        }
        if (language == "he") {
            lang = "he";
            I18nManager.forceRTL(false);
            constants.isRTL = false;
            Preference.set('screenDrawer', "right");
            this.setState({
                showEastonian: "transparent",
                showEnglish: "transparent",
                showFinnish: "transparent",
                showRussian: "transparent",
                showHebrew: "#568600"
            });
            console.log("SelectedLanguage--deviceLocale4--" + language);
        }
    }

    _enterPressed = () => {
        if (lang == "") {
            Alert.alert("Please select any language first!");
        } else {
            console.log("LanguageSelected--" + lang);
            Preference.set("firstLaunch", true);
            Preference.set('language', lang);
            I18n.locale = lang;
            console.log("LanguageSelected--" + lang);
            //this.props.navigation.navigate("stackNavigator");
            this.setState({languageSelection: false, mainScreen: true});
            setTimeout(() => {
                getPref(PrefKeys.ACCESS_TOKEN, function (token) {
                    if (token) {
                        this.navigateToHome();
                    } else
                        this.navigateToLogin();
                }.bind(this));
            }, 2000);

        }

    };

    render() {
        return (
            <ImageBackground source={require('../../assets/images/bg_splash.png')} style={styles.container}>

                {this.state.languageSelection && <View style={{
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
                            backgroundColor: this.state.showFinnish
                            ,
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
                            backgroundColor: this.state.showRussian
                            ,
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
                            backgroundColor: this.state.showHebrew
                            ,
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


                    <View style={{flexDirection: "row", marginTop: 30}}>
                        <TouchableOpacity onPress={this._enterPressed}>
                            <View style={{
                                height: 60, borderRadius: 30, backgroundColor: "#EBEBEB"
                                , justifyContent: "center", flexDirection: "row", alignItems: "center", marginStart: 10
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: 'black',
                                    fontSize: 18,
                                    marginStart: 30,
                                    marginEnd: 30,
                                }}>{I18n.t('next')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>}
                {this.state.mainScreen && <View style={{width: "100%"}}>
                    {I18n.locale === 'et' &&
                    <Image style={{height: 55, width: '100%', resizeMode: 'contain', marginBottom: 20}}
                           source={require('../../assets/images/ic_splash.png')}/>}
                    <View style={{width: '100%', paddingTop: 20, paddingBottom: 20, backgroundColor: '#ffffff33'}}>
                        <Text style={{marginBottom: 10, fontSize: 22, textAlign: 'center', color: '#fbfbf8'}}>
                            {I18n.t('SplashLine1')}
                        </Text>
                        <Text style={{fontSize: 20, textAlign: 'center', color: '#fff000'}}>
                            {I18n.t('SplashLine2')}
                        </Text>
                        <Text style={{fontSize: 17, textAlign: 'center', color: '#fff000'}}>
                            {I18n.t('SplashLine3')}
                        </Text>
                    </View>
                </View>}
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

export default SplashScreen;
