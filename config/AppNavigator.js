import {
    createDrawerNavigator,
    createMaterialTopTabNavigator,
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';
import React from 'react';
import {I18nManager, Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import SplashScreen from '../screens/Splash';
import LoginScreen from '../screens/Login';
import LangScreen from '../screens/LangScreen';
import ResourcesScreen from "../screens/Resources";
import UserGuideScreen from "../screens/UserGuide";
import WeightDiaryScreen from "../screens/WeightDiary";
import SupportScreen from "../screens/Support";
import HomeTabbar from '../components/homeTabbar';
import WeightTabbar from "../components/weightTabbar";
import WeightGraphScreen from "../screens/WeightGraph/WeightGraph";
import FoodDiaryScreen from "../screens/FoodDiary/FoodDiary";
import PDFViewerScreen from "../screens/PDFViewer/PDFViewer";
import {dimens} from "./styles";
import {clearPrefs} from "../utils/Preferences";
import I18n from "../utils/i18n";
import {constants} from "./constants";
import Preference from 'react-native-preference';



const WeightTabs = createMaterialTopTabNavigator({
    WeightDiary: {screen: WeightDiaryScreen},
    WeightGraph: {screen: WeightGraphScreen},
    FoodDiary: {screen: FoodDiaryScreen},
}, {

    tabBarComponent: WeightTabbar,
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true
});

const HomeTabs = createMaterialTopTabNavigator({
        WeightFoodDiary: {screen: WeightTabs},
        UserGuide: {screen: UserGuideScreen},
        Resources: {screen: ResourcesScreen},
        Support: {screen: SupportScreen}
    }
    , {
        tabBarComponent: HomeTabbar,
        swipeEnabled: false,
        animationEnabled: false,
        lazy: false
    });

//let DRAWER_POSITION = constants.isRTL === I18nManager.isRTL ? 'right' : 'left';

const AppDrawer = createDrawerNavigator({
        AppDrawer: {screen: HomeTabs},
    },
    {
        drawerPosition: Preference.get("screenDrawer"),
        //Preference.get("screendrawer");
        //drawerPosition: "left",
        drawerBackgroundColor: '#52800A',
        contentOptions: {
            activeTintColor: 'white'
        },
        contentComponent: props => {
            let items = [{
                key: 'WeightFoodDiary',
                itemName: I18n.t('interactive_diary'),
                icon: require('../assets/images/tab_weight_diary.png')
            }, {
                key: 'UserGuide',
                itemName: I18n.t('process_guide'),
                icon: require('../assets/images/tab_user_guide.png')
            }, {
                key: 'Resources',
                itemName: I18n.t('files_and_res'),
                icon: require('../assets/images/tab_resources.png')
            }, {
                key: 'Support',
                itemName: I18n.t('contact_us'),
                icon: require('../assets/images/tab_support.png')
            }, {
                key: 'Language',
                itemName: I18n.t('language'),
                icon: require('../assets/images/language.png')
            }, {
                key: 'Splash',
                itemName: I18n.t('logout'),
                icon: require('../assets/images/logout.png')
            }];

            function _onPress(key) {

                if (key === 'Splash') {
                    clearPrefs(function () {
                        props.navigation.navigate(key);
                    });
                } else if (key === 'Language') {
                    console.log("Language Pressed");
                    //props.navigation.navigate("LangScreen");
                    props.navigation.replace('LangScreen');
                } else
                    props.navigation.navigate(key);
            }

            let headerWidth = dimens.screenWidth * 0.75;
            let headerHeight = headerWidth * 0.54;

            return (
                <View>
                    {/*<Image style={{width: headerWidth, height: headerHeight, resizeMode: 'contain'}}
                           source={require('../assets/images/login_head.png')}/>*/}
                    {items.map(item =>
                        <TouchableOpacity style={{padding: 10}} key={item.key} onPress={() => {
                            _onPress(item.key)
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image style={{marginEnd: 10, height: 40, width: 40, resizeMode: 'contain'}}
                                       source={item.icon}/>
                                <Text style={{color: 'white'}}>{item.itemName}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            )
        }
    });

const HomeNav = createStackNavigator({
    stackNavigator: {screen: AppDrawer},
    PDFViewer: {screen: PDFViewerScreen},
    LangScreen: {screen: LangScreen}
}, {
    headerMode: 'none'
});

const AppNavigator = createSwitchNavigator({
    Splash: {screen: SplashScreen},
    Login: {screen: LoginScreen},
    Home: {screen: HomeNav}
});


//Localization library
//https://github.com/AlexanderZaytsev/react-native-i18n
// IOS setup required

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: 'black', paddingTop: getStatusBarHeight(true)}}>
                <StatusBar
                    backgroundColor="black"
                    barStyle="light-content"
                />
                <AppNavigator style={{flex: 1}} screenProps={this.props}/>
            </View>
        );
    }
}

export default App;
