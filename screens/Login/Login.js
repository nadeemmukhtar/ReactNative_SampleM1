'use strict';

import React from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {dimens} from '../../config/styles';
import I18n from '../../utils/i18n';
import ProgressBar from "../../components/progressBar";
import {getPref, PrefKeys, setPref} from "../../utils/Preferences";
import Api from "../../network/Api";
import KeyboardSpacer from "react-native-keyboard-spacer";
import {constants} from "../../config/constants";


const BUTTON_WIDTH = dimens.screenWidth * 0.64657;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2135;
let language = "";
let lang = "";

class LoginScreen extends React.Component {

    state = {
        loading: false,
    }

    constructor(props) {
        super(props);
        /*this.state = {

        };
*/
        this.onFocus = this.onFocus.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);

        this.emailRef = this.updateRef.bind(this, 'email');
        this.passwordRef = this.updateRef.bind(this, 'password');
        //this.checkLangSelected();
    }

    componentDidMount() {
        //this.checkLangSelected();
    }



    static navigationOptions = {
        header: null
    };

    onFocus() {
        let {errors = {}} = this.state;

        for (let name in errors) {
            let ref = this[name];

            if (ref && ref.isFocused()) {
                delete errors[name];
            }
        }

        this.setState({errors});
    }

    onChangeText(text) {
        ['email', 'password']
            .map(name => ({name, ref: this[name]}))
            .forEach(({name, ref}) => {
                if (ref.isFocused()) {
                    this.setState({[name]: text});
                }
            });
    }

    onSubmitEmail() {
        this.password.focus();
    }

    onSubmitPassword() {
        this.password.blur();
    }

    test(text) {
        //  console.log(text === '' ? 'testLog' : text);
    }

    onSubmit() {
        let errors = {};
        ['email', 'password'].forEach(name => {
            let value = this.state[name];
            if (!value) {
                errors[name] = 'Should not be empty';
            } else if ('email' === name && !value.match(/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)) {
                errors[name] = 'Invalid email';
            }
        });
        if (this.isEmpty(errors)) {
            this.setState({loading: true});
            //Perform Login
            const body = {
                email: this.state.email,
                password: this.state.password
            };
            Api.login(body).then(function (response) {
                this.hideProgress();
                setPref(PrefKeys.USER_ID, response.id + "");
                setPref(PrefKeys.ACCESS_TOKEN, response.token);
                this.navigateToHome();
            }.bind(this)).catch(function (error) {
                this.hideProgress();
                Alert.alert(I18n.t('error'), error.message);
            }.bind(this));

        } else {
            let message = '';
            if (errors.email && errors.email.match(/Invalid email/)) {
                message = I18n.t('error_invalid_email')
            } else if (errors.password && errors.password.match(/Too short/)) {
                message = I18n.t('error_password_too_short')
            } else {
                message = I18n.t('error_fill_fields')
            }
            Alert.alert(I18n.t('error'), message);
            this.setState({errors});
        }
    }

    isEmpty(obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== 'object') return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    navigateToHome() {
        this.props.navigation.navigate('Home');
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({
        //             routeName: 'Home'
        //         })
        //     ]
        // });
        // this.props.navigation.dispatch(resetAction);
    }


    render() {
        return (
            <ImageBackground source={require('../../assets/images/bg_default.png')} style={styles.viewContainer}>

                {/*<Image style={{width: '100%', height: dimens.screenWidth * 0.54, resizeMode: 'contain'}}
                       source={require('../../assets/images/login_head.png')}/>*/}
               <View style={{flex: 1, marginTop: 50}}>
                    <Text style={{
                        marginBottom: 30,
                        alignSelf: 'center',
                        color: 'white',
                        fontSize: 22
                    }}>
                        {I18n.t('LoginHeader')}
                    </Text>

                    <View style={styles.fieldContainer}>
                        <Image style={styles.fieldIcon}
                               source={require('../../assets/images/ic_email.png')}/>
                        <TextInput
                            ref={this.emailRef}
                            underlineColorAndroid="transparent"
                            placeholder={I18n.t('Email')}
                            style={styles.textInput}
                            onChangeText={this.onChangeText}
                            keyboardType='email-address'
                            returnKeyType={"next"}
                            placeholderTextColor={'#ffffffae'}
                            onSubmitEditing={() => this.onSubmitEmail()}
                        />

                    </View>

                    <View style={styles.fieldContainer}>
                        <Image style={styles.fieldIcon}
                               source={require('../../assets/images/ic_password.png')}/>
                        <TextInput
                            ref={this.passwordRef}
                            underlineColorAndroid="transparent"
                            placeholderTextColor={'#ffffffae'}
                            placeholder={I18n.t('Password')}
                            style={styles.textInput}
                            secureTextEntry={true}
                            onChangeText={this.onChangeText}
                            returnKeyType={"done"}
                            onSubmitEditing={() => this.onSubmitPassword()}
                        />
                    </View>

                    <TouchableOpacity style={{
                        justifyContent: 'center', alignItems: 'center',
                        alignSelf: 'center',
                        width: BUTTON_WIDTH,
                        height: BUTTON_HEIGHT
                    }}
                                      onPress={() => {
                                          Keyboard.dismiss();
                                          this.onSubmit();
                                      }}>
                        <Image style={{
                            position: 'absolute',
                            width: BUTTON_WIDTH,
                            height: BUTTON_HEIGHT
                        }}
                               source={require('../../assets/images/bg_btn_gray.png')}/>
                        <Text style={{color: 'black', fontSize: 18}}>{I18n.t('LoginButton')}</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={{alignSelf: 'flex-end', padding: 10}}
                                      onPress={() => {
                                          Keyboard.dismiss();
                                          this.forgotPassword()
                                      }}>
                        <Text style={{color: '#fff000'}}>{I18n.t('ForgotPass')}</Text>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' ? <KeyboardSpacer/> : null}

                </View>

                < ProgressBar
                    loading={this.state.loading}
                />
            </ImageBackground>
        );
    }

    hideProgress() {
        this.setState({loading: false});
    }

    forgotPassword() {
        let value = this.state["email"];
        let errors = {};
        if (!value) {
            errors["email"] = 'Should not be empty';
        } else if (!value.match(/^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)) {
            errors["email"] = 'Invalid email';
        }
        if (this.isEmpty(errors)) {

            this.showProgress();
            //Forgot Password request
            const body = {
                email: this.state.email
            };
            Api.forgotPass(body).then(function (response) {
                this.hideProgress();
                Alert.alert('', I18n.t('email_sent'));
            }.bind(this)).catch(function (error) {
                this.hideProgress();
                Alert.alert(I18n.t('error'), error.message);
            }.bind(this));

        } else {
            let message = '';
            if (errors.email && errors.email.match(/Invalid email/)) {
                message = I18n.t('error_invalid_email')
            } else {
                message = I18n.t('error_enter_email')
            }
            Alert.alert(I18n.t('error'), message);
            this.setState({errors});
        }
    }

    showProgress() {
        this.setState({loading: true});
    }
}

const
    styles = StyleSheet.create({
        viewContainer: {
            width: '100%',
            height: '100%'
        },
        logoImage: {
            alignSelf: 'center',
            width: 60,
            height: 60,
            resizeMode: 'contain',
            marginBottom: 60
        },
        textInput: {
            color: 'white',
            fontSize: 18,
            paddingStart: 20,
            width: '80%',
            textAlign: constants.isRTL ? 'right' : 'left'
        },
        fieldContainer: {
            alignItems: 'center',
            backgroundColor: '#ffffff33',
            borderRadius: 100,
            height: 55,
            flexDirection: 'row',
            marginStart: 10,
            marginEnd: 10,
            paddingStart: 30,
            marginBottom: 20
        },
        fieldIcon: {
            width: 20, height: 20, resizeMode: 'contain',
        }
    });

const
    onButtonPress = () => navigate('Profile', {name: 'Jane'});

export default LoginScreen;
