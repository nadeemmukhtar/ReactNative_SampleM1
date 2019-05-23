'use strict';

import React from 'react';
import {Alert, FlatList, Image, StyleSheet, View} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {appStyles, colors, dimens} from '../../config/styles';
import {getPref, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";
import ResourceItem from "./resourceItem";
import Api from "../../network/Api";
import ProgressBar from "../../components/progressBar";
import I18n from "../../utils/i18n";


class ResourcesScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            resources: []
        }
    }

    static navigationOptions = {
        header: null,
        tabBarIcon: ({tintColor}) => (
            <Image
                source={require('../../assets/images/tab_resources.png')}
                style={[{tintColor: tintColor}, appStyles.tabs]}
            />
        )
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
                Api.getResources(token, body).then(function (response) {
                    this.showProgress(false);
                    this.setState({
                        resources: response.files
                    });
                }.bind(this)).catch(function (error) {
                    this.showProgress(false);
                    Alert.alert(I18n.t('error'), error.message);
                }.bind(this))
            }.bind(this));
        }.bind(this));
    }

    onViewPress(item) {
        item.navigation.navigate('PDFViewer', {filePath: item.filePath});
    }

    _renderItem = ({item, index}) => (
        <ResourceItem
            index={index}
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
                          data={this.state.resources}
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

export default ResourcesScreen;
