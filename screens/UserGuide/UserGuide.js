'use strict';

import React from 'react';
import {FlatList, Image, StyleSheet, View, Alert} from 'react-native';
import {NavigationActions,StackActions} from 'react-navigation';
import {appStyles, colors, dimens} from '../../config/styles';
import {getPref, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";

import GuideItem from './guideItem';
import Pdf from 'react-native-pdf';
import ProgressBar from "../../components/progressBar";
import Api from "../../network/Api";
import I18n from "../../utils/i18n";

class UserGuideScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userGuides: []
        }
    }

    static navigationOptions = {
        header: null
    };

    showProgress(show) {
        this.setState({loading: show});
    }

    componentDidMount() {
        this.showProgress(true);
        getPref(PrefKeys.ACCESS_TOKEN, function (token) {
            getPref(PrefKeys.USER_ID, function (user_id) {
                const body = {
                    id: user_id
                };
                Api.getUserGuides(token, body).then(function (response) {
                    this.showProgress(false);
                    this.setState({
                        userGuides: response.files
                    });
                }.bind(this)).catch(function (error) {
                    this.showProgress(false);
                    Alert.alert(I18n.t('error'), error.message);
                }.bind(this))
            }.bind(this));
        }.bind(this));
    }

    onViewPress(item) {
        //console.log(item.filePath);
        item.navigation.navigate('PDFViewer', {filePath: item.filePath});
    }

    _renderItem = ({item}) => (
        <GuideItem
            displayName={item.displayName}
            filePath={item.filePath}
            onViewPress={this.onViewPress}
            navigation={this.props.navigation}
        />
    );

    _keyExtractor = (item, index) => index + "";

    render() {
        return (
            <View style={styles.container}>
                <FlatList style={{flex: 1, backgroundColor: 'white'}}
                          data={this.state.userGuides}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}>

                </FlatList>
                <ProgressBar
                    extraSpacing={60}
                    loading={this.state.loading}
                />
            </View>
        );
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
        flex: 1,
        padding: 10,
        backgroundColor: '#eeeeee'
    },
    image: {
        flex: 1,
        width: dimens.screenWidth,
        resizeMode: Image.resizeMode.cover
    }
});

export default UserGuideScreen;
