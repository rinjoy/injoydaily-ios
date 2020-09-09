import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from "react-native-loading-spinner-overlay";
import HTML from "react-native-render-html";

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const backarrow = require('../../assets/backarrow.png');


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class CoreValues extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            challengeId: '',
            categoryId: '',
            featureId: '',
            day: '',
            offSetLoader: false,
            uid: '', week: '',
            hederTitle: '',
            actionStatus: false,
            question: '',
            description: '',
            buttonHint: '',
            imageUri: '',
            isSubmitted: false

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
        this.setState({challengeId: dataObject.challenge_id});
        this.setState({featureId: dataObject.feature_id});
        this.setState({categoryId: dataObject.core_values_category.category_id});
        //this.setState({hederTitle: dataObject.feature_name});
        //this.setState({question: dataObject.todays_win_category.title});
        this.setState({day: dataObject.day});
        this.setState({week: dataObject.week});
        this.setState({uid: dataObject.uid});
        //alert(dataObject.todays_win_category.category_id)

        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.setState({offSetLoader: true});
                    this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.uid);
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
            var question = data.core_values_content.title
            var imageUri = data.core_values_content.image
            var description = data.core_values_content.description
            var actionStatus = data.core_values_content.user_actions.action_status;
            // alert(actionStatus)
            this.setState({question: question});
            this.setState({imageUri: imageUri});
            this.setState({actionStatus: actionStatus});
            this.setState({description: description});

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
                        alert('Submitted Successfully');
                        this.shiftBack();
                    }

                }
            )
            .catch((error) => {
            })
    }

    shiftBack() {
      var obj={'uid': this.state.uid}
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
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
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}
                                      numberOfLines={1}>Core Values</Text>
                            </View>

                        </View>
                    </ImageBackground>
                    <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>
                </View>
                {/* Ended Header View */}
                <ScrollView style={{flex: 1, paddingHorizontal: 15, backgroundColor: 'transparent',}}>
                    <Image source={{uri: this.state.imageUri}} style={{
                        height: 220,
                        width: '100%',
                        marginTop: 15,
                        borderRadius: 12,
                        resizeMode: 'cover'
                    }}>
                    </Image>


                    <HTML
                        html={this.state.description}
                        imagesMaxWidth={screenWidth}
                        containerStyle={{marginTop: 5}}
                    />

                    {/*{!this.state.actionStatus && !this.state.isSubmitted &&*/}
                    {!this.state.actionStatus && !this.state.isSubmitted &&
                    <TouchableOpacity
                        style={styles.login_button}
                        onPress={() => this.submitData(this.state.challengeId, this.state.featureId, this.state.day, this.state.uid, this.state.week)}
                    >
                        <Text style={{
                            fontSize: 13,
                            color: 'white',
                            fontFamily: 'PoppinsSemiBold'
                        }}>{this.state.question}</Text>
                    </TouchableOpacity>
                    }


                </ScrollView>
            </View>

        );

    }

}
    const styles = StyleSheet.create({

    container: {
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
        width: 28,
        height: 18,
        marginLeft: 15,


    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center', width: '100%',
        flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1, padding: 15,
        borderColor: 'lightgray', marginHorizontal: 0,
        borderRadius: 5, marginBottom: 15, marginTop: 20
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
