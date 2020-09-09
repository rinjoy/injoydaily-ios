import React, {Component} from 'react';
//import AnimatedLoader from "react-native-animated-loader";
//import * as IntentLauncher from 'expo-intent-launcher';
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
///import {RadioButton} from 'react-native-paper'

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
const gallaryblack = require('../../assets/gallaryblack.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');

const A1 = require('../../assets/A1.png');
const A2 = require('../../assets/A2.png');
const A3 = require('../../assets/A3.png');
const A4 = require('../../assets/A4.png');

const profile = require('../../images/image-9.png');
const messageopenblack = require('../../assets/messageopenblack.png');

const image11 = require('../../images/image-11.png');
const image12 = require('../../images/image-12.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class libraryChallenges extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_list: [],
            reportArray: [],
            userArray: [],
            goodsArray: [],
            imagesArray: [A1, A2, A3, A4, A1, A2, A3, A4, A1, A2, A3, A4],
            viewColor: ['#fbca6f', '#52dfca', '#94baf2', '#fb906f', '#fbca6f', '#52dfca', '#94baf2', '#fb906f', '#fbca6f', '#52dfca'],
            checked: true,
            accessToken: '',
            caterogryId: '',
            itemCount: 0,
            uid: '',
            isSubmitted: false,
            challengeId: '',
            featureId: '',
            showloader: false,
            day: '',
            week: '',
            offSet: 0,
            points: 0,
            colorArray: ['#fabc48', '#23d7bc', '#77a7ef', '#fca574', '#fabc48', '#23d7bc', '#77a7ef', '#fca574', '#fabc48', '#23d7bc'],
            colorArray2: ['#b5dcfd', '#a1dca8', '#85cad0', '#23d7bc', '#ff4d81', '#b5dcfd', '#a1dca8', '#85cad0', '#23d7bc', '#ff4d81'],
            offSetLoader: false,
        }


        // this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );


        //  alert(this.props.navigation.state.params.CHALLANGEID)
        this.getDataObject(this.props.navigation.state.params.CHALLANGEID);

    }


    getDataObject(dataObject) {
        //alert(dataObject)
        this.setState({challengeId: dataObject});
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                this.getDailyInspirationApiData(this.state.challengeId);
            }
        }, 1000)
    }


    async getDailyInspirationApiData(challangeId) {
        // alert('hi')
        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-library-challenge-report';

        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            uid: 132,
        };
        var token = `Bearer ${JSON.parse(token_)}`;
        // alert(JSON.stringify(parameters));
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
                    //console.log('See All', dataobject);
                    //alert(responseText)
                    this.setState({offSetLoader: false});
                    this.InheritedData(dataobject);


                }
            )
            .catch((error) => {
            })
    }

    setDataList(text) {
        //alert(text.content.high_five)
        this.setState({reportArray: text.content.action_report});
        this.setState({userArray: text.content.leaderboard});
        this.setState({goodsArray: text.content.high_five});

    }


    renderReports() {
        return (
            this.state.reportArray.map((data, index) => {
                return (
                    <View style={styles.reportRow}>
                        <View style={{
                            height: 80,
                            backgroundColor: this.state.colorArray[index],
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8
                        }}>
                            <View style={{
                                backgroundColor: 'transparent', position: 'absolute',
                                height: 80, width: '100%', borderTopLeftRadius: 8,
                                borderTopRightRadius: 8, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <TouchableOpacity onPress={() => alert('clicked')}>
                                    <Image source={this.state.imagesArray[index]}
                                           style={{height: 18, width: 18, marginRight: 80, marginTop: 15}}>

                                    </Image>
                                </TouchableOpacity>
                                {/*this.state.viewColor[index]*/}
                                <View style={{
                                    backgroundColor: this.state.viewColor[index],
                                    height: 40,
                                    width: 40,
                                    marginBottom: 25,
                                    borderRadius: 40 / 2,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        fontFamily: 'PoppinsBold',
                                        color: 'white',
                                        fontSize: 15
                                    }}>{data.actions_count}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 25, backgroundColor: 'white', justifyContent: 'center'}}>
                            <Text style={{
                                fontSize: 11, marginTop: 5,
                                alignItems: 'center', justifyContent: 'flex-start',
                                fontFamily: 'PoppinsBold',
                                paddingHorizontal: 15
                            }} numberOfLines={1}>{data.feature_name}</Text>
                        </View>
                    </View>
                )
            })
        )

    }

    renderUsers() {
        return (
            this.state.userArray.map((data, index) => {
                return (
                    <View style={styles.userRow}>
                        <View style={{
                            height: 80,
                            backgroundColor: this.state.colorArray2[index],
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8
                        }}>
                            <View style={styles.userSecRow}>

                                <Image source={{uri: data.user_details.profile_pic}}
                                       style={{height: 50, width: 50, borderRadius: 50 / 2}}>
                                </Image>
                            </View>


                        </View>
                        <View style={{height: 25, backgroundColor: 'white', justifyContent: 'center'}}>
                            <Text style={{
                                fontSize: 11, marginTop: 5,
                                alignItems: 'center', justifyContent: 'flex-start',
                                fontFamily: 'PoppinsBold',
                                paddingHorizontal: 15
                            }} numberOfLines={1}>{data.user_details.name}</Text>
                        </View>
                    </View>
                )
            })
        )

    }

    renderGoods() {
        return (
            this.state.goodsArray.map((data, index) => {
                return (
                    <View style={{
                        flex: 1, flexDirection: 'row',
                        backgroundColor: 'white', marginTop: 10,
                        marginHorizontal: 15, padding: 10,
                        borderRadius: 10,
                        elevation: 3,
                        marginBottom: 2,
                        shadowColor: "#000000",
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        shadowOffset: {
                            height: 1,
                            width: 1
                        }
                    }}>
                        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                            <View style={{flex: 0.20}}>
                                <Image source={{uri: data.user_details.profile_pic}}
                                       style={{height: 60, width: 60, borderRadius: 60 / 2}}>
                                </Image>
                            </View>
                            <View style={{flex: 0.80, backgroundColor: 'transparent'}}>
                                <Text style={{
                                    fontSize: 15,
                                    marginTop: 0,
                                    fontFamily: 'PoppinsBold',
                                    paddingHorizontal: 0
                                }}>{data.user_details.name}</Text>
                                <Text style={{
                                    fontSize: 12, marginTop: 0, fontFamily: 'PoppinsRegular', paddingHorizontal: 0
                                    , color: '#36454f'
                                }}>{data.shout_out.comment}</Text>
                            </View>


                        </View>

                    </View>
                )
            })
        )

    }

// <View style={{height:130,flex:1,flexDirection:'row',
//     backgroundColor:'red',marginTop:10,marginHorizontal:15,borderRadius:5}}></View>


    InheritedData(data) {
        // alert('1'//)
        if (data.status == true) {
            //this.setState({offSetLoader:false});
            this.setDataList(data);


        }

    }


    render() {

        return (
            <View style={styles.container}>
                {/* Header View */}
                <View style={styles.header_view}>
                    <View style={styles.header_image}>
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
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}>Gratitude Challenge
                                </Text>

                            </View>

                            <View style={styles.menu}>
                            </View>
                        </View>
                    </View>

                </View>
                {/* Ended Header View */}
                <ScrollView style={{flex: 1, backgroundColor: 'transparent'}}>
                    <View style={{flex: 0.30}}>
                        <ImageBackground
                            style={styles.header_image1}
                            source={{uri: "https://cultivate-development.s3.amazonaws.com/backend/web/img/game/1589268437_short.jpg"}}>
                        </ImageBackground>
                    </View>

                    <ScrollView style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 0}}>

                        <Text style={{
                            fontSize: 18,
                            marginTop: 13,
                            fontFamily: 'PoppinsBold',
                            paddingHorizontal: 15
                        }}>Report</Text>
                        <ScrollView style={{
                            height: 125, flex: 1, borderRadius: 2,
                            borderWidth: 0, borderColor: 'gray', marginLeft: 15, paddingLeft: 2
                            , marginTop: 10, flexDirection: 'row'
                        }}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{alignItems: 'center'}}
                                    horizontal={true}
                        >

                            {this.renderReports()}


                        </ScrollView>


                        <Text style={{fontSize: 18, marginTop: 13, fontFamily: 'PoppinsBold', paddingHorizontal: 15}}>Top
                            Users</Text>
                        <ScrollView style={{
                            height: 125, flex: 1, borderRadius: 2,
                            borderWidth: 0, borderColor: 'gray', marginLeft: 15, paddingLeft: 2
                            , marginTop: 10, flexDirection: 'row'
                        }}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{alignItems: 'center'}}
                                    horizontal={true}
                        >

                            {this.renderUsers()}


                        </ScrollView>

                        <Text style={{fontSize: 18, marginTop: 13, fontFamily: 'PoppinsBold', paddingHorizontal: 15}}>
                            Celeberating the good</Text>

                        {this.renderGoods()}


                    </ScrollView>


                </ScrollView>


            </View>
        );


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

    header_image1: {
        flex: 1,
        height: 150
    },
    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,


    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center', width: '93%',
        height: 45, flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'lightgray', marginHorizontal: 0,
        borderRadius: 5, marginBottom: 5, marginTop: 20
    },


    profile: {
        width: 60,
        height: 60,
    },
    reportRow: {
        height: 110, width: 125, backgroundColor: 'white',
        borderRadius: 8, marginRight: 15,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    userRow: {
        height: 110, width: 105, backgroundColor: 'white',
        borderRadius: 8,
        marginRight: 15,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    userSecRow: {
        backgroundColor: 'transparent', position: 'absolute',
        height: 80, width: '100%', borderTopLeftRadius: 8,
        borderTopRightRadius: 8, justifyContent: 'center', alignItems: 'center'
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
    }, loader: {
        marginTop: 5, alignItems: 'center', height: 60
    }
});
