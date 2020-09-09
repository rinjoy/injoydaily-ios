import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from "react-native-loading-spinner-overlay";
import HTML from "react-native-render-html";
import Emoji from "react-native-emoji";
import Toast from "react-native-easy-toast";

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const backarrow = require('../../assets/backarrow.png');

const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;
export default class CoreValues extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            challengeId: this.props.navigation.state.params.challenge_details.challenge_id,
            categoryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            featureId: 12,
            day: this.props.navigation.state.params.challenge_details.day,
            offSetLoader: true,
            uid: '',
            week: this.props.navigation.state.params.challenge_details.week,
            hederTitle: this.props.navigation.state.params.challenge_details.feature_name,
            actionStatus: false,
            authTitle: '',
            question: '',
            description: '',
            buttonHint: '',
            imageUri: '',
            isSubmitted: false,
            checkenw:false

        }
    }

    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );
        //alert(JSON.stringify(this.props.navigation.state.params.DATA));
        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.id);
                }
            }
        }, 1000);
    }

    async getAllDew(challangeId, featureId, day, categoryId, week, uid) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-core-values-content-see-all';

        var parameters = {
            challenge_id: challangeId,
            feature_id: featureId,
            day: day,
            category_id: categoryId,
            week: week,
            uid: uid
        };
        //alert(JSON.stringify(parameters));
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
                    console.log('dataobject', dataobject);
                    // alert(responseText)
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }


    InheritedData(data) {
        if (data.status == true) {
            this.setState({offSetLoader: false});
            // this.setState({allData:data});
            var question = data.core_values_content.heading
            var authTitle = data.core_values_content.title
            var imageUri = data.core_values_content.image
            var description = data.core_values_content.description
            var actionStatus = data.core_values_content.user_actions.action_status;
            // alert(actionStatus)
            this.setState({authTitle: authTitle});
            this.setState({question: question});
            this.setState({imageUri: imageUri});
            this.setState({actionStatus: actionStatus});
            this.setState({description: description});
            this.setState({checkenw: true});

        }
    }

    async submitData(challangeId, featureId, week, uid) {

        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/submit-core-values-action';
        var parameters = {
            challenge_id: challangeId,
            feature_id: featureId,
            week: week,
            uid: uid,
        };
        // alert(JSON.stringify(parameters));
        // return false;
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
                    if (dataobject.status) {
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>Nice!  </Text>
                                <Emoji name="+1" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                />

                            </View>)
                        this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.id);
                    }

                }
            )
            .catch((error) => {
            })
    }

    shiftBack() {
      var obj={'day':this.state.day, 'week':this.state.week, 'challengeId':this.state.challengeId, 'uid': this.state.id}
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='bottom'
                    positionValue={110}
                    fadeInDuration={500}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.shiftBack()}>
                                <Image source={backarrow} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                alignContent: 'center',
                                justifyContent: 'center',
                                width: '70%'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}
                                      numberOfLines={1}>{this.state.hederTitle}</Text>
                            </View>

                        </View>
                    </ImageBackground>
                    <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>
                </View>
                {/* Ended Header View */}

                    <Text style={{
                        paddingHorizontal: 15, fontFamily: 'PoppinsSemiBold', fontSize: 16, backgroundColor: 'transparent',
                        marginTop: 10
                    }}>{this.state.question}</Text>

                    <Image source={{uri: this.state.imageUri}} style={{
                        height: 200,
                        width: '100%',
                        marginTop: 12,
                        borderRadius: 0,
                        resizeMode: 'cover'
                    }}>
                    </Image>
                    <Text style={{paddingHorizontal: 15, marginTop: 15, fontFamily: 'PoppinsBold', fontSize: 16}}>{this.state.authTitle}</Text>
                    <View style={{height: 180, backgroundColor:'#f0f0f0', marginHorizontal: 6,
                        flex: 1,
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginBottom: 0, marginTop: 10,
                        elevation: 1,
                        shadowColor: "#f0f0f0",
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        shadowOffset: {
                            height: 1,
                            width: 1
                        }
                    }}>
                    <ScrollView persistentScrollbar={true} style={{flex: 1, backgroundColor: 'transparent',}}>
                    <HTML
                        allowFontScaling={false}
                        html={this.state.description}
                        imagesMaxWidth={screenWidth}
                        containerStyle={{marginTop: 5, paddingHorizontal: 10}}
                    />
                    </ScrollView>
                    </View>

                    {/*{!this.state.actionStatus && !this.state.isSubmitted &&*/}
                    <View style={{justifyContent: 'center', paddingHorizontal: 15, alignItems: 'center', marginBottom: 20}}>
                    <TouchableOpacity
                        style={styles.login_button}
                        onPress={() => this.submitData(this.state.challengeId, this.state.featureId, this.state.day, this.state.id, this.state.week)}
                    >
                    {this.state.actionStatus &&
                      <Image source={checkyellow}
                             style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                      </Image>
                    }
                    {!this.state.actionStatus &&
                      <Image source={checkgray}
                             style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                      </Image>
                    }

                        <Text style={{
                            fontSize: 14,
                            color: 'white',
                            marginLeft: 7,
                            fontFamily: 'PoppinsSemiBold'
                        }}>Submit 10 Points</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        );
    }

}
const styles = StyleSheet.create({

    container: {
        height: deviceHeight,
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    flatlist: {
        flex: 1, backgroundColor: 'transparent'
        , paddingHorizontal: 0, paddingVertical: 15
    },
    radiobuttonContainer: {
        height: 20, width: 20, borderRadius: 20 / 2, marginLeft: 0,
        backgroundColor: 'black', borderColor: 'white', borderWidth: 1, justifyContent: 'center', alignItems: 'center'
    }, radiobuttonImageContainer: {
        height: 20, width: 20, alignItems: 'center', justifyContent: 'center'
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
        marginLeft: 15,


    },
    login_button: {
      backgroundColor: '#4AAFE3',
      paddingVertical: 8,
      paddingHorizontal: 25,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      flexDirection:'row'
    },
    profile: {
        width: 60,
        height: 60,
    },

    name_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: 42,
        width: '100%',
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        height: 180, alignItems: 'flex-start',
        width: '100%',
        marginHorizontal: 0,
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
        marginTop: 32, borderRadius: 5,
        alignItems: 'center',
        height: 45,
        backgroundColor: "black",
        width: '50%',
        justifyContent: 'center'
    }
});
