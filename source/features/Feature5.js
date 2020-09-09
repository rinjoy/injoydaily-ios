import React, {Component} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,KeyboardAvoidingView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,TouchableWithoutFeedback,
    TouchableOpacity,
    View
} from 'react-native';
import LottieView from "lottie-react-native";
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import ModalPremium from './../modals/ModalPremium';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import ModalUpdateShareWin from './../modals/ModalUpdateShareWin';
import RNPickerSelect from "react-native-picker-select";
import Emoji from "react-native-emoji";
import Toast from "react-native-easy-toast";

const editblack = require('./../../assets/editblack.png');
const dagger = require('../../images/dager.png');
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';
const flagblack = require('./../../assets/flagblack.png');

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const starshinegray = require('./../../images/starshinegray.png');
const nextarrow = require('./../../assets/nextarrow.png');
const image11 = require('./../../images/image-11.png');
const image12 = require('./../../images/image-12.png');
const image13 = require('./../../images/image-13.png');
const hands = require('./../../images/handsblue.png');
const commentblue = require('./../../images/commentblue.png');
const checkyellow = require('./../../images/checkyellow1.png');
const checkgray = require('./../../images/checkgray.png');
const backg = require('./../../images/bg_popup.png');
const crossarrow = require('./../../images/close.png');
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const unlockblack = require('./../../assets/unlockblack.png');
const unlockgray = require('./../../assets/unlockgray.png');
const boxIcon = require('./../../images/high-five-bar.png');
const handsBlack = require('./../../images/hand-blck.png');
const handsBlue = require('./../../images/hand-blue.png');
const comments1 = require('../../images/comments.png');
export default class Feature5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            accessToken: '',
            UID: 0,
            winsStatus: 0,
            featureType: this.props.dataFromParent.feature_type,
            //featureType: 1,
            challenge_id: this.props.challenge_id,
            feature_category_id: 0,
            editModal: false,
            offSetLoader: false,
            title: '',
            editIndex: '',
            userProfilePic: this.props.user_pic,
            editPost: {},
            challengeArray: this.props.dataFromParent,
            basicArray: this.props.basicData,
            winsArray: [],
            winsArrayData: [],
            linkFeatureId: 0,
            flagIndex: '', spamVal: null,
            flagModal: false, reportcommentText: '',
            animatePress: new Animated.Value(1),
            showLottiee:false

        };
        this.premium = this.premium.bind(this);
        this.flagmodalVisible = this.flagmodalVisible.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
    }

    animateIn(){
        Animated.timing(this.state.animatePress,{
            toValue:0.3,duration:500
        }).start()
    }
    animateOut(){
        Animated.timing(this.state.animatePress,{
            toValue:1,duration:400
        }).start()
    }

    editmodalVisible() {
        this.setState({editModal: !this.state.editModal})
    }

    onedit(data, index) {
        this.setState({editPost: data});
        this.setState({editIndex: index});
        this.editmodalVisible();

    }


    componentDidMount() {

        getUserId().then(id =>
            this.setState({UID: id}),
        );
        this.getAccessToken();
    }

    premium() {
        this.setState({premiumModal: !this.state.premiumModal})
    }

    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});
        //alert(this.state.accessToken);
        console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
            this.getWins();
        }
    }

    async getWins() {
        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-small-win-all';
        var parameters = {
            challenge_id: this.state.challenge_id,
            page_size: 6,
            feature_id: 5,
            data_offset: 0,
            day: this.state.basicArray.details.day,
            week: this.state.basicArray.details.week,
            uid: this.state.UID,
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
                    console.log("DATA IS ===>", dataobject)
                    if (dataobject.status) {
                        this.setState({offSetLoader: false});
                        this.setState({feature_category_id: dataobject.feature_category_id});
                        this.setState({winsArray: dataobject.small_win_all});
                        this.setState({title: dataobject.feature_title});
                        this.setState({winsStatus: dataobject.user_today_actions});
                    } else {
                        alert('Something went wrong.');
                    }

                }
            )
            .catch((error) => {
                alert(' Exception causes' + error)
            })
    }

    onflag(id, index) {
        this.setState({linkFeatureId: id});
        this.setState({flagIndex: index});
        this.flagmodalVisible();
    }

    flagmodalVisible() {
        this.setState({flagModal: !this.state.flagModal})
    }

    refresh = (data) => {
        this.setState({UID: data.uid});
        this.getWins();
        this.props._handeleDayChange();
    }
    refresh_for = (data) => {
        //   this.setState({UID: data.uid});
        this.getWins();
        //   this.props._handeleDayChange();
    }

    premium1() {
        this.setState({premiumModal1: !this.state.premiumModal1})
    }

    editUpdateData(dataGet) {
        this.state.winsArray[this.state.editIndex] = dataGet;
        this.setState({winsArray: this.state.winsArray});
    }

    async submitFlag() {
        var flagcmtIndex = this.state.flagIndex;
        if (this.state.spamVal == null) {
            alert('Please select reason.');
            return false;
        } else if (this.state.reportcommentText == '') {
            alert('Please add comment.');
            return false;
        } else {
            this.setState({offSetLoader: true});
            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-small-win-action';
            const formData = new FormData();
            formData.append('token', JSON.parse(token_));
            formData.append('type', 'f');
            formData.append('challenge_id', this.state.challenge_id);
            formData.append('uid', this.state.UID);
            //   formData.append('day', this.state.day);
            formData.append('week', this.state.basicArray.details.week);
            formData.append('feature_id', 5);
            formData.append('linked_comment_id', this.state.linkFeatureId);
            formData.append('flag_drop', this.state.spamVal)
            formData.append('comment', this.state.reportcommentText)
            console.log("Forem data " + JSON.stringify(formData))
            var token = `Bearer ${JSON.parse(token_)}`;
            var object = {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    //'Content-Type': 'application/json'
                    'Authorization': token,
                })
            };

            //console.log(JSON.stringify(object))
            fetch(url, object)
                .then(async (response) => response.text())
                .then(async (responseText) => {
                        var dataobject = JSON.parse(responseText);
                        // alert(JSON.stringify(dataobject))
                        if (dataobject.status == true) {
                            this.flagmodalVisible();
                            this.setState({offSetLoader: false});
                            this.setState({spamVal: null});
                            this.setState({reportcommentText: ''});
                            if (flagcmtIndex > -1) {
                                //array.splice(index, 1);
                                this.state.winsArray.splice(flagcmtIndex, 1)
                            }

                            this.setState({winsArray: this.state.winsArray});
                            // console.log('After flagged array is =====>'+JSON.stringify(this.state.winsArray));

                            alert('Share a win has been flagged');
                        } else {
                            alert(dataobject.message);
                            console.log('IN ELSE ==>' + JSON.stringify(dataobject))
                            this.setState({offSetLoader: false});
                        }

                    }
                )
                .catch((error) => {
                    console.log("ERROR is ==>" + error)
                })
        }

    }

    async messageHighFive(data, ind) {

        //this.animation.play()

        //return ;
      //  this.animateIn()
        const url = global.base_url_live+'v1/api/submit-small-win-action';
        const token_ = await SecureStore.getItemAsync('token');

        var parameters = {
            token: JSON.parse(token_),
            uid: this.state.UID,
            challenge_id: this.state.challenge_id,
            feature_id: 5,
            week: this.state.basicArray.details.week,
            type: 'l',
            linked_comment_id: data.comment_id,
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
                    if (dataobject.status == true) {
                        //this.setState({showLottiee:true});
                        //this.animation.play()
                        // resetAnimation = () => {
                        //     this.animation.reset();
                        //     this.animation.play();
                        // };
                        // setTimeout(()=>{
                        //     this.animation.reset();
                        //     this.setState({showLottiee:false});
                        // },1000)
                       // this.animateOut()
                        this.state.winsArray[ind].if_you_high_fived = true;
                        var count = parseInt(parseInt(this.state.winsArray[ind].total_high_fives) + 1);
                        this.state.winsArray[ind].total_high_fives = count;
                        this.setState({winsArray: this.state.winsArray});
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>Yes!  </Text>
                                <Emoji name="clap" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                />

                            </View>)
                    } else {
                        alert(dataobject.message);
                    }
                }
            )
            .catch((error) => {
            })
    }

    async goToAddReplyToShareaWin(dt, index) {
        this.setState({popUpIndex: index});
        console.log(this.state.challengeArray);
        const {navigate} = this.props.nav;
        navigate('AddReplyToShareWin', {
            'DATA': dt,
            'basic_array': this.state.basicArray,
            'challengeID': this.state.challenge_id,
            'feature_array': this.state.challengeArray,
            'profile_pic': this.state.userProfilePic,
            onGoBack: this.refresh_for

        })
    }


    renderRowComment(item, rowmap) {
       // console.log("renderRoeCalled")
        var dataHolderrr = item;
        return (
            <View style={styles.win_user_itemsview}>

                <View style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <View style={{flex: 0.16, backgroundColor: 'transparent'}}>
                        <Image source={{uri: item.profile_pic}}
                               style={{width: 40, height: 40, borderRadius: 40 / 2, overflow: "hidden", marginTop: 12}}>
                        </Image>
                    </View>
                    <View style={{flex: 0.74, backgroundColor: 'transparent', marginLeft: 2}}>
                        <Text style={{
                            fontFamily: 'PoppinsBold',
                            fontSize: 14,
                            marginTop: 10,
                            marginLeft: 0
                        }} numberOfLines={1}> {item.name}
                        </Text>
                        <Text style={{
                            color: 'gray',
                            fontFamily: 'PoppinsRegular',
                            fontSize: 10,
                            marginTop: -1,
                            marginLeft: 0
                        }}> {item.time}
                        </Text>
                    </View>
                    <View style={{
                        flex: 0.10,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        {/*{this.state.UID == item.uid &&*/}
                        <Menu>
                            <MenuTrigger>
                                {this.state.featureType == 0 &&
                                <View style={{
                                    backgroundColor: 'transparent',
                                    paddingLeft: 10,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    paddingRight: 10
                                }}>
                                    <Image source={dagger} style={{width: 6, height: 22}}>
                                    </Image>
                                </View>
                                }
                                {this.state.featureType !== 0 &&
                                <TouchableOpacity onPress={() => this.premium()}>
                                    <View style={{
                                        backgroundColor: 'transparent',
                                        paddingLeft: 10,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        paddingRight: 10
                                    }}>
                                        <Image source={dagger} style={{width: 6, height: 21}}>
                                        </Image>
                                    </View>
                                </TouchableOpacity>
                                }

                            </MenuTrigger>
                            <MenuOptions>

                                {this.state.UID == item.uid &&
                                <MenuOption onSelect={() => this.onedit(item, rowmap)}>
                                    <View style={{
                                        paddingTop: 0,
                                        backgroundColor: 'transparent',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                                        <Image source={editblack} style={{height: 12, width: 10, marginTop: 0}}/>
                                    </View>
                                </MenuOption>
                                }
                                {this.state.UID !== item.uid &&
                                <MenuOption onSelect={() => this.onflag(item.comment_id, rowmap)}>

                                    <View style={{
                                        paddingTop: 0,
                                        backgroundColor: 'transparent',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={{fontFamily: 'PoppinsMedium'}}>Flag</Text>
                                        <Image source={flagblack} style={{height: 12, width: 10, marginTop: 0}}/>
                                    </View>
                                </MenuOption>
                                }
                            </MenuOptions>
                        </Menu>
                        {/*}*/}
                    </View>

                </View>

                <View style={{backgroundColor: 'transparent'}}>
                    <Text style={{
                        color: '#000',
                        fontSize: 11,
                        minHeight: 82,
                        marginTop: 10,
                        fontFamily: 'PoppinsSemiBold',
                        marginHorizontal: 10
                    }} numberOfLines={4}>
                        {item.comment}
                    </Text>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingBottom: 15,
                    marginTop: 0,
                    backgroundColor: 'transparent',
                    paddingVertical: 5,
                    paddingHorizontal: 15
                }}>
                    <View style={{
                        flex: 0.44,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>

                        {item.if_you_high_fived &&
                        <View style={{
                            backgroundColor: '#7BD1FD',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 15
                        }}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High
                            Five</Text></View>
                        }
                        {!item.if_you_high_fived &&
                        <TouchableWithoutFeedback

                            onPressIn={() => {

                            if (this.state.featureType == 0) {
                                [this.messageHighFive(dataHolderrr,rowmap)]
                            } else {
                                this.premium();
                            }
                        }}

                        >
                            {/*<Animated.View*/}
                            {/*style={{backgroundColor: '#626E77',*/}
                            {/*    borderRadius: 15,*/}
                            {/*    transform:[*/}
                            {/*        {*/}
                            {/*            scale:this.state.animatePress*/}
                            {/*        }*/}
                            {/*    ]*/}
                            {/*}}*/}
                            {/*>*/}

                            <View style={{
                                backgroundColor: '#626E77',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 15
                            }}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High
                                Five</Text>
                            </View>
                            {/*</Animated.View>*/}
                        </TouchableWithoutFeedback>
                        }
                        <View style={{backgroundColor: 'transparent', marginLeft: 6}}>
                            <ImageBackground source={boxIcon} resizeMode='contain' style={{width: 70, height: 30}}>
                                <View style={{flexDirection: 'row', flex: 1}}>
                                    <View style={{
                                        flex: 0.5,
                                        backgroundColor: 'transparent',
                                        justifyContent: 'center',
                                        marginLeft: 10
                                    }}>
                                        {item.if_you_high_fived &&
                                        <Image source={handsBlue} style={{height: 15, width: 15}}>
                                        </Image>
                                        }
                                        {!item.if_you_high_fived &&
                                        <Image source={handsBlack} style={{height: 15, width: 15}}>
                                        </Image>
                                        }
                                    </View>

                                    <View style={{
                                        flex: 0.5,
                                        backgroundColor: 'transparent',
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        marginRight: 8
                                    }}>
                                        {item.if_you_high_fived &&
                                        <Text style={{
                                            color: '#7BD1FD',
                                            fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                                        }}>{item.total_high_fives}</Text>
                                        }
                                        {!item.if_you_high_fived &&
                                        <Text style={{
                                            color: 'gray',
                                            fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                                        }}>{item.total_high_fives}</Text>
                                        }
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>

                    <View style={{
                        flex: 0.56,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                          onPress={() => this.goToAddReplyToShareaWin(dataHolderrr, rowmap)}
                        >
                            <Image source={comments1} style={{width: 15, height: 15}}>
                            </Image>
                            <Text style={{
                                color: 'gray',
                                fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
                            }}>Comments ({item.total_replies})</Text>
                        </TouchableOpacity>

                    </View>


                </View>


            </View>
        )

    }

    _handelePaymentUpdate = () => {
        this.props._handelePaymentUpdate();
    }
//
// <LottieView
// ref = {animation => {
//     this.animation = animation;
// }}
// style={{
//     width: 100,
//     height: 100,
//     justifyContent:'center',
//     alignSelf:'center',
//     backgroundColor: 'red',
// }}
// source={require('../../images/lottiiee.json')}
//     // OR find more Lottie files @ https://lottiefiles.com/featured
//     // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
// />

    render() {
        const placeholder = {
            label: 'Select Reason...',
            value: null,
            color: '#000',
        };
        var dataholder = this.state.challengeArray;
        const {navigate} = this.props.nav;
        var winsArray = this.state.winsArray;
        var chlObject = {
            'challenge_id': this.state.challenge_id,
            'feature_category_id': this.state.feature_category_id,
            'day': this.state.basicArray.details.day,
            'week': this.state.basicArray.details.week,
            'feature_name': dataholder.feature_name
        };


        return (
            <View style={{
                borderBottomWidth: 1,
                borderTopWidth: 1,
                marginTop: 15,
                paddingVertical: 15,
                borderColor: '#F6D000',
                backgroundColor: 'transparent',
                marginBottom: 15
            }}>

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={500}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
                       hasBackdrop={true} isVisible={this.state.flagModal}>
                    <KeyboardAvoidingView
                        enabled
                        behavior='position'
                        keyboardVerticalOffset={deviceHeight/12}>
                    <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
                        <View style={{padding: 0}}>
                            <TouchableOpacity onPress={() => this.flagmodalVisible()}>
                                <View style={{
                                    justifyContent: 'flex-end',
                                    paddingTop: 10,
                                    paddingRight: 15,
                                    backgroundColor: 'transparent',
                                    alignItems: 'flex-end'
                                }}>
                                    <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                                </View>
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: 17,
                                textAlign: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: 'lightgray',
                                paddingBottom: 7
                            }}>REPORT COMMENT</Text>
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <View style={{padding: 15}}>
                                    <Text style={{fontFamily: 'PoppinsSemiBold'}}>Why do you wan't to flag this comment
                                        ?</Text>
                                </View>
                                <View style={{paddingHorizontal: 15}}>
                                    <RNPickerSelect
                                        onValueChange={value => {
                                            this.setState({
                                                spamVal: value,
                                            });
                                        }}
                                        useNativeAndroidPickerStyle={false}
                                        style={{
                                            inputAndroid: {
                                                backgroundColor: 'transparent',
                                                borderWidth: 1,
                                                paddingVertical: 4,
                                                paddingHorizontal: 5,
                                                borderColor: 'lightgray'
                                            },
                                            inputIOS: {
                                                backgroundColor: 'transparent',
                                                borderWidth: 1,
                                                paddingVertical: 4,
                                                paddingHorizontal: 5,
                                                borderColor: 'lightgray'
                                            },
                                            iconContainer: {
                                                top: 0,
                                                right: 0,
                                            },
                                        }}
                                        placeholder={placeholder}
                                        items={[
                                            {label: 'Inappropriate language', value: 0},
                                            {label: 'Inappropriate Image', value: 1},
                                            {label: 'Spam', value: 2},
                                            {label: 'Bullying', value: 3},
                                            {label: 'Other', value: 4},
                                        ]}
                                    />
                                </View>

                                <View style={{paddingHorizontal: 15}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        width: '100%',
                                        marginHorizontal: 0,
                                        backgroundColor: 'white',
                                        borderColor: 'lightgray',
                                        borderWidth: 1,
                                        marginTop: 8
                                    }}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={8}
                                            placeholder="Report the comment"
                                            value={this.state.reportcommentText}
                                            onChangeText={(text) => this.setState({reportcommentText: text})}
                                            style={{
                                                width: '100%',
                                                height: 120,
                                                textAlignVertical: "top",
                                                paddingHorizontal: 5,
                                                marginTop: 12
                                            }}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{
                                    marginTop: 20,
                                    backgroundColor: 'tranparent',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#008CE3',
                                                borderWidth: 1, paddingVertical: 8,
                                                borderColor: 'lightgray', marginHorizontal: 0,
                                                borderRadius: 25, marginBottom: 0, marginTop: 0
                                            }}
                                            onPress={() =>
                                                this.submitFlag()}>
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    color: 'white',
                                                    fontFamily: 'PoppinsSemiBold',
                                                    paddingVertical: 0,
                                                    paddingHorizontal: 35
                                                }}>
                                                Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>

                <Modal style={{marginLeft: 10, marginRight: 10, marginBottom: 0, marginTop: StatusBar.currentHeight}} transparent={true} deviceWidth={deviceWidth}
                       deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal} >

                    <View style={{flex: 1, height:'100%' , width: '100%', backgroundColor: 'white', padding: 0, margin: 0}}>
                        <TouchableOpacity
                            style={{zIndex:99,backgroundColor:'transparent', width: 20, height: 25,left:-15,right:0,bottom:0,top:30,alignItems:'center',alignSelf:'flex-end'}}
                            onPress={this.premium}>
                            <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                                <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                            </View>
                        </TouchableOpacity>
                        <ImageBackground resizeMode= 'contain' source={backg} style={{flex: 1, height: '100%', width: '100%'}}>
                            <View style={{padding: 0}}>

                                <ModalPremium
                                    closeModal={this.premium}
                                    _handelePaymentUpdate = {this._handelePaymentUpdate}
                                    nav={this.props.nav}/>

                            </View>
                        </ImageBackground>
                    </View>
                </Modal>


                <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
                       hasBackdrop={true} isVisible={this.state.editModal}>

                    <KeyboardAvoidingView
                        enabled
                        behavior='position'
                        keyboardVerticalOffset={deviceHeight/12}>
                    <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
                        <View style={{padding: 0}}>
                            <TouchableOpacity onPress={this.editmodalVisible}>
                                <View style={{
                                    justifyContent: 'flex-end',
                                    paddingTop: 10,
                                    paddingRight: 15,
                                    backgroundColor: 'transparent',
                                    alignItems: 'flex-end'
                                }}>
                                    <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                                </View>
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: 17,
                                textAlign: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: 'lightgray',
                                paddingBottom: 7
                            }}>Edit Share a Win</Text>
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <ModalUpdateShareWin
                                    updateContent={this.state.editPost}
                                    week={this.state.basicArray.details.week}
                                    challengeId={this.state.challenge_id}
                                    onGoBack={this.editUpdateData}
                                    onPopUp={this.editmodalVisible}
                                    nav={this.props.nav}/>
                            </ScrollView>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
                <View style={styles.win_view}>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.state.featureType == 0) {
                                navigate('ShareAWin', {
                                    DATA: dataholder,
                                    challenge_details: chlObject,
                                    onGoBack: this.refresh
                                })
                            } else {
                                this.premium();
                            }
                        }}
                    >
                        <View style={{flexDirection: 'row', flex: 1, paddingBottom: 5, backgroundColor: 'transparent'}}>
                            <View style={{flex: 0.9, backgroundColor: 'transparent'}}>
                                <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                                    {this.state.winsStatus == 0 &&
                                    <Image source={checkgray}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>
                                    }
                                    {this.state.winsStatus > 0 &&
                                    <Image source={checkyellow}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>
                                    }

                                    <Text style={{
                                        marginTop: 0, marginLeft: 5, fontSize: 14,
                                        fontFamily: 'PoppinsRegular', color: '#F6D000',
                                    }}>{dataholder.feature_name.toUpperCase()}</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flex: 0.1,
                                    backgroundColor: 'transparent',
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end'
                                }}>
                                {this.state.featureType == 1 &&
                                <Image source={unlockgray}
                                       style={{width: 35, height: 35, marginRight: 0}}>
                                </Image>
                                }
                                {this.state.featureType == 0 &&
                                <Image source={nextarrow}
                                       style={{width: 12, height: 20, alignItems: 'flex-end', marginRight: 0}}>
                                </Image>
                                }
                            </View>
                        </View>


                        <View style={{backgroundColor: 'transparent'}}>
                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                color: '#000',
                                fontSize: 13,
                                marginLeft: 0,
                                marginTop: 0,
                            }}>{this.state.title} </Text>
                            <Text style={{
                                marginLeft: 0,
                                marginTop: 0,
                                color: '#000',
                                padding: 0,
                                fontFamily: 'PoppinsBold',
                                fontSize: 13
                            }}>{dataholder.points} Points </Text>
                        </View>
                    </TouchableOpacity>


                    {this.state.offSetLoader &&
                    <View style={{
                        backgroundColor: 'transparent',
                        zIndex: 99,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size="large"/>
                    </View>
                    }

                    <View style={{
                        flexDirection: 'row',
                        marginHorizontal: 0,
                        borderRadius: 10,
                        marginTop: 8
                    }}>

                        {this.state.winsArray == 0 &&
                        <View style={{
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{fontFamily: 'PoppinsLight'}}>No wins available now.</Text>
                        </View>
                        }


                        {this.state.featureType == 1 &&

                        <TouchableOpacity onPress={() => this.premium()}>
                            <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                      horizontal={true}
                                      data={this.state.winsArray}
                                      extraData={this.state}
                                      renderItem={({item, index}) => this.renderRowComment(item, index)}
                                      keyExtractor={(item, index) => index.toString()}
                            />
                        </TouchableOpacity>
                        }

                        {this.state.featureType == 0 &&
                        <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                  horizontal={true}
                                  data={this.state.winsArray}
                                  extraData={this.state}
                                  renderItem={({item, index}) => this.renderRowComment(item, index)}
                                  keyExtractor={(item, index) => index.toString()}
                        />
                        }



                    </View>
                </View>
                {this.state.showLottiee &&
                <View style={{backgroundColor:'transparent',height:50,top:deviceHeight/5,bottom:deviceHeight/5,right:deviceWidth/2,left:deviceWidth/2,position:'absolute'
                    ,width:50,alignSelf:'center',justifyContent:'center',alignItems:'center'}}>

                    <LottieView
                        ref = {animation => {
                            this.animation = animation;
                        }}
                        style={{
                            width: 100,
                            height: 100,
                            justifyContent:'center',
                            alignSelf:'center',
                            backgroundColor: 'transparent',
                        }}
                        source={require('../../images/lottiiee.json')}
                        // OR find more Lottie files @ https://lottiefiles.com/featured
                        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                    />
                </View>

                }




            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: 'white'

    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // backgroundColor: 'orange',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 28 : 38,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0, flexDirection: 'column', backgroundColor: 'white'
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
//   Header Items
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },

    header_view: {
        height: 125,
        flex: 1,
    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 20,
    },

    header_image: {
        flex: 1,
        height: 125,

    },

    menu: {
        width: 38,
        height: 28,
        marginLeft: 20,

    },

    profile: {
        width: 55,
        height: 55, marginRight: -14, marginTop: 3,
        borderRadius: 55 / 2
    },


//Challenges Items
    challenge_view: {
        flex: 1,
        height: 285,
        marginTop: -5,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }

    },

    chalenge_profile: {
        flex: 1,
        height: 200,
        width: '100%',
        // resizeMode:'cover' ,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },


//Appreciation team member items
    appreciatio_view: {
        flex: 1,
        height: 380,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 0,

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }

    },

    appreciation_title: {
        marginLeft: 12,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 12,
        lineHeight: 20
    },

    appreciation_desc: {
        marginLeft: 12,
        fontFamily: 'PoppinsRegular',
        lineHeight: 15,
        fontSize: 11,
        marginTop: 5

    },


//Weekly Video items
    weekly_view: {
        flex: 1, height: 110,
        marginHorizontal: 15, padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 0, marginTop: 15,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    LeaderShipCorner: {
        flex: 1, height: 100,
        marginHorizontal: 15, padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 0, marginTop: 15,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    //Weekly Video items
    win_view: {
        flex: 1,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 0, marginTop: 0,
    },


//Top user items
    leaderboard_view: {
        height: 190,
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10

    },

    //Top user items
    topstreaks_view: {
        height: 190,
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 30,

    },

    topuser_itemsview: {
        width: 110,
        height: 130,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 5,
        marginTop: 5,
        marginRight: 10,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    win_user_itemsview: {
        width: 300,
        //height: 145,
        borderRadius: 10,
        borderColor: '#F6D000',
        borderWidth: 3,
        marginLeft: 5,
        marginTop: 5,
        marginRight: 10,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    tabbar_view: {

        flexDirection: 'row', justifyContent: 'space-around', height: 65,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    tabbar_inner_view: {

        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        height: 63,
        marginTop: 1,
        flex: 1,
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    tabbar_inner_view2: {

        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'baseline',
        justifyContent: 'space-around',
        height: 62,
        marginTop: 0.5,
        flex: 1,
        elevation: 5,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    }

});
