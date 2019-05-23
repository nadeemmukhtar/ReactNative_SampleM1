import {Image, Text, TouchableOpacity, View, StyleSheet, I18nManager} from "react-native";
import React from "react";
import I18n from "../../utils/i18n";
import GuideItem from "../UserGuide/guideItem";
import {dimens} from "../../config/styles";

export default class ResourceItem extends React.PureComponent {
    displayNames = ['diary_nutrition_diary',
        'step_by_step_checklist',
        'food_table_phase_1_fattening',
        'food_table_phase_2_500_caloories_diet',
        'food_table_phase_4_stabilization',
        'authorized_foods'];

    constructor(props) {
        super(props);
    }

    _onPress = () => {
        this.props.onViewPress(this.props);
    };

    /*replaceAll(str, find, replace) {
        return str.replace(new RegExp(GuideItem.escapeRegExp(find), 'g'), replace);
    }

    static escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }*/

    render() {
        return (
            <View {...this.props}>
                <View style={{
                    height: 60,
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    paddingStart : 30, paddingEnd : 10
                }}>
                    <Text style={{color: 'black', flex: 1}}>
                        {this.props.displayName}
                    </Text>
                    <TouchableOpacity
                        style={{justifyContent: 'center', alignItems: 'center', height: 40, width: 90, marginStart: 10}}
                        onPress={this._onPress}>
                        <Image style={{position: 'absolute', height: 40, width: 90, resizeMode: 'contain'}}
                               source={require('../../assets/images/bg_btn_view.png')}/>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={{height: 20, width: 20, marginEnd: 10, resizeMode: 'contain'}}
                                   source={(require('../../assets/images/ic_btn_view.png'))}/>
                            <Text style={{color: 'white'}}>
                                {I18n.t('View')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: '#d7d7d7'}}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({});