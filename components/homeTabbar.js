import React from "react";
import {TouchableOpacity, View, StyleSheet, Image, ImageBackground, Keyboard} from "react-native";
import {dimens} from "../config/styles";
import Preference from "react-native-preference";

const TABBAR_HEIGHT = 60;
export default class HomeTabbar extends React.PureComponent {

    render() {
        let navigation = this.props.navigation;
        let images = [
            require('../assets/images/tab_weight_diary.png'),
            require('../assets/images/tab_user_guide.png'),
            require('../assets/images/tab_resources.png'),
            require('../assets/images/tab_support.png')
        ];


        const {routes, index} = navigation.state;
        return (
            <ImageBackground source={require('../assets/images/bg_tabbar.png')} style={styles.tabContainer}>

                <TouchableOpacity
                    onPress={() => {
                        navigation.openDrawer();
                        Keyboard.dismiss();
                    }}
                >
                    <Image style={[styles.tab, {
                        height: TABBAR_HEIGHT,
                        width: dimens.screenWidth * 0.05417,
                        marginStart: 10,
                        marginEnd: 10
                    }]}
                           source={require('../assets/images/menu.png')}/>
                </TouchableOpacity>
                {routes.map((route, idx) => {
                    const color = (index === idx) ? '#f5fe00' : 'white';
                    const isActive = index === idx;
                    return (
                        <View style={{flexDirection: 'row', alignItems: 'center'}} key={route.routeName}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate(route.routeName);
                                    Keyboard.dismiss();
                                }}
                            >
                                <Image style={[styles.tab, {tintColor: color}]} source={images[idx]}/>
                            </TouchableOpacity>
                            {idx < 3 && <View style={{height: TABBAR_HEIGHT, width: 1, backgroundColor: '#314c05'}}/>}
                        </View>
                    )
                })}

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    tabContainer: {
        height: TABBAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tab: {height: 37, width: dimens.screenWidth * 0.2306, resizeMode: 'contain'}
});

