'use strict';

import React from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {dimens} from '../../config/styles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DiaryItem from "./diaryItem";
import Hyperlink from "react-native-hyperlink";
import ModalDropdown from 'react-native-modal-dropdown';
import I18n from "../../utils/i18n";
import {getUserData} from "../../utils/Preferences";
import Api from '../../network/Api';
import moment from 'moment';
import ProgressBar from "../../components/progressBar";
import {constants} from "../../config/constants";
import Preference from "react-native-preference";


const BTN_WRITE_WIDTH = dimens.screenWidth * 0.64722;
const BTN_WRITE_HEIGHT = BTN_WRITE_WIDTH * 0.21352;

class WeightDiaryScreen extends React.Component {
    selectedPhase: string;
    selectedDate: string;
    userWeight: string;

    constructor(props) {
        super(props);

        this.state = {
            selectedDiet: 'diet',
            calories: 0,
            isDateTimePickerVisible: false,
            timeText: 'Time',
            diaryEntries: [],
            showError: false,
            defaultPhase: '',
            selectedDate: I18n.t('Date'),
            aligntext: "left"
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
        console.log("alignRight-true->" + Preference.get("language"));
        if (Preference.get("language") == "he") {
            console.log("alignRight-true->" + Preference.get("language"));
            this.setState({aligntext: "right"});
            console.log("alignRight-true->" + this.state.aligntext);
        } else {
            console.log("alignRight-false->" + Preference.get("language"));
            this.setState({aligntext: "left"});
            console.log("alignRight-false->" + this.state.aligntext);
        }

        getUserData(function (userId, accessToken) {
            const body = {
                id: userId
            };
            Promise.all([Api.getWeightDiaryTable(accessToken, body), Api.getPhases(userId, accessToken)])
                .then(responses => {
                    this.showProgress(false);
                    let diaryTable = responses[0];
                    let respPhases = responses[1];
                    this.setState({diaryEntries: diaryTable.changeTableData});

                    let dietOptions = [];
                    respPhases.forEach(function (phase) {
                        dietOptions.push(phase.phaseName);
                    });
                    this.setState({phases: respPhases});
                    this.setState({dietOptions: dietOptions});
                    const tableItems = diaryTable.changeTableData;
                    respPhases.forEach(function (phase, index) {
                        if (tableItems[tableItems.length - 1].diaryDayPhaseCaption === phase.phaseName) {
                            this.selectedPhase = respPhases[index].id;
                            this.setState({defaultPhaseIndex: index});
                            this.dropDownPhase.setState({buttonText: respPhases[index].phaseName});
                        }
                    }.bind(this))

                }).catch(err => {
                console.log('Error', err);
                this.showProgress(false);
            });
            /*this.getPhases(userId, accessToken);
            this.getWeightChangeTable(userId, accessToken);*/
        }.bind(this));
    }

    _enterPressed = () => {
        //console.log("Entered values");
        if (!this.userWeight) {
            Alert.alert(I18n.t('alert'), I18n.t('error_enter_weight_diary'));
            return;
        }
        let date = this.selectedDate;
        if (!date) {
            date = moment(new Date()).format('YYYY-MM-DD');
        }
        this.showProgress(true);
        const body = {
            phaseId: this.selectedPhase,
            weight: this.userWeight,
            date: date
        };
        getUserData(function (userId, token) {
            body.id = userId;
            this.setState({showError: false});
            Api.addWeightDiary(token, body).then(function (response) {
                this.setState({diaryEntries: response.changeTableData}, function () {
                    this.handleAddDiaryResp(date);
                }.bind(this));
                if (response.warningMessage) {
                    Alert.alert(I18n.t('alert'), response.warningMessage);
                } else
                    Alert.alert('', I18n.t('weight_entered'));

                this.showProgress(false);
            }.bind(this)).catch(function (error) {
                this.showProgress(false);
                Alert.alert(I18n.t('error'), error.message);
            }.bind(this))
        }.bind(this));
    };

    handleAddDiaryResp(date) {
        let dateFormatted = moment(date).format('DD/MM');
        setTimeout(() => {
            this.refs.scrollView.scrollToEnd();
        }, 50);
        this.state.diaryEntries.forEach(function (entry, index) {
            if (entry.diaryDateFormated === dateFormatted) {
                //console.log(entry);
                if (entry.weightChangeNotificationArea) {
                    let message = entry.weightChangeNotificationArea;
                    let mapData = {};
                    message.map.forEach(function (data) {
                        let link = data.link;
                        mapData[link] = data.text;
                    });
                    //console.log(mapData);
                    let notifIcon = require('../../assets/images/ic_info.png');
                    let statusColor = '#3dd03d';
                    if (entry.weightChangeStatus === 'ERROR') {
                        notifIcon = require('../../assets/images/ic_caution.png');
                        statusColor = '#f52f3a';
                    } else if (entry.weightChangeStatus === 'WARNING') {
                        statusColor = '#eaf088';
                        notifIcon = require('../../assets/images/ic_caution.png');
                    }
                    this.setState({notifMessage: message.text});
                    this.setState({notifStatus: statusColor});
                    this.setState({notifIcon: notifIcon});
                    this.setState({notifTitle: message.title});
                    this.setState({notifMapData: mapData}, function () {
                        this.setState({showError: true}, function () {
                            setTimeout(() => {
                                this.refs.scrollView.scrollToEnd();
                            }, 50);
                        }.bind(this));
                    }.bind(this));
                }
            }
        }.bind(this));
    }

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        //2018-10-02
        this.selectedDate = moment(date).format('YYYY-MM-DD');
        this.setState({selectedDate: moment(date).format('DD/MM')});
        this._hideDateTimePicker();
    };

    onDeletePress = item => {
        Alert.alert('', I18n.t('delete_weight'), [
            {text: I18n.t('yes'), onPress: () => this.deleteTableItem(item)},
            {
                text: I18n.t('no'), onPress: () => {
                }
            }]);
    };

    deleteTableItem(item) {
        this.showProgress(true);
        getUserData(function (userId, token) {
            const body = {
                id: userId,
                diaryDayId: item.id
            };
            Api.deleteWeightDiary(token, body).then(function (response) {
                this.setState({diaryEntries: response.changeTableData});
                this.showProgress(false);
                this.setState({showError: false});
            }.bind(this)).catch(function (error) {
                this.showProgress(false);
                Alert.alert(I18n.t('error'), error.message);
            }.bind(this))
        }.bind(this))
    }

    _renderItem = (item, index) => {
        //console.log(item);
        let x = index % 2;
        let backgroundColor = x === 0 ? '#f6f6f5' : '#eeeeee';
        return (
            <DiaryItem
                key={item.diaryId}
                id={item.diaryId}
                date={item.diaryDateFormated}
                phase={item.diaryDayPhaseCaption}
                day={item.dietDay}
                backgroundColor={backgroundColor}
                weight={item.morningWeight}
                change={item.weightChanged}
                onDeletePress={this.onDeletePress}
                status={item.weightChangeStatus}
            />
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView ref={"scrollView"} style={{flex: 1}}>
                    <ImageBackground
                        style={{width: dimens.screenWidth, paddingTop: 20, paddingBottom: 30}}
                        source={require('../../assets/images/bg_food_diary.png')}>

                        <View style={[styles.picker, {marginBottom: 20, marginStart: 10, marginEnd: 10}]}>
                            <Image
                                style={{position: 'absolute', end: 20, height: 55, width: 20, resizeMode: 'contain'}}
                                source={require('../../assets/images/arrow_dropdown.png')}/>

                            <ModalDropdown
                                ref={ref => this.dropDownPhase = ref}
                                textStyle={{
                                    color: 'white',
                                    fontSize: 16,
                                    alignItems: 'center',
                                    paddingStart: 20,
                                    paddingEnd: 20,
                                    textAlign: this.state.aligntext
                                }}
                                defaultValue={this.state.defaultPhase}
                                defaultIndex={this.state.defaultPhaseIndex}
                                options={this.state.dietOptions}
                                dropdownTextStyle={{fontSize: 16}}
                                dropdownStyle={{height: 6 * 42.5, width: 150, marginStart: 20}}
                                onSelect={idx => {
                                    this.selectedPhase = this.state.phases[idx].id;
                                }}
                            />

                        </View>

                        <View style={{
                            flexDirection: 'row',
                            marginBottom: 20,
                            alignItems: 'center',
                            paddingStart: 10,
                            paddingEnd: 10
                        }}>
                            <View style={styles.fieldContainer}>
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 16,
                                        paddingStart: 20,
                                        paddingEnd: constants.isRTL ? 20 : 0,
                                        textAlign: this.state.aligntext
                                    }}>
                                    {this.state.selectedDate}
                                </Text>
                            </View>
                            <TouchableOpacity style={{marginStart: 10}} onPress={() => this._showDateTimePicker()}>
                                <Image style={{resizeMode: 'contain', width: 30, height: 30}}
                                       source={require('../../assets/images/ic_calendar.png')}/>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                mode={'date'}
                            />
                        </View>


                        <View style={{
                            flexDirection: 'row',
                            marginBottom: 10,
                            alignItems: 'center',
                            paddingStart: 10,
                            paddingEnd: 10
                        }}>
                            <View style={styles.fieldContainer}>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    placeholder={I18n.t('Weight')}
                                    style={{
                                        flex: 1,
                                        color: 'white',
                                        fontSize: 16,
                                        paddingStart: 20,
                                        height: 55,
                                        textAlign:this.state.aligntext
                                    }}
                                    onChangeText={text => {
                                        this.userWeight = text;
                                    }}
                                    returnKeyType={"done"}
                                    //keyboardType='numeric'
                                    keyboardType='phone-pad'
                                    placeholderTextColor={'#ffffffae'}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={this._enterPressed}
                            style={{
                                justifyContent: 'center', alignItems: 'center',
                                alignSelf: 'center',
                                width: BTN_WRITE_WIDTH,
                                height: BTN_WRITE_HEIGHT,
                                paddingStart: 10, paddingEnd: 10
                            }}>
                            <Image
                                style={{
                                    position: 'absolute',
                                    width: BTN_WRITE_WIDTH,
                                    height: BTN_WRITE_HEIGHT
                                }}
                                source={require('../../assets/images/bg_btn_gray.png')}/>
                            <Text style={{
                                textAlign: 'center',
                                color: 'black',
                                fontSize: 18
                            }}>{I18n.t('Enter')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <Text style={{
                        textAlign: 'center',
                        width: '100%',
                        marginTop: 15,
                        marginBottom: 15,
                        color: 'black',
                        fontWeight: 'bold'
                    }}>{I18n.t('WeightChangeTable')}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: dimens.screenWidth,
                            height: dimens.screenWidth * 0.1417
                        }}>
                        <Image style={styles.barDiary} source={require('../../assets/images/bg_bar_weight_diary.png')}/>
                        <Text style={[styles.text, styles.column1]}>
                            {I18n.t('Date')}
                        </Text>
                        <Text style={[styles.text, styles.column2]}>
                            {I18n.t('Phase')}
                        </Text>
                        <Text style={[styles.text, styles.column3]}>
                            {I18n.t('Day')}
                        </Text>
                        <Text style={[styles.text, styles.column4]}>
                            {I18n.t('Weight')}
                        </Text>
                        <Text style={[styles.text, styles.column5]}>
                            {I18n.t('Change')}
                        </Text>
                    </View>
                    {/*<View style={{width: dimens.screenWidth, height: 200}}>
                        <FlatList style={{flex: 1, backgroundColor: 'white'}}
                                  data={this.state.diaryEntries}
                                  renderItem={this._renderItem}
                                  keyExtractor={this._keyExtractor}>

                        </FlatList>
                    </View>*/

                        this.state.diaryEntries && this.state.diaryEntries.map(function (item, index) {
                            return this._renderItem(item, index);
                        }.bind(this))
                    }
                    <View style={{flex: 1, height: 1, backgroundColor: '#c6c6c5'}}/>
                    {this.state.showError ? <View style={{
                        margin: 10,
                        borderRadius: 10,
                        backgroundColor: this.state.notifStatus,
                        padding: 10
                    }}>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <Image style={{
                                width: 15,
                                height: 15,
                                resizeMode: 'contain',
                                marginEnd: 10
                            }}
                                   source={this.state.notifIcon}/>

                            <Text style={{fontSize: 12, color: 'black'}}>
                                {this.state.notifTitle}
                            </Text>

                        </View>
                        <Hyperlink
                            onPress={(url, text) => this.openUrl(text, url)}
                            linkStyle={{
                                color: '#385eec',
                                fontSize: 11,
                                textDecorationLine: 'underline'
                            }}
                            linkText={url => this.state.notifMapData[url]}
                        >
                            <Text style={{fontSize: 11}}>
                                {this.state.notifMessage}
                            </Text>
                        </Hyperlink>
                    </View> : null}
                </ScrollView>
                <ProgressBar
                    extraSpacing={115}
                    loading={this.state.loading}
                />
            </View>
        );
    }

    openUrl(text, url) {
        /*console.log('Contact Support', url);
        let supportUrl;
        switch (I18n.locale) {
            case 'en':
                supportUrl = 'http://www.simeonsdiet.com/contact-support/';
                break;
            case 'et':
                supportUrl = 'http://support.simeonsidieet.ee/contact-support';
                break;
        }*/
        if (url.match(/\/contact-support/)) {
            this.props.navigation.navigate('Support')
        } else
            this.props.navigation.navigate('PDFViewer', {filePath: url})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee'
    },
    image: {
        flex: 1,
        width: dimens.screenWidth,
        resizeMode: Image.resizeMode.cover
    },
    pickerContainer: {
        flex: 1,
        justifyContent: 'center',
        width: dimens.screenWidth - dimens.screenWidth * 0.30
    },
    picker: {
        flex: 1,
        backgroundColor: '#ffffff33',
        borderRadius: 100,
        height: 55,
        justifyContent: 'center'
    },
    textInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingStart: 20,
        height: 55
    },
    fieldContainer: {
        flex: 1,
        height: 55,
        backgroundColor: '#ffffff33',
        borderRadius: 100,
        justifyContent: 'center'
    },
    btnWrite: {
        width: BTN_WRITE_WIDTH,
        height: BTN_WRITE_HEIGHT,
        resizeMode: 'contain'
    },
    barDiary: {
        width: dimens.screenWidth,
        height: dimens.screenWidth * 0.1417,
        resizeMode: 'contain',
        position: 'absolute'
    },
    text: {
        fontSize: 12,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    column1: {
        width: dimens.screenWidth * 0.165278
    },
    column2: {
        width: dimens.screenWidth * 0.168056
    },
    column3: {
        width: dimens.screenWidth * 0.166667
    },
    column4: {
        width: dimens.screenWidth * 0.166667
    },
    column5: {
        width: dimens.screenWidth * 0.16875
    }
});

export default WeightDiaryScreen;
