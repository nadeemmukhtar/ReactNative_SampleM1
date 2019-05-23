'use strict';

import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity, Text, Platform, Alert} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {colors, dimens} from '../../config/styles';
import {getPref, PrefKeys} from "../../utils/Preferences";
import {constants} from "../../config/constants";
import Pdf from "react-native-pdf";
import I18n from "../../utils/i18n";
import BackButton from "../../components/back_button";

class PDFViewerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showOverlay: true
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount(){
        //console.log('Url', this.props.navigation.state.params.filePath);
    }

    render() {
        const source = {uri: this.props.navigation.state.params.filePath, cache: true};
        return (
            <View style={styles.container}>
                <BackButton navigation={this.props.navigation}/>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        //console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        //console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                        Alert.alert(I18n.t('error'), error.toString())
                    }}
                    style={styles.pdf}
                    onPageSingleTap={() => this.toggleOverlay()}
                />
            </View>
        );
    }

    toggleOverlay() {
        this.setState({showOverlay: !this.state.showOverlay});
    }
}

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
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
});

export default PDFViewerScreen;
