import React, {Component} from 'react';
import {
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from "react-native-loading-spinner-overlay";

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const backarrow = require('../../assets/backarrow.png');
const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class ShareAWin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            offSetLoader: false,
            challengeId: this.props.navigation.state.params.challenge_details.challenge_id,
            categoryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            featureId: 5,
            dropDowntext: '',
            day: this.props.navigation.state.params.challenge_details.day,
            data_list: [],
            uid: '',
            week: this.props.navigation.state.params.challenge_details.week,
            hederTitle: this.props.navigation.state.params.challenge_details.feature_name,
            contentData: [],
            question: '',
            textInoutHint: '',
            buttonHint: '',
            radioImageFirst: false,
            radioSecondbutton: false,
            countTodayCheckIn: 0
            , commentText: '',
            selectedItemId: null,
        }
    }

    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );


        getUserId().then(id =>
            this.setState({uid: id}),
        );

        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {
        this.setState({buttonHint: dataObject.points});
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.uid);
                }
            }
        }, 1000);
    }

    async getAllDew(challangeId, featureId, day, categoryId, week, uid) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-small-win-see-all-content';
        var parameters = {
            challenge_id: challangeId,
            feature_id: featureId,
            day: day,
            category_id: categoryId,
            week: week,
            uid: uid
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

                    this.setState({question: dataobject.small_win_content.question});
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }


    InheritedData(data) {
        if (data.status == true) {
            //this.checkIn(this.state.countTodayCheckIn)

            var value = data.small_win_content.user_actions.action_status;
            this.setState({radioImageFirst: value});

        }
    }

    async submitData(challangeId, featureId, week, uid, commentText) {

        if (this.state.commentText == '') {
            alert('please fill the comment..')
        } else {
            this.setState({offSetLoader: true});
            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-small-win-action';


            var parameters = {
                challenge_id: challangeId,
                feature_id: featureId,
                week: week,
                uid: uid,
                comment: commentText,
                type: 'c'
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

                        this.checkSuccessOrNot(dataobject);
                    }
                )
                .catch((error) => {
                })
        }

    }

    checkSuccessOrNot(dataObject) {
        console.log(JSON.stringify(dataObject))
        if (dataObject.status) {
            alert('Submitted Successfully');
            this.setState({commentText: ''});
            this.setState({offSetLoader: false});
            this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.uid);

            this.shiftBack();

        } else {
            this.setState({offSetLoader: false});
            alert('failed')
        }


    }

    navigateToAll(challangeId, categoryId, featureId, week, uid, day) {
        //alert(categoryId)
        var parameters = {
            //  token: JSON.parse(token_),
            challenge_id: challangeId,
            category_id: categoryId,
            feature_id: featureId,
            week: week,
            uid: uid,
            day: day
        };

        //alert(JSON.stringify(parameters));
        this.props.navigation.navigate('ShareAWinSeeAll', {DATA: parameters});
    }

    shiftBack() {
        //this.props.navigation.navigate('DashBoard');
        var obj = {'uid': this.state.uid}
        this.props.navigation.state.params.onGoBack(obj);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}
                                      behavior="padding" enabled keyboardVerticalOffset={0}>
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
                                          numberOfLines={1}> {this.state.hederTitle == "" ? '-' : this.state.hederTitle}
                                    </Text>
                                </View>

                            </View>
                        </ImageBackground>

                    </View>
                    {/* Ended Header View */}
                    <Spinner
                        visible={this.state.offSetLoader}
                        textContent={''} color={'black'}/>
                    <ScrollView style={{flex: 1, paddingHorizontal: 15, backgroundColor: 'transparent'}}>
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginLeft: 0,
                            marginTop: 20,
                            backgroundColor: 'transparent'
                        }}>

                            <Text style={{fontFamily: 'calibriRegular', marginLeft: 0, fontSize: 20}}
                            >{this.state.question}</Text>

                        </View>

                        <View style={styles.email_view}>
                            <TextInput
                                placeholder='Submit comment...'
                                value={this.state.commentText}
                                onChangeText={(text) => this.setState({commentText: text})}
                                style={{
                                    width: "100%",
                                    paddingHorizontal: 10,
                                    textAlignVertical: 'top',
                                    backgroundColor: 'transparent',
                                    height: '100%',
                                    paddingVertical: 10
                                }}
                                numberOfLines={8}
                                multiline={true}>

                            </TextInput>
                        </View>

                        <View style={{marginTop: 30, backgroundColor: 'transparent', flexDirection: 'row', flex: 1}}>
                            <View style={{flex: 0.15}}>
                            </View>
                            <View style={{
                                flex: 0.51,
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                alignItems: 'center'
                            }}>
                                {!this.state.actionStatus && !this.state.commentOwn &&
                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#008CE3',
                                        borderWidth: 1, paddingVertical: 8,
                                        flexDirection: 'row',
                                        paddingHorizontal: 25,
                                        borderColor: 'lightgray', marginHorizontal: 0,
                                        borderRadius: 25, marginBottom: 0, marginTop: 0
                                    }}
                                    onPress={() => [Keyboard.dismiss(),
                                        this.submitData(this.state.challengeId, this.state.featureId, this.state.week, this.state.uid, this.state.commentText)]}
                                >
                                    {this.state.radioImageFirst &&
                                    <Image source={checkyellow}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>
                                    }
                                    {!this.state.radioImageFirst &&
                                    <Image source={checkgray}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>
                                    }

                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: 'white',
                                            marginLeft: 7,
                                            fontFamily: 'PoppinsSemiBold',
                                            paddingVertical: 0
                                        }}>
                                        {"Submit " + this.state.buttonHint + " Points"}</Text>
                                </TouchableOpacity>
                                }
                            </View>
                            <View style={{
                                flex: 0.34,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                                backgroundColor: 'transparent'
                            }}>
                                <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 0}}>
                                    <TouchableOpacity
                                        style={{
                                            borderRadius: 5,
                                            alignItems: 'center',
                                            width: '100%',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() =>
                                            this.navigateToAll(this.state.challengeId, this.state.categoryId,
                                                this.state.featureId, this.state.week, this.state.uid, this.state.day)}>
                                        <Text style={{
                                            fontSize: 16,
                                            color: 'black',
                                            borderBottomWidth: 1,
                                            fontFamily: 'PoppinsSemiBold'
                                        }}>See All ></Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>


                        {/*  <TouchableOpacity style={{
                        borderWidth: 1.5,
                        backgroundColor: 'black',
                        marginHorizontal: 0,
                        height: 45,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2, flexDirection: 'row'
                    }}
                    onPress={() => [Keyboard.dismiss(),
                    this.submitData(this.state.challengeId, this.state.featureId, this.state.week, this.state.uid, this.state.commentText)]}>

                        <TouchableOpacity
                            style={styles.radiobuttonContainer}
                        >
                            {this.state.radioImageFirst &&
                            <Image
                                source={whitecheck}
                                style={styles.radiobuttonImageContainer}
                            >
                            </Image>
                            }

                        </TouchableOpacity>


                        <Text style={{
                            marginLeft: 10,
                            fontFamily: 'calibriBold',
                            fontSize: 20,marginTop:3,
                            color: 'white',justifyContent:'center'
                        }}>{"Submit " + this.state.buttonHint + " Points"}</Text>
                    </TouchableOpacity>

                    <View style={{backgroundColor: 'transparent', flex: 1, marginTop: 15}}>
                        <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 15}}>
                            <TouchableOpacity
                                style={styles.loader}
                                onPress={() =>
                                    this.navigateToAll(this.state.challengeId, this.state.categoryId,
                                        this.state.featureId, this.state.week, this.state.uid,this.state.day)}>

                                <Text style={{fontSize: 20, color: 'white', fontFamily: 'calibriBold'}}>See
                                    All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    */}
                    </ScrollView>
                </KeyboardAvoidingView>
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
        width: 25,
        height: 25,
        marginLeft: 15,


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
