'use strict';

import React from 'react';
import {
    Alert,
    BackHandler,
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    I18nManager
} from 'react-native';
import {dimens} from '../../config/styles';
import {getUserData} from "../../utils/Preferences";
import DateTimePicker from 'react-native-modal-datetime-picker';
import DiaryItem from "./diaryItem";
import ModalDropdown from 'react-native-modal-dropdown';
import I18n from '../../utils/i18n';
import Api from '../../network/Api';
import ProgressBar from "../../components/progressBar";
import moment from 'moment';
import KeyboardSpacer from "react-native-keyboard-spacer";
import {constants} from "../../config/constants";
import helper from "../../utils/helper";

class FoodDiaryScreen extends React.Component {
    selectedDietDay: number;
    selectedFoodProduct: string;
    calories: number;

    constructor(props) {
        super(props);

        this.state = {
            selectedDiet: 'diet_day',
            selectedProduct: 'permitted_product',
            caloriesPer100g: 0,
            grams: 0,
            isDateTimePickerVisible: false,
            timeText: I18n.t('Time'),
            diaryEntries: [],
            dietDaysOptions: [],
            foodProductOptions: [],
            hideSuggestions: true,
            showPicker: false,
            query: I18n.t('PermittedProduct')
        }
    }

    static navigationOptions = {
        header: null
    };

    showProgress(show) {
        this.setState({loading: show});
    }

    componentWillReceiveProps(nextProps) {
        this.getData(this.state.token, {id: this.state.userId});
        if (this.state.showPicker) {
            this.setState({showPicker: false})
        }
    }

    componentDidMount() {
        getUserData(function (userId, token) {
            this.setState({userId: userId});
            this.setState({token: token});
            const body = {
                id: userId
            };
            this.getData(token, body);
        }.bind(this));

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.showPicker) {
                this.setState({showPicker: false});
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    getData(token, body) {
        Promise.all([Api.getAllowedFoods(token, body), Api.getDietDays(token, body)]).then(responses => {
            this.showProgress(false);
            let foodProductsResp = responses[0];
            let dietDaysResp = responses[1];

            //console.log('Testingggggggg', JSON.stringify(foodProductsResp));
            let foodProductOptions = [];
            foodProductsResp.forEach(function (foodProduct) {
                foodProductOptions.push(foodProduct.displayName);
            });
            this.setState({foodProducts: foodProductsResp});
            this.setState({foodProductOptions: foodProductOptions});

            let dietDaysOptions = [];
            dietDaysResp.forEach(function (dietDay) {
                dietDaysOptions.push(dietDay.diaryDayCaption);
            });
            this.setState({dietDays: dietDaysResp});
            this.setState({dietDaysOptions: dietDaysOptions});

        }).catch(err => {
            this.showProgress(false)
        })
    }

    getAllowedFoods(token, body) {
        this.showProgress(true);
        Api.getAllowedFoods(token, body).then(function (response) {
            let foodProductOptions = [];
            response.forEach(function (foodProduct) {
                foodProductOptions.push(foodProduct.displayName);
            });
            this.setState({foodProducts: response});
            this.setState({foodProductOptions: foodProductOptions});
            this.showProgress(false);
        }.bind(this))
    }

    getDietDays(token, body) {
        Api.getDietDays(token, body).then(function (response) {
            let dietDaysOptions = [];
            response.forEach(function (dietDay) {
                dietDaysOptions.push(dietDay.diaryDayCaption);
            });
            this.setState({dietDays: response});
            this.setState({dietDaysOptions: dietDaysOptions});
        }.bind(this))
    }

    getFoodDiaryTable() {
        this.showProgress(true);
        const body = {
            id: this.state.userId,
            diaryId: this.selectedDietDay
        };
        Api.getFoodDiaryTable(this.state.token, body).then(function (response) {
            this.setState({diaryEntries: response.foodDiaryTableData});
            this.foodNote.setNativeProps({text: response.note});
            this.showProgress(false);
        }.bind(this)).catch(function (error) {
            this.showProgress(false);
        }.bind(this));
    }

    _writeDiary = () => {
        if (!this.selectedDietDay) {
            Alert.alert(I18n.t('alert'), I18n.t('error_select_diet_day'));
            return;
        }
        if (!this.selectedFoodProduct || !this.state.grams) {
            Alert.alert(I18n.t('alert'), I18n.t('error_enter_food_diary'));
            return;
        }
        let time = this.state.timeText;
        if (time === I18n.t('Time')) {
            time = moment(new Date()).format('hh:mm');
        }

        this.showProgress(true);
        const body = {
            id: this.state.userId,
            diaryId: this.selectedDietDay,
            timeTaken: time,
            productName: this.selectedFoodProduct,
            gram: this.state.grams,
            calories: this.calories
        };
        Api.addFoodDiary(this.state.token, body).then(function (response) {
            this.setState({diaryEntries: response.foodDiaryTableData});
            this.foodNote.setNativeProps({text: response.note});
            this.showProgress(false);
        }.bind(this)).catch(function (error) {
            this.showProgress(false);
        }.bind(this))
    };

    _writeNote = () => {
        Keyboard.dismiss();
        if (!this.selectedDietDay) {
            Alert.alert(I18n.t('alert'), I18n.t('error_select_diet_day'));
            return;
        }
        if (!this.state.dailyNote || this.state.dailyNote === '') {
            Alert.alert(I18n.t('alert'), I18n.t('error_empty_note'));
            return;
        }
        this.showProgress(true);
        const body = {
            id: this.state.userId,
            diaryId: this.selectedDietDay,
            note: this.state.dailyNote
        };
        Api.addFoodDiaryNote(this.state.token, body).then(function (response) {
            this.showProgress(false);
            Alert.alert('', I18n.t('note_added'));
        }.bind(this)).catch(function (err) {
            this.showProgress(false);
            Alert.alert('', err.message);
        }.bind(this));
    };

    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        this.setState({
            timeText: moment(date).format('hh:mm')
        });
        this._hideDateTimePicker();
    };

    static format(n) {
        return n > 9 ? "" + n : "0" + n;
    }

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
        const body = {
            id: this.state.userId,
            dailyFoodDiaryId: item.id,
            diaryId: this.selectedDietDay
        };
        Api.deleteFoodDiary(this.state.token, body).then(function (response) {
            this.setState({diaryEntries: response.foodDiaryTableData});
            this.showProgress(false);
        }.bind(this)).catch(function (error) {
            this.showProgress(false);
            Alert.alert(I18n.t('error'), error.message);
        }.bind(this))
    }

    _renderItem = (item, index) => {
        let x = index % 2;
        let backgroundColor = x === 0 ? '#f6f6f5' : '#eeeeee';
        return (
            <DiaryItem
                key={item.id}
                id={item.id}
                time={item.timeTaken}
                product={item.productName}
                gram={item.gram}
                backgroundColor={backgroundColor}
                calories={item.calories}
                total={item.caloriesSum}
                onDeletePress={this.onDeletePress}
            />
        )
    };

    _keyExtractor = (item, index) => item.id + "";

    render() {
        const {State: TextInputState} = TextInput;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();

        this.calories = parseFloat(this.state.grams / 100 * this.state.caloriesPer100g).toFixed(0);
        this.selectedFoodProduct = this.state.query;

        const {query} = this.state;
        const foodOptions = this._filterItems(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <View style={styles.container}>
                <ScrollView ref={ref => this.scrollView = ref} style={{flex: 1}}>
                    <ImageBackground style={{width: dimens.screenWidth, padding: 10}}
                                     source={require('../../assets/images/bg_food_diary.png')}>
                        <View style={{flexDirection: 'row', marginBottom: 10}}>

                            <View style={[styles.picker, {width: dimens.screenWidth * 0.7, flex: 0}]}>
                                <Image
                                    style={{
                                        position: 'absolute',
                                        end: 20,
                                        height: 55,
                                        width: 20,
                                        resizeMode: 'contain'
                                    }}
                                    source={require('../../assets/images/arrow_dropdown.png')}/>

                                <ModalDropdown
                                    textStyle={{
                                        color: 'white',
                                        fontSize: 16,
                                        alignItems: 'center',
                                        paddingStart: 10,
                                        paddingEnd: 40,
                                    }}
                                    dropdownTextStyle={{fontSize: 16}}
                                    defaultValue={I18n.t('DietDay')}
                                    options={this.state.dietDaysOptions}
                                    dropdownStyle={{marginStart: 20}}

                                    onSelect={idx => {
                                        this.selectedDietDay = this.state.dietDays[idx].id;
                                        this.getFoodDiaryTable();
                                    }}
                                />
                            </View>

                            <TouchableOpacity style={{
                                backgroundColor: '#ffffff33',
                                borderRadius: 100, flex: 1,
                                marginStart: 10,
                                justifyContent: 'center',
                                height: 55
                            }} onPress={() => this._showDateTimePicker()}>
                                <Text style={{width:"100%",marginStart: 10, color: 'white', fontSize: 16}}>
                                    {this.state.timeText}
                                </Text>
                            </TouchableOpacity>

                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                                mode={'time'}
                            />
                        </View>


                        <TouchableOpacity onPress={() => {
                            this.setState({query: ''});
                            this.toggleFoodPicker()
                        }}>
                            <View style={[styles.picker, {marginBottom: 10}]}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: 'white',
                                        fontSize: 16,
                                        alignItems: 'center',
                                        paddingStart: 10,
                                        paddingEnd: 40
                                    }}>
                                    {this.state.query}
                                </Text>
                                <Image
                                    style={{
                                        position: 'absolute',
                                        end: 20,
                                        height: 55,
                                        width: 20,
                                        resizeMode: 'contain'
                                    }}
                                    source={require('../../assets/images/arrow_dropdown.png')}/>

                                {/*<ModalDropdown
                                textStyle={{
                                    color: 'white',
                                    fontSize: 16,
                                    alignItems: 'center',
                                    paddingStart : 10,
                                    paddingEnd : 40
                                }}
                                dropdownTextStyle={{fontSize: 16}}
                                defaultValue={I18n.t('PermittedProduct')}
                                options={this.state.foodProductOptions}
                                dropdownStyle={{width: '80%', marginStart : 20}}
                                onSelect={idx => {
                                    this.selectedFoodProduct = this.state.foodProducts[idx].displayName;
                                    this.setState({caloriesPer100g: this.state.foodProducts[idx].caloriesPer100g});
                                }}
                            />*/}

                            </View>
                        </TouchableOpacity>

                        <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={styles.fieldContainer}>
                                <TextInput
                                    underlineColorAndroid="transparent"
                                    placeholder={I18n.t('Gram')}
                                    style={styles.textInput}
                                    onChangeText={text => {
                                        if (!text)
                                            text = '0';
                                        this.setState({grams: parseInt(text)})
                                    }}
                                    returnKeyType={"done"}
                                    keyboardType='numeric'
                                    placeholderTextColor={'#ffffffae'}
                                />
                            </View>

                            <View style={{flex: 1, justifyContent: 'center',}}>
                                <Text style={{marginStart: 20, color: 'white', fontSize: 15}}>
                                    {I18n.t('Calories') + ": " +
                                    parseFloat(this.state.grams / 100 * this.state.caloriesPer100g).toFixed(0)}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={this._writeDiary}
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
                            <Text
                                style={{textAlign: 'center', color: 'black', fontSize: 18}}>{I18n.t('Write')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    <View
                        style={{
                            width: dimens.screenWidth,
                            height: dimens.screenWidth * 0.1417,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                        <Image style={styles.barDiary} source={require('../../assets/images/bg_bar_food_diary.png')}/>
                        <Text style={[styles.text, styles.column1]}>
                            {I18n.t('Time')}
                        </Text>

                        <View style={styles.column2}>
                            <Text style={{
                                marginStart: 10,
                                fontSize: 12,
                                color: 'black',
                                textAlignVertical: 'center'
                            }}>
                                {I18n.t('FoodProduct')}
                            </Text>
                        </View>

                        <Text style={[styles.text, styles.column3]}>
                            {I18n.t('Gram')}
                        </Text>

                        <Text style={[styles.text, styles.column4]}>
                            {I18n.t('Calories')}
                        </Text>

                        <Text style={[styles.text, styles.column5]}>
                            {I18n.t('Total')}
                        </Text>
                    </View>
                    {/*<View style={{width: dimens.screenWidth, height: 200}}>
                        <FlatList nestedScrollEnabled={true} style={{flex: 1, backgroundColor: 'white'}}
                                  data={this.state.diaryEntries}
                                  renderItem={this._renderItem}
                                  keyExtractor={this._keyExtractor}>

                        </FlatList>
                    </View>*/

                        this.state.diaryEntries.map(function (item, index) {
                            return this._renderItem(item, index);
                        }.bind(this))
                    }

                    <View style={{flex: 1, height: 1, backgroundColor: '#c6c6c5'}}/>

                    <Text style={{margin: 15, alignSelf: 'center', fontSize: 18, color: 'black'}}>
                        {I18n.t('DailyNotes')}
                    </Text>

                    <TextInput
                        ref={ref => this.foodNote = ref}
                        style={{
                            borderRadius: 25,
                            borderColor: '#a8a8a8',
                            borderWidth: 1,
                            height: 150,
                            marginStart: 15,
                            marginEnd: 15,
                            marginBottom: 10,
                            padding: 15,
                            textAlignVertical: "top"
                        }}
                        multiline={true}
                        underlineColorAndroid="transparent"
                        returnKeyType={"done"}
                        numberOfLines={4}
                        onChangeText={text => this.setState({dailyNote: text})}
                    />

                    <TouchableOpacity
                        onPress={this._writeNote}
                        style={{
                            justifyContent: 'center', alignItems: 'center',
                            alignSelf: 'center',
                            width: BTN_WRITE_WIDTH,
                            height: BTN_WRITE_HEIGHT,
                            marginBottom: 10
                        }}>
                        <Image
                            style={{
                                position: 'absolute',
                                width: BTN_WRITE_WIDTH,
                                height: BTN_WRITE_HEIGHT
                            }}
                            source={require('../../assets/images/bg_btn_brown.png')}/>
                        <Text style={{textAlign: 'center', color: 'white', fontSize: 18}}>{I18n.t('Save')}</Text>
                    </TouchableOpacity>
                </ScrollView>
                {Platform.OS === 'ios' ?
                    <KeyboardSpacer onToggle={(keyboardState) => this.handleKeyboardOpen(keyboardState)}/> : null}
                {
                    this.state.showPicker && <View style={{
                        backgroundColor: 'white',
                        flex: 1, position: 'absolute', width: dimens.screenWidth,
                        height: '100%'
                    }}>
                        <TextInput
                            placeholder={I18n.t('search_here')}
                            style={{paddingStart: 10, paddingEnd: 10, height: 55}}
                            onChangeText={text => this.setState({query: text})}/>
                        {Platform.OS === 'ios' && <View style={{height: 0.5, backgroundColor: '#505050'}}/>}
                        <FlatList
                            data={foodOptions.length === 1 && comp(query, foodOptions[0]) ? [] : foodOptions}
                            keyExtractor={(item, index) => item}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={{
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        paddingStart: 5,
                                        paddingEnd: 5
                                    }}
                                    onPress={() => {
                                        this.setState({query: item});
                                        this.toggleFoodPicker();
                                        let idx = this.state.foodProductOptions.indexOf(item);
                                        this.setState({caloriesPer100g: this.state.foodProducts[idx].caloriesPer100g});
                                    }}>
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                }
                <ProgressBar
                    extraSpacing={115}
                    loading={this.state.loading}
                />
            </View>

        );
    }

    _filterItems(query) {
        /*if (query === '') {
            return [];
        }*/
        const {foodProductOptions} = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return foodProductOptions.filter(film => film.search(regex) >= 0);
    }

    toggleFoodPicker() {
        this.setState({showPicker: !this.state.showPicker})
    }

    handleKeyboardOpen(keyboardState) {
        if (keyboardState) {
            setTimeout(() => {
                this.scrollView.scrollToEnd()
            }, 50);
        }
        return undefined;
    }
}

const BTN_WRITE_WIDTH = dimens.screenWidth * 0.64722;
const BTN_WRITE_HEIGHT = BTN_WRITE_WIDTH * 0.21352;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        paddingStart: 10,
        height: 55
    },
    fieldContainer: {
        flex: 1,
        backgroundColor: '#ffffff33',
        borderRadius: 100
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
        position: 'absolute',
        transform: [{scaleX: constants.isRTL ? -1 : 1}]
    },
    text: {
        fontSize: 12,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    column1: {
        width: dimens.screenWidth * 0.12361
    },
    column2: {
        width: dimens.screenWidth * 0.34097
    },
    column3: {
        width: dimens.screenWidth * 0.125
    },
    column4: {
        width: dimens.screenWidth * 0.15417
    },
    column5: {
        width: dimens.screenWidth * 0.14444
    }
});

export default FoodDiaryScreen;
