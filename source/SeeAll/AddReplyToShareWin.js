import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import ModalUpdateShareWinReply from "../modals/ModalUpdateShareWinReply";
import Emoji from "react-native-emoji";
import Toast from "react-native-easy-toast";
//import { RadioButton } from 'react-native-paper';
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
const gallaryblack = require('../../assets/gallaryblack.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');
const profile = require('../../images/image-9.png');
const dagger = require('../../images/dager.png');
const hands_blue = require('../../images/handsblue.png');
const hands_white = require('../../images/hand.png');
const flag = require('../../images/flag.png');
const comment = require('../../images/comment.png');
const commentblue = require('../../images/commentblue.png');
const messageopenblack = require('../../assets/messageopenblack.png');
const crossarrow = require('./../../images/close.png');
const editblack = require('./../../assets/editblack.png');
const unlike = require('../../images/unlike.png');
const like = require('../../images/like.png');
const flags = require('../../images/flag.png');
const comments = require('../../images/comment.png');

const image12 = require('../../images/image-12.png');
const userImage = require('../../images/image-11.png');
const image14 = require('../../images/image-14.png');
const image16 = require('../../images/image-16.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');

const boxIcon = require('../../images/high-five-bar.png');
const handsBlack = require('../../images/hand-blck.png');
const handsBlue = require('../../images/hand-blue.png');
const comments1 = require('../../images/comments.png');

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default class AddReplyToShareWin extends Component {

    constructor(props) {
        super(props);
        //alert(JSON.stringify(this.props.navigation.state.params.DATA.basic_array))
        console.log((JSON.stringify(this.props)))
        this.state = {
            data_list: [].fill('')
                .map((_, i) => ({key: `${i}`, text: `item #${i}`}))
            ,

            checked: true,
            accessToken: '',
            challengeId: this.props.navigation.state.params.challengeID,
            itemCount: 0,
            feature_name: this.props.navigation.state.params.feature_array.feature_name,
            highCount: 0,
            total_count: 0,
            userLiked: false,
            profilePic: this.props.navigation.state.params.profile_pic,
            //basic_array: this.props.navigation.state.params.DATA.basic_array,
            commentText: '',
            featureId: 2,
            editIndex: '',
            editPost: {},
            UID: '',
            linkedfeatureId: this.props.navigation.state.params.DATA.comment_id,
            week: this.props.navigation.state.params.basic_array.details.week,
            day: this.props.navigation.state.params.basic_array.details.day,
            offSet: 0
            , offSetLoader: false,
            Alldata: this.props.navigation.state.params.DATA,

        }
        this.renderRow = this.renderRow.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
        //alert(this.props)
    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );

        getUserId().then(id =>
            this.setState({UID: id}),
        );
        // alert(JSON.stringify(this.state.Alldata));
        this.getDataObject(this.props.navigation.state.params.DATA);

    }


    getDataObject(dataObject) {

        setTimeout(() => {

            if (this.state.challengeId != undefined) {
                this.getComments();
            }

        }, 1000);


    }


    async getComments() {
        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-small-win-reply-comments';
        var parameters = {
            token: JSON.parse(token_),
            challenge_id: this.state.challengeId,
            uid: this.state.UID,
            feature_id: 5,
            linked_comment_id: this.state.linkedfeatureId,
            page_size: 7,
            data_offset: this.state.offSet
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
                    this.setState({offSetLoader: false});
                    this.setState({itemCount: dataobject.count_records});
                    this.setState({total_count: dataobject.total_replies});
                    this.setState({highCount: dataobject.total_high_fives_orig_cmnt});
                    this.setState({userLiked: dataobject.if_you_high_fived});
                    if (dataobject.count_records == 0) {
                        this.setState({offSetLoader: false});
                    }

                    console.log('GET COMMENT RESPONSE', dataobject);
                    this.InheritedData(dataobject);


                }
            )
            .catch((error) => {
            })
    }


    setDataList(text) {
        this.setState({data_list: this.state.data_list.concat(text)});

    }


    InheritedData(data) {
        if (data.status == true) {
            this.setDataList(data.shout_out_replies);
        }
    }

    handeLoadMoreItem = () => {
        if (this.state.itemCount !== 0) {
            var offset = this.state.offSet;
            var addoffset = parseInt(offset + 7);
            this.setState({offSet: addoffset});
            this.getComments();
        }
    }

    footerComponent = () => {
        if (this.state.offSetLoader) {
            return (
                <View style={{height: 150, justifyContent: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
        return (<View style={{height: 10}}></View>);

    }

    renderEmptyContainer = () => {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'transparent',
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{fontFamily: 'PoppinsLight'}}>No Comments Yet.</Text>
            </View>
        )
    }


    async messageHighFive() {
        const {linkedfeatureId, challengeId, UID} = this.state;
        //  const url = global.base_url_live+'v1/api/app-insert-high-five';
        const url = global.base_url_live+'v1/api/submit-small-win-action';

        const token_ = await SecureStore.getItemAsync('token');
        var parameters = {
            token: JSON.parse(token_),
            uid: UID,
            challenge_id: challengeId,
            feature_id: 5,
            week: this.state.week,
            type: 'l',
            linked_comment_id: linkedfeatureId,
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
                    // alert(JSON.stringify(dataobject))
                    if (dataobject.status == true) {
                        this.setState({userLiked: true});
                        var count = parseInt(parseInt(this.state.highCount) + 1);
                        this.setState({highCount: count});
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>Woohoooo </Text>
                                <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
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

    headerComponent = () => {
        //const ratio = deviceWidth/this.state.Alldata.shout_out.shout_image_width;
        //const height = this.state.Alldata.shout_out.shout_image_height * ratio;
        return (
            <View>
                {this.state.Alldata.length !== 0 &&
                <View style={{
                    flex: 0,
                    marginTop: 8,
                    backgroundColor: 'transparent',
                    borderBottomWidth: 0.3,
                    borderBottomColor: '#CACACA',
                    paddingHorizontal: 15,
                    paddingVertical: 15,

                }}>


                    <View style={{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'flex-start'}}>
                        <View style={{flex: 0.15}}>
                            <Image source={{uri: this.state.Alldata.profile_pic}}
                                   style={{height: 50, marginLeft: 0, width: 50, borderRadius: 50 / 2}}/>
                        </View>
                        <View style={{flex: 0.85, backgroundColor: "transparent", marginLeft: 10}}>

                            <View style={{backgroundColor: 'transparent', alignItems: "flex-start"}}>
                                <Text style={{fontFamily: 'PoppinsBold'}}>{this.state.Alldata.name}</Text>
                            </View>
                            <View style={{backgroundColor: 'transparent'}}>
                                <Text style={{
                                    fontFamily: 'PoppinsRegular',
                                    color: 'gray',
                                    fontSize: 10
                                }}>{this.state.Alldata.time}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        backgroundColor: 'transparent',
                        flex: 0,
                        justifyContent: 'flex-start',
                        marginTop: 0,
                        alignItems: 'flex-start'
                    }}>

                        <View style={{backgroundColor: 'transparent', paddingLeft: 5, marginTop: 10, marginBottom: 10}}>
                            <Text style={{
                                fontSize: 13,
                                fontFamily: 'PoppinsRegular',
                                color: 'black',
                                marginTop: 0
                            }}>{this.state.Alldata.comment}</Text>
                        </View>

                        {/*{this.state.Alldata.shout_out.shout_image !== '' &&*/}
                        {/*<View style={{flex: 0, marginTop: 0}}>*/}
                        {/*    <Image source={{uri:this.state.Alldata.shout_out.shout_image}} style={{height: height-30, width:deviceWidth-30, borderRadius:3}}/>*/}
                        {/*</View>*/}
                        {/*}*/}
                        {/*{this.state.Alldata.shout_out.shout_image == '' &&*/}
                        {/*<View style={{flex: 0, height: 0, backgroundColor: 'transparent'}}>*/}
                        {/*</View>*/}
                        {/*}*/}

                    </View>

                    {/*start hive five and cmment sction from  here*/}
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        paddingBottom: 15,
                        marginTop: 10,
                        backgroundColor: 'transparent',
                        paddingVertical: 5,
                        paddingHorizontal: 10
                    }}>
                        <View style={{
                            flex: 0.50,
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>

                            {/*if high five has done then return view*/}
                            {this.state.userLiked &&
                            <View style={{
                                backgroundColor: '#7BD1FD',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 15
                            }}>
                                <Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High
                                    Five</Text></View>
                            }

                            {/*  if high five not done then return toucahble opacity */}
                            {!this.state.userLiked &&
                            <TouchableOpacity onPress={() => {
                                this.messageHighFive()
                            }}>
                                <View style={{
                                    backgroundColor: '#626E77',
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 15
                                }}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High
                                    Five</Text></View>
                            </TouchableOpacity>
                            }
                            <View style={{backgroundColor: 'transparent', marginLeft: 6}}>
                                <ImageBackground source={boxIcon}
                                                 resizeMode='contain'
                                                 style={{width: 70, height: 30}}>
                                    <View style={{flexDirection: 'row', flex: 1}}>
                                        <View style={{
                                            flex: 0.5,
                                            backgroundColor: 'transparent',
                                            justifyContent: 'center',
                                            marginLeft: 10
                                        }}>
                                            {this.state.userLiked &&
                                            <Image source={handsBlue} style={{height: 15, width: 15}}>
                                            </Image>
                                            }
                                            {!this.state.userLiked &&
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

                                            <Text style={{
                                                color: this.state.userLiked ? '#7BD1FD' : 'gray',
                                                fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium'
                                            }}>{this.state.highCount}</Text>

                                        </View>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>

                        <View style={{
                            flex: 0.50,
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            justifyContent: 'flex-end',
                            alignItems: 'center', marginLeft: 0
                        }}>
                            <TouchableOpacity style={{flexDirection: 'row'}}>
                                <Image source={comments1} style={{width: 15, height: 15, alignSelf: 'center'}}>
                                </Image>
                                <Text style={{
                                    color: 'gray',
                                    fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
                                }}>Comments ({this.state.total_count})</Text>
                            </TouchableOpacity>

                        </View>


                    </View>
                </View>
                }

            </View>
        )
    }

    editUpdateData(dataGet) {
        this.state.data_list[this.state.editIndex] = dataGet;
        this.setState({data_list: this.state.data_list});
    }

    onedit(data, index) {
        this.setState({editPost: data});
        this.setState({editIndex: index});
        this.editmodalVisible();
    }

    editmodalVisible() {
        this.setState({editModal: !this.state.editModal})
    }

    renderRow(dataHolder, rowmap) {
        // console.log(dataHolder)
        const itemUid = dataHolder.uid;
        return (

            <View style={{
                marginRight: 0, marginBottom: 0,
                flexDirection: 'row',
                marginTop: 0,
                backgroundColor: 'transparent',
                borderBottomWidth: 0.3,
                borderBottomColor: '#CACACA',
                paddingLeft: 20,
                paddingRight: 15,
                paddingVertical: 10,
            }}>


                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Image source={{uri: dataHolder.profile_pic}}
                           style={{height: 50, width: 50, marginLeft: 6, borderRadius: 50 / 2}}/>
                    <View style={{backgroundColor: "transparent", flex: 1, marginLeft: 12, marginRight: 0, padding: 1}}>

                        <View style={{
                            backgroundColor: 'transparent',
                            alignItems: "flex-start",
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            flex: 1
                        }}>
                            <View style={{flex: 0.90, backgroundColor: 'transparent', alignItems: "flex-start"}}>
                                <Text style={{fontFamily: 'PoppinsBold'}}>{dataHolder.name}</Text>
                            </View>
                            <View style={{flex: 0.10, backgroundColor: 'transparent', alignItems: "flex-end"}}>
                                {this.state.UID == itemUid &&
                                <Menu>
                                    <MenuTrigger>
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
                                    </MenuTrigger>
                                    <MenuOptions>
                                        <MenuOption onSelect={() => this.onedit(dataHolder, rowmap)}>
                                            <View style={{
                                                paddingTop: 8,
                                                backgroundColor: 'transparent',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingHorizontal: 5,
                                                flexDirection: 'row'
                                            }}>
                                                <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                                                <Image source={editblack}
                                                       style={{height: 12, width: 10, marginTop: 0}}/>
                                            </View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                                }
                            </View>
                        </View>

                        <View style={{flex: 1, backgroundColor: 'transparent', alignItems: "flex-start"}}>
                            <Text style={{
                                fontFamily: 'PoppinsRegular',
                                color: 'gray',
                                fontSize: 10,
                                marginLeft: 0
                            }}>{dataHolder.time}</Text>
                        </View>
                        <View style={{flex: 1, height: '100%', backgroundColor: 'transparent', padding: 0}}>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'PoppinsRegular',
                                color: '#000',
                                marginTop: 5
                            }}>{dataHolder.comment}</Text>
                        </View>

                    </View>

                </View>

            </View>
        )

    }

    async replyMessage() {
        const {commentText, UID, week, challengeId, linkedfeatureId} = this.state;
        this.setState({offSetLoader: true});
        if (this.state.commentText != '') {
            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-small-win-action';
            const formData = new FormData();
            formData.append('token', JSON.parse(token_));
            formData.append('type', 'r');
            formData.append('comment', commentText);
            formData.append('uid', UID);
            formData.append('week', week);
            formData.append('challenge_id', challengeId);
            formData.append('linked_comment_id', linkedfeatureId);
            formData.append('feature_id', 5);

            var token = `Bearer ${JSON.parse(token_)}`;

            var object = {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    //'Content-Type': 'application/json'
                    'Authorization': token,
                })
            };

            fetch(url, object)
                .then(async (response) => response.text())
                .then(async (responseText) => {
                        this.textInputComment.clear();
                        this.setState({commentText: ''});
                        Keyboard.dismiss();
                        var dataobject = JSON.parse(responseText);
                        if (dataobject.status == true) {

                            var cnt = parseInt(this.state.total_count) + 1;
                            this.setState({total_count: cnt});
                            this.state.data_list.unshift(dataobject.updated_comment_obj);
                            this.setState({offSetLoader: false});
                            //this.textInputComment.clear();
                            //this.setState({commentText: ''});
                            // if (this.state.Alldata.shout_out.shout_image !== '') {
                            //     const ratio = deviceWidth / this.state.Alldata.shout_out.shout_image_width;
                            //     const height = this.state.Alldata.shout_out.shout_image_height * ratio;
                            //     this.flatListRef.scrollToOffset({animated: true, offset: height});
                            // } else {
                            //     this.flatListRef.scrollToOffset({animated: true, offset: 0});
                            // }
                            // this.flatListRef.scrollToItem(0,true)
                            this.flatListRef.scrollToOffset(true, 1000)
                            this.refs.toast.show(
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'white',fontSize:12}}>Keep It Up </Text>
                                    <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                    />

                                </View>)
                        } else {
                            console.log(dataobject)
                            alert(dataobject.message);
                            this.setState({offSetLoader: false});
                        }

                    }
                )
                .catch((error) => {
                })


        } else {
            this.setState({offSetLoader: false});
            alert('Please add Comment.')
        }
    }


    shiftBack() {

        var length = this.state.total_count;
        var obj = {
            'comment_count': length,
            'from_page': 'AddReply',
            'high_five_status': this.state.userLiked,
            'high_five_count': this.state.highCount
        }
        //alert(JSON.stringify(obj))
        this.props.navigation.state.params.onGoBack(obj);
        this.props.navigation.goBack();

    }

    textInputFocused() {
        this.flatListRef.scrollToOffset({animated: true, offset: 5});
    }

    render() {
        return (
            <View style={styles.container}>
                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={240}
                    fadeInDuration={700}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />

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
                            }}>Edit COMMENT</Text>
                            <ScrollView>
                                <ModalUpdateShareWinReply
                                    week={this.state.week}
                                    updateContent={this.state.editPost}
                                    challengeId={this.state.challengeId}
                                    onGoBack={this.editUpdateData}
                                    onPopUp={this.editmodalVisible}
                                    nav={this.props.nav}/>
                            </ScrollView>
                        </View>

                    </View>
                    </KeyboardAvoidingView>
                </Modal>













                <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}} enabled
                                      behavior='padding' keyboardVerticalOffset={0}>
                    {/*{this.state.offSetLoader &&*/}
                    {/*<View style={{*/}
                    {/*    position: 'absolute',*/}
                    {/*    left: 0,*/}
                    {/*    right: 0,*/}
                    {/*    top: 0,*/}
                    {/*    bottom: 0,*/}
                    {/*    backgroundColor: 'transparent',*/}
                    {/*    justifyContent: 'center',*/}
                    {/*    alignItems: 'center'*/}
                    {/*}}>*/}
                    {/*    <ActivityIndicator size="large"/>*/}
                    {/*</View>*/}
                    {/*}*/}
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
                                    marginLeft: 0,
                                    alignContent: 'center',
                                    justifyContent: 'center', backgroundColor: 'transparent',
                                    flex: 1
                                }}>
                                    <Text style={{
                                        fontFamily: 'PoppinsBold',
                                        fontSize: 18,
                                        color: '#fff'
                                    }}>{this.state.feature_name}
                                    </Text>
                                </View>
                                <View style={styles.menu}></View>
                            </View>
                        </ImageBackground>
                    </View>
                    {/* Ended Header View */}


                    {/*{this.state.offSetLoader &&*/}

                    {/*<View style={styles.loader}>*/}
                    {/*    <ActivityIndicator size="large"/>*/}
                    {/*</View>*/}


                    {/*}*/}


                    {/*<TouchableOpacity style={{borderWidth:1.5,backgroundColor:'black',
                     marginHorizontal:15,height:45,marginTop:10,alignItems:'center',
                     justifyContent:'center',borderRadius:2}}
                     onPress={()=>this.props.navigation.navigate('DoComment',{DATA:this.state.Alldata})}
                     >
                            <Text style={{marginLeft:10,fontFamily:'PoppinsBold',fontSize:11,color:'white'}}>POST YOUR COMMENT</Text>
                     </TouchableOpacity>*/}
                    <View style={{flex: 1}}>
                        <FlatList
                            ref={(ref) => {
                                this.flatListRef = ref;
                            }}
                            style={{marginTop: 10, backgroundColor: 'transparent', paddingHorizontal: 0}}
                            data={this.state.data_list}
                            renderItem={({item, index}) => this.renderRow(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={this.handeLoadMoreItem}
                            onEndReachedThreshold={0.2}
                            ListHeaderComponent={this.headerComponent}
                            ListEmptyComponent={this.renderEmptyContainer}
                            ListFooterComponent={this.footerComponent}
                            // initialScrollIndex={-1}
                        />
                    </View>

                    <View style={{
                        zIndex: 99,
                        height: 40,
                        backgroundColor: 'transparent',
                        bottom: 0,
                        marginHorizontal: 10,
                        marginTop: 10,
                        marginBottom: 10
                    }}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View style={{
                                flex: 0.13,
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                            }}>
                                {this.state.profilePic == null &&
                                <Image
                                    source={profile}
                                    style={{width: 40, height: 40, borderRadius: 40 / 2}}>
                                </Image>
                                }
                                {this.state.profilePic != null &&
                                <Image
                                    source={{uri: this.state.profilePic}}
                                    style={{width: 40, height: 40, borderRadius: 40 / 2}}>
                                </Image>
                                }
                            </View>
                            <View style={{flex: 0.68}}>
                                <TextInput
                                    style={{
                                        width: '100%', minHeight: 40, backgroundColor: '#F0F0F6', paddingHorizontal: 10,
                                        elevation: 3,
                                        textAlignVertical: "center",
                                        shadowColor: "#000000",
                                        shadowOpacity: 0.3,
                                        shadowRadius: 2,
                                        shadowOffset: {
                                            height: 1,
                                            width: 1
                                        },
                                        paddingVertical: 5, borderRadius: 20
                                    }}
                                    onFocus={this.textInputFocused.bind(this)}
                                    placeholder="Comment here..."
                                    placeholderTextColor="grey"
                                    ref={input => {
                                        this.textInputComment = input
                                    }}

                                    onChangeText={text => this.setState({commentText: text})}
                                    underlineColorAndroid='transparent'
                                />
                            </View>
                            <View style={{flex: 0.02}}>
                            </View>
                            <View style={{flex: 0.17}}>
                                <TouchableOpacity onPress={() => [this.replyMessage(), Keyboard.dismiss()]}>
                                    <View style={{
                                        height: 40,
                                        backgroundColor: '#4AAFE3',
                                        borderRadius: 25,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            fontFamily: 'PoppinsBold',
                                            fontSize: 11,
                                            color: 'white',
                                            textAlign: 'center'
                                        }}>SEND</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
    backTextWhite: {
        color: '#FFF', fontSize: 10, fontFamily: 'PoppinsSemiBold'
    },
    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 35,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75, borderBottomLeftRadius: 5, borderTopLeftRadius: 5
    },
    backRightBtn222: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 65,
    },
    column: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    },
    trash: {
        height: 65,
        width: 65, backgroundColor: 'yellow'
    },

    backRightBtnLeft: {
        backgroundColor: '#fcce85',
        right: 130,
    },

    backRightBtnRight: {
        backgroundColor: '#5cc9bd',
        right: 70,
    }, backRightBtnRightnew: {
        backgroundColor: '#eb6c63',
        right: 5,
    },
    header_image: {
        flex: 1,
        height: 90
    },
    rowBack: {
        marginTop: 13, marginBottom: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',


    },

    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,


    }, hiddenImages: {
        width: 18,
        height: 18,
    },
    menuSEC: {
        width: 5,
        height: 18, marginRight: 15

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
    loader: {
        marginTop: 5, alignItems: 'center', height: 60,
    }
});
