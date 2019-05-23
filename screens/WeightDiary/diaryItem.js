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
        let statusColor = 'transparent';
        if (this.props.status === 'ERROR') {
            statusColor = '#f52f3a';
        } else if (this.props.status === 'WARNING') {
            statusColor = '#eaf088';
        }

        let itemHeight = 50;
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: itemHeight,
                    backgroundColor: this.props.backgroundColor
                }} {...this.props}>
                <Text style={[styles.text, styles.column1]}>
                    {this.props.date}
                </Text>

                <Text style={[styles.text, styles.column2]}>
                    {this.props.phase}
                </Text>

                <Text style={[styles.text, styles.column3]}>
                    {this.props.day}
                </Text>

                <Text style={[styles.text, styles.column4]}>
                    {this.props.weight}
                </Text>

                <View style={[styles.column5, {
                    backgroundColor: statusColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: itemHeight
                }]}>
                    <Text style={styles.text}>
                        {this.props.change}
                    </Text>
                </View>

                <TouchableOpacity onPress={this._onPress}>
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
        resizeMode: 'contain',
        marginStart : 13
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