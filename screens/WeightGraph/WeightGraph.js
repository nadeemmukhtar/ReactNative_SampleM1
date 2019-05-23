'use strict';

import React from 'react';
import {Image, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import {NavigationActions,StackActions} from 'react-navigation';
import {appStyles, colors, dimens} from '../../config/styles';
import {getPref, getUserData, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";
import {LineChart, XAxis, YAxis} from 'react-native-svg-charts'
import moment from 'moment';
import I18n from "../../utils/i18n";
import Api from '../../network/Api';
import ProgressBar from "../../components/progressBar";

class WeightGraphScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dates: [],
            load: 1.2,
            loss: 1.5,
            average: 4,
            stablize: '-',
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentWillReceiveProps(nextProps) {
        this.getData();
    }

    getData() {
        this.showProgress(true);
        getUserData(function (userId, token) {
            const body = {
                id: userId
            };
            Api.getWeightGraph(token, body).then(function (response) {
                this.setState({load: response.dietSummaryLoadingValue});
                this.setState({loss: response.dietSummaryDietPhaseValue});
                this.setState({average: response.dietSummaryAverageLossValue});
                this.setState({stablize: response.dietSummaryStabilizationWeightValue});
                //console.log("response", response);
                if (response) {
                    let data = [];
                    let dates = [];

                    response.weightChartData.forEach(function (entry) {
                        data.push(parseFloat(entry.y));
                        dates.push(entry.x);
                    });
                    this.setState({data: data});
                    this.setState({dates: dates});
                }
                this.showProgress(false);
            }.bind(this)).catch(function (error) {
                Alert.alert(I18n.t('error'), error.message);
                this.showProgress(false);
            }.bind(this));
        }.bind(this));
    }

    showProgress(show) {
        this.setState({loading: show});
    }

    static formatNumber(n, d) {
        let x = ('' + n).length;
        let p = Math.pow;
        d = p(10, d);
        x -= x % 3;
        return Math.round(n * d / p(10, x)) / d + " KMGTPE"[x / 3]
    }

    render() {
        const axesSvg = {fontSize: 10, fill: 'black'};
        const verticalContentInset = {top: 10, bottom: 10};
        const xAxisHeight = 60;
        return (
            <View style={styles.container}>

                {/*<TouchableOpacity onPress={() => this.getData()} style={{alignSelf: 'flex-end'}}>
                    <Image style={{margin: 10, height: 30, width: 30, resizeMode: 'contain'}}
                           source={require('../../assets/images/ic_refresh.png')}/>
                </TouchableOpacity>*/}

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 15,
                    paddingStart: 10,
                    paddingEnd: 10,
                    backgroundColor: 'white'
                }}>
                    <Text style={styles.headerText}>
                        {I18n.t('Load') + ":" + this.state.load + '  '}
                    </Text>

                    <Text style={styles.headerText}>
                        {I18n.t('Loss') + ":" + this.state.loss + '  '}
                    </Text>

                    <Text style={styles.headerText}>
                        {I18n.t('Average') + ":" + this.state.average + '  '}
                    </Text>

                    <Text style={styles.headerText}>
                        {I18n.t('Stabilize') + ":" + this.state.stablize}
                    </Text>

                </View>

                <View style={{
                    height: dimens.screenHeight * 0.60,
                    padding: 10,
                    flexDirection: 'row'
                }}>
                    <YAxis
                        data={this.state.data}
                        style={{marginBottom: xAxisHeight}}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{flex: 1, marginStart : 10}}>
                        <LineChart
                            style={{flex: 1}}
                            data={this.state.data}
                            contentInset={verticalContentInset}
                            svg={{stroke: '#2986f9'}}
                        />
                        <XAxis
                            style={{marginHorizontal: -10, height: xAxisHeight}}
                            data={this.state.data}
                            formatLabel={(value, index) => this.state.dates[index]}
                            contentInset={{start: 10, end: 20}}
                            svg={{fontSize: 10, fill: 'black', rotation: -90, originY: 20, y: 20}}
                        />
                    </View>
                </View>
                <ProgressBar
                    extraSpacing={115}
                    loading={this.state.loading}
                />
            </View>
        );
    }

    navigateToLogin() {
        this.props.navigation.navigate('Login');
    //     const resetAction = StackActions.reset({
    //         index: 0,
    //         actions: [NavigationActions.navigate({routeName: 'Login'})]
    //     });
    //     this.props.navigation.dispatch(resetAction);
    }
}

const styles = StyleSheet.create({
    container: {
        width: dimens.screenWidth,
        height: dimens.screenHeight,
        backgroundColor: '#eeeeee'
    },
    image: {
        flex: 1,
        width: dimens.screenWidth,
        resizeMode: Image.resizeMode.cover
    },
    headerText: {
        color: 'black',
        fontSize: 10
    }
});

export default WeightGraphScreen;
