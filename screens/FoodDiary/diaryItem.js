import {Image, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";
import {dimens} from "../../config/styles";

export default class DiaryItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        this.props.onDeletePress(this.props);
    };

    render() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: this.props.backgroundColor
                }} {...this.props}>
                <Text style={[styles.text, styles.column1]}>
                    {this.props.time}
                </Text>

                <View style={styles.column2}>
                    <Text style={{
                        marginStart : 10,
                        fontSize: 12,
                        color: 'black',
                        textAlignVertical: 'center'
                    }}>
                        {this.props.product}
                    </Text>
                </View>

                <Text style={[styles.text, styles.column3]}>
                    {this.props.gram}
                </Text>

                <Text style={[styles.text, styles.column4]}>
                    {this.props.calories}
                </Text>

                <Text style={[styles.text, styles.column5]}>
                    {this.props.total}
                </Text>

                <TouchableOpacity
                    onPress={this._onPress}>
                    <Image style={styles.image} source={require('../../assets/images/ic_remove.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    image: {
        width: dimens.screenWidth * 0.076389,
        height: dimens.screenWidth * 0.076389,
        resizeMode: 'contain'
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