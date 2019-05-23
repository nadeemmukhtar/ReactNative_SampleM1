import React from "react";
import {TouchableOpacity, View, StyleSheet, Image, ImageBackground, Text, Keyboard} from "react-native";
import {dimens} from "../config/styles";
import I18n from "../utils/i18n";


const TABBAR_HEIGHT = 55;
export default class WeightTabbar extends React.PureComponent {
    componentWillMount() {
        // setTimeout(5000)
    }

    render() {
        let navigation = this.props.navigation;
        let titles = [
            I18n.t('WeightDiary'),
            I18n.t('WeightGraph'),
            I18n.t('FoodDiary')
        ];
        const {routes, index} = navigation.state;
        return (
            <View style={styles.tabContainer}>
                {routes.map((route, idx) => {
                    const isActive = index === idx;
                    const textColor = isActive ? 'white' : 'black';
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate(route.routeName,
                                    {refreshGraph: true}
                                );
                                Keyboard.dismiss();
                            }}
                            key={route.routeName}
                        >
                            <ImageBackground
                                source={isActive ? require('../assets/images/tab_weight_on.png') :
                                    require('../assets/images/tab_weight_off.png')}
                                style={styles.tab}>

                                <Text style={{color: textColor, fontSize: 13, textAlign: 'center'}}>{titles[idx]}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    )
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabContainer: {
        height: TABBAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tab: {
        height: TABBAR_HEIGHT,
        width: dimens.screenWidth / 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

