import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, ActivityIndicator, StyleSheet, Text, TouchableOpacity, View,ScrollView} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import HTML from 'react-native-render-html';
import HTMLView from 'react-native-htmlview';
import { WebView } from 'react-native-webview';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const backarrow = require('../../assets/backarrow.png');
const headerback = require('../../images/image-8.png')


const screenwidth = Dimensions.get('window').width
const screenheight = Dimensions.get('window').height

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};


const htmlContent = `
    <h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>
`;

export default class HowItWorksSeeAll extends Component {

    constructor(props) {
        super(props)
        this.state = {
            contentarray: [],
            isOpen: false,
            showloader:false,
            feature_url: this.props.navigation.state.params.DATA,
            featureName: this.props.navigation.state.params.feature_name,
            selectedItem: 'DashBoard',
            description: '',
            orderId: '',
            header: '',


        };
    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );
    }

    ActivityIndicatorLoadingView() {
   //making a view to show to while loading the webpage
   return (
        <Spinner visible={true} textContent={''} color={'black'}/>
   );
 }

    render() {
        return (
            <View style={styles.container}>
                {/* Started Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <Image source={backarrow} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                alignContent: 'center',
                                justifyContent: 'center',
                                width: '75%'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}>{this.state.featureName}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                {/* Ended Header View */}
            <WebView
            startInLoadingState
            renderLoading={this.ActivityIndicatorLoadingView}
            source={{ uri: this.state.feature_url }}
            style={{ marginTop: 15 }} />
                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>
            </View>


        )
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 90,

    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 40,
    },
    header_image: {
        flex: 1,
        height: 90
    },

    menu: {
        width: 25,
        height: 25,
        marginLeft: 10,

    },
    grid_itemsview: {
        width: '44%',
        height: 150,
        borderRadius: 10,
        marginLeft: 15,
        marginVertical: 7,
        backgroundColor: 'white',
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    }
})
