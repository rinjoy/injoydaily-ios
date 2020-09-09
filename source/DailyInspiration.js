import React, {Component} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {RadioButton} from 'react-native-paper';
//import * as IntentLauncher from 'expo-intent-launcher';
import { Share, Button } from 'react-native';
const headerback = require('./../images/image-8.png');
const menuImg = require('./../assets/menu.png');
const tickets = require('./../assets/downarrow.png');
const downarrow = require('./../assets/downarrow.png');
const gallaryblack = require('./../assets/gallaryblack.png');
const nextgray = require('./../assets/nextgray.png');
const backarrow = require('./../assets/backarrow.png');
const profile = require('./../images/image-9.png');
const messageopenblack = require('./../assets/messageopenblack.png');

const image11 = require('./../images/image-11.png');
const image12 = require('./../images/image-12.png');
const sahre = require('./../assets/sahre.png');
const listimg = require('./../images/image-18.png');
const checkblue = require('./../assets/checkblue.png');

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class DailyInspiration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            checked: true
        }
    }

    componentDidMount() {
      alert('Here');
        getAccessToken().then(token =>
            this.getDailyInspirationApiData(token)
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );

    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message: 'In Progress',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };



    async getDailyInspirationApiData(token_) {
        //  alert(token_)
        this.setState({showloader: true});

        const url = global.base_url_live+'v1/api/get-daily-inspiration-all';

        var parameters = {
            token: JSON.parse(token_)
        };
        var token = `Bearer ${JSON.parse(token_)}`;
        fetch(url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    // alert(JSON.stringify(responseText))
                    //this.setState = ({data_list: dataobject})
                    // Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])

                    this.InheritedData(dataobject);

                }
            )
            .catch((error) => {
            })
    }

    setDataList(text) {
        this.setState({data_list: text});
    }

    InheritedData(data) {

        if (data.status == true) {
            this.setDataList(data.daily_insp_all);
        }
    }

    renderRow() {
        return this.state.data_list.map((dataHolder, index) => {
            return (
                <View style={{
                    flexDirection: 'column',
                    marginHorizontal: 15,
                    marginTop: 18,
                    marginBottom: 10
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 42
                    }}>
                        <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 10}}>WEDNESDAY,
                            DECEMBER 31ST </Text>
                        <TouchableOpacity
                            onPress={this.onShare}
                        >
                            <Image source={sahre} style={{width: 25, height: 25}}>
                            </Image>
                        </TouchableOpacity>
                    </View>


                    <View style={{flex: 1, height: 1, backgroundColor: 'gray'}}>
                    </View>
                    {/* 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';*/}
                    <Image source={{uri: dataHolder.images}} style={{
                        height: 220,
                        width: '93%',
                        marginTop: 10,
                        borderRadius: 12,
                        resizeMode: 'cover'
                    }}>
                    </Image>
                    <View style={{
                        backgroundColor: '#f3f3f3',
                        marginTop: 15,
                        borderRadius: 8, width: '93%',
                        flexDirection: 'column',
                         height:30
                    }}>
                       {/* <Text style={{
                            fontFamily: 'PoppinsRegular',
                            fontSize: 12,
                            marginHorizontal: 15,
                            marginTop: 0
                        }}
                              numberOfLines={3}
                        ></Text>*/}

                      {/*  <View style={{
                            width: '100%',
                            height: 0.5,
                            backgroundColor: '#d3d3d3',
                            marginTop: 8
                        }}>
                        </View>*/}

                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: '#f3f3f3',
                            height: 10,
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            justifyContent: 'flex-start',
                            marginTop: 10
                        }}>
                            <Image source={checkblue} style={{
                                width: 16,
                                height: 17,
                                marginLeft: 0,
                                alignItems: 'center',
                                resizeMode: 'contain'
                            }}>
                            </Image>
                            <Text style={{
                                fontFamily: 'PoppinsBold', marginLeft: 5, fontWeight: 'bold',
                                fontSize: 10, color: '#42abb7', justifyContent: 'center'
                            }}> 5 Points </Text>
                        </View>

                    </View>


                    {this.state.data_list.length - 1 == index &&
                    <TouchableOpacity style={styles.login_button}>
                        <RadioButton
                            value={this.state.checked}
                            status={this.state.checked ? 'checked' : 'unchecked'}

                            //onPress={() =>  this.onCheckBoxPressed() }
                        />
                        <Text
                            style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold'}}> GRAB 10
                            POINTS </Text>
                    </TouchableOpacity>
                    }
                </View>
            )
        })
    }

    render() {

        return (
            <View style={styles.container}>
                {/* Header View */}
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
                                marginLeft: 0,
                                alignContent: 'center',
                                justifyContent: 'center', backgroundColor: 'transparent',
                                flex: 1
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}>Daily Inspiration
                                </Text>

                            </View>

                            <View style={styles.menu}>
                            </View>
                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}

                <ScrollView style={{flex: 1, marginTop: 0}}>

                    {this.renderRow()}


                </ScrollView>


            </View>
        );


    }

    /*<TouchableOpacity style={styles.login_button} >
    <RadioButton
    value={this.state.checked}
    status={this.state.checked  ? 'checked' : 'unchecked'}

        //onPress={() =>  this.onCheckBoxPressed() }
    />
    <Text
    style={{fontSize: 13, color: 'white',fontFamily:'PoppinsSemiBold'}}> GRAB 10 POINTS </Text>
    </TouchableOpacity>*/


    onCheckBoxPressed() {

        if (this.state.checked) {
            this.setState({checked: false})
        } else {
            this.setState({checked: true})
        }
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
        backgroundColor: 'transparent',
        marginTop: 35,
    },
    header_image: {
        flex: 1,
        height: 90
    },

    menu: {
        width: 25,
        height: 16,
        marginLeft: 15,


    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45, flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5, marginBottom: 5, marginTop: 20
    },


    profile: {
        width: 60,
        height: 60,
    },

    name_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: 50,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        alignItems: 'center',

        height: 50,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        marginTop: 8
    },

    image_continer: {
        marginLeft: 8,
        width: 11,
        height: 14
    },
    passwordimage_continer: {
        marginLeft: 12,
        width: 18,
        height: 13
    },
});
