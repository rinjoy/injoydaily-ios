//import React, {Component} from 'react';
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
//import {WebView} from 'react-native-webview';
// import { Constants, Video ,ScreenOrientation} from 'expo';
// import VideoPlayer from '@expo/videoplayer';
import {Video} from 'expo-av'

import * as SecureStore from 'expo-secure-store';
import HTML from 'react-native-render-html';
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
const gallaryblack = require('../../assets/gallaryblack.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');
const profile = require('../../images/image-9.png');
const dagger = require('../../images/dager.png');
const hands = require('../../images/hand.png');
const flag = require('../../images/flag.png');
const comment = require('../../images/comment.png');

const messageopenblack = require('../../assets/messageopenblack.png');

const image12 = require('../../images/image-12.png');
const image5 = require('../../images/image-5.png');
const userImage = require('../../images/image-11.png');
const image14 = require('../../images/image-14.png');
const image16 = require('../../images/image-16.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class WeaklyVideo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: '',
            challengeId: '',
            featureId: '',
            categoryId: '',
            day: '',
            week: '',
            uid: '',
            commentText: '',
            offSet: 0,
            offSetLoader: false,
            data_list: [],
            inFullscreen: false,
            reverse: false,
            shouldPlay: [],
            content: '',
            weeklyVideo_title: '',
            weeklyVideo_Desc: '',
            feature_name: '',
            button_text: '',
            isDialogVisible: false,
            itemCount: 0,
            popupQuestion: '',
            isPause: false,
            commentOwn: false,
            notInUse: false,
            tempActionStatus: false
            //directionY : [{ scaleY: -1 }],
            //directionX : [{ scaleX: -1 }],

        }
        this.renderRow = this.renderRow.bind(this);

    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );
        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {
        //alert(dataObject.weekly_video_category.category_id)
        this.setState({challengeId: dataObject.challenge_id});
        this.setState({uid: dataObject.uid});
        this.setState({categoryId: dataObject.weekly_video_category.category_id});
        this.setState({popupQuestion: dataObject.weekly_video_category.question});
        this.setState({featureId: dataObject.feature_id});
        this.setState({week: dataObject.week});
        this.setState({day: dataObject.day});
        this.setState({uid: dataObject.uid});
        this.setState({feature_name: dataObject.feature_name});

       // alert( dataObject.weekly_video_category.question)
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                //this.setState({offSetLoader: true});
                this.getDailyInspirationApiData(this.state.challengeId, this.state.featureId, this.state.week, this.state.uid, this.state.day);
            }
        }, 1000);


    }


    async getDailyInspirationApiData(challangeId, featureId, week, uid, day) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-weekly-video-content-see-all-current';

        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            feature_id: featureId,
            week: week,
            uid: this.state.id,
            day: day
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
                    // alert(responseText)
                    var dataobject = JSON.parse(responseText);
                    this.setState({offSetLoader: false});
                    //this.setState({itemCount: dataobject.count_records});
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }


    setDataList(text) {
        //alert(JSON.stringify(text))
        this.setState({data_list: text});

    }


    InheritedData(data) {
        // alert(JSON.stringify(data))
        if (data.status == true) {
            this.setDataList(data.weekly_video_current)
          //  this.setState({popupQuestion: dataObject.weekly_video_current.question_placeholder});
          //  alert(dataObject.weekly_video_current.question_placeholder)
        }
    }


    async commentOnVideo(challangeId, featureId, categoryId, week, uid, comment) {
        this.setState({isDialogVisible: false});

        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/submit-weekly-video-action';

        var parameters = {
            token: JSON.parse(token_),
            challenge_id: challangeId,
            feature_id: featureId,
            week: week,
            uid: this.state.id,
            comment: comment,
            category_id: categoryId
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
                    if (dataobject.status) {
                        this.setState({commentOwn: true});
                    }
                }
            )
            .catch((error) => {
            })


    }

    navigateToAll(challangeId, categoryId, featureId, week, uid) {
        //alert(categoryId)
        var parameters = {
            //  token: JSON.parse(token_),
            challenge_id: challangeId,
            category_id: categoryId,
            feature_id: featureId,
            week: week,
            uid: this.state.id
        };

        // alert(JSON.stringify(parameters));
        this.props.navigation.navigate('WeekelyVideoSeeAll', {DATA: parameters});
    }

    shiftBack() {
      //this.props.navigation.navigate('DashBoard');
      var obj={'uid': this.state.id}
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }

    renderRow(dataHolder, index) {
        return (
            <View
                key={index}
                style={{marginTop: 20, backgroundColor: 'transparent', width: '100%'}}>
                <Text style={{color: 'gray', fontFamily: 'PoppinsBold'}}>{"Week : " + dataHolder.item.week}</Text>
                <View style={{height: 1.5, backgroundColor: 'lightgray', marginTop: 5}}></View>
                {/*<TouchableOpacity style={{marginTop: 20}}*/}
                {/*                  onPress={() => [this.checkItemskill(dataHolder.index)]}>*/}

                {/*<Image source={{uri:dataHolder.item.video_poster}}*/}
                {/*       style={{ width: '100%', height: 220 ,borderRadius:6}}*/}
                {/*></Image>*/}
                <Video
                    source={{uri: 'https://cultivate-development.s3.amazonaws.com/backend/web/img/leadership-corner-video/1588179102.mp4'}}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    ref={videoplayer => {
                        this.videoPlayer = videoplayer
                    }}
                    resizeMode="cover"
                    //onTouchStart={() => alert('start')}
                    isLooping={false}
                    shouldPlay={this.state.shouldPlay[index]}
                    shouldCorrectPitch={true}
                    useNativeControls={true}
                    // paused={this.state.isPause}

                    //onMagicTap={()=>alert('ff')}
                    //paused={this.state.shouldPlay[index]}
                    //  onPlaybackStatusUpdate={(isPlaying ,isBuffering ) =>console.log(isPlaying.isPlaying)}
                    // onPlaybackStatusUpdate={()=>alert("playing")}
                    // onReadyForDisplay={()=>alert('playing...')}
                    //usePoster={true}
                    // onPlaybackStatusUpdate={(status)=>console.log(status)}
                    //posterSource={{url:dataHolder.item.video_poster}}
                    //posterStyle={{ width: '100%', height: 220}}
                    style={{width: '100%', height: 220, borderRadius: 6, marginTop: 20}}
                />


                {/*</TouchableOpacity>*/}

                <Text style={{
                    fontFamily: 'PoppinsSemiBold', fontSize: 18,
                    marginTop: 8
                }}
                >{dataHolder.item.title}
                </Text>


                <HTML
                    html={dataHolder.item.description}
                    imagesMaxWidth={screenWidth}
                    containerStyle={{marginTop: 1,}}
                />

                {(dataHolder.item.user_actions.action_status) &&
                this.renderCommentSection(dataHolder, dataHolder.index)
                }

                {/*{this.state.commentOwn && dataHolder.index == 0 &&*/}
                {this.state.commentOwn &&
                this.renderCommentSection(dataHolder, dataHolder.index)
                }

                {(this.state.week == dataHolder.item.week && !dataHolder.item.user_actions.action_status && !this.state.commentOwn) &&
                <TouchableOpacity
                    style={styles.login_button}
                    onPress={() => this.setState({isDialogVisible: true})}
                >

                    <Text
                        style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold'}} numberOfLines={1}>
                        {dataHolder.item.question_placeholder}</Text>

                </TouchableOpacity>
                }

                <View style={{flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 45}}>
                    <TouchableOpacity
                        style={styles.loader}
                        onPress={() => this.navigateToAll(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.week, this.state.uid)}>
                        <Text style={{fontSize: 16, color: 'white', fontFamily: 'PoppinsSemiBold'}}>See All</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    renderCommentSection(dataHolder, index) {
        return (
            <View key={index}
                  style={{backgroundColor: 'transparent', marginTop: 10}}>
                {/*<View style={{height: 1, backgroundColor: 'lightgray', marginTop: 0, width: 22}}>*/}
                {/*</View>*/}
                <Text style={{
                    color: 'black',
                    fontFamily: 'PoppinsSemiBold',
                    marginTop: 0, marginLeft: 0, marginRight: 7
                }}>{this.state.commentOwn ? 'What is one thing you took away from this video?' : dataHolder.item.question_placeholder}</Text>
                <Text style={{
                    color: 'black', fontFamily:
                        'PoppinsLight', marginLeft: 0,
                    fontSize: 12, marginTop: 3, marginRight: 7
                }}>{this.state.commentOwn ? this.state.commentText : dataHolder.item.user_actions.comment}
                </Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => item.id + '' + index;

    render() {
        console.log("Render")
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
                                marginLeft: 0,
                                alignContent: 'center',
                                justifyContent: 'center', backgroundColor: 'transparent',
                                flex: 1
                            }}>
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsBold',
                                        fontSize: 18
                                    }}>{this.state.feature_name == "" ? '-' : this.state.feature_name}
                                </Text>


                            </View>

                            <View style={styles.menuSEC}>

                                {/* <Image source={dagger}  style={styles.menuSEC}>
                                </Image> */}
                            </View>

                        </View>
                    </ImageBackground>

                    {this.state.isDialogVisible &&


                    <Modal

                        isVisible={this.state.isDialogVisible}
                        style={styles.modal}
                        backdropOpacity={0.2}
                    >

                        <View style={{
                            flex: 1,
                            borderRadius: 10,
                            backgroundColor: 'transparent',
                            width: '98%',
                            height: '100%'
                        }}>

                            <View style={{flex: 0.8, backgroundColor: 'transparent', borderRadius: 0, padding: 3}}>
                                <Text style={{
                                    marginTop: 5,
                                    paddingHorizontal: 10, paddingVertical: 10,
                                    color: 'black',
                                    fontSize: 15,
                                    fontFamily: 'PoppinsBold'
                                }}
                                      numberOfLines={2}
                                >What is one thing you took away from this video?</Text>
                                <View style={styles.email_view}>
                                    <TextInput
                                        placeholder='Please fill your experience...'
                                        keyboardType={"email-address"}
                                        returnKeyType={'next'}
                                        value={this.state.commentText}
                                        onChangeText={(text) => this.setState({commentText: text})}
                                        style={{
                                            marginTop: 0, fontSize: 15, padding: 0, color: 'gray',
                                            paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'transparent',
                                            width: '100%', height: '100%'
                                        }}
                                        multiline={true}
                                    >
                                    </TextInput>
                                </View>
                            </View>

                            <View style={{height: 1, backgroundColor: 'gray'}}></View>
                            <View style={{
                                flex: 0.2, backgroundColor: 'transparent', flexDirection: 'row',
                                marginTop: 0, paddingVertical: 15, paddingHorizontal: 15
                            }}>
                                <TouchableOpacity style={{
                                    marginRight: 5,
                                    backgroundColor: 'black',
                                    alignItems: 'center',
                                    flex: 0.5, borderRadius: 5,
                                    justifyContent: 'center'
                                }}
                                                  onPress={() =>
                                                      this.state.commentText == '' ? alert('please fill text first...')
                                                          : this.commentOnVideo(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid, this.state.commentText)}
                                >
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontFamily: 'PoppinsMedium'
                                    }}>Submit</Text>
                                </TouchableOpacity>


                                {/*<View style={{height: '100%', backgroundColor: 'gray',width:1}}></View>*/}

                                <TouchableOpacity style={{
                                    marginLeft: 5,
                                    backgroundColor: 'black',
                                    alignItems: 'center',
                                    flex: 0.5, borderRadius: 5,
                                    justifyContent: 'center'
                                }}
                                                  onPress={() => this.setState({
                                                      isDialogVisible: false,
                                                      commentText: ''
                                                  })}
                                >
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontFamily: 'PoppinsMedium'
                                    }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>


                        </View>

                    </Modal>
                    }
                </View>
                {/* Ended Header View */}

                <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>
                <FlatList
                    style={styles.flatlist}
                    //  keyExtractor={this._keyExtractor}
                    //showsHorizontalScrollIndicator={false}
                    // showsVerticalScrollIndicator={false}
                    data={this.state.data_list}
                    // ListFooterComponent={this.footerComponent}
                    //onEndReached={this.handeLoadMoreItem}
                    //onEndReachedThreshold={0}
                    //pagingEnabled={false}
                    extraData={this.state}
                    renderItem={this.renderRow}/>

            </View>
        );
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    modal: {
        width: '80%', backgroundColor: 'white', flex: 0.45,
        borderRadius: 10
        , alignItems: 'center', justifyContent: 'center', alignContent: 'center'
        , alignSelf: 'center', marginTop: screenHeight / 3, borderColor: 'gray', borderWidth: 0
    },
    header_view: {
        height: 90,

    },
    backTextWhite: {
        color: '#FFF', fontSize: 10, fontFamily: 'PoppinsSemiBold'
    },
    flatlist: {
        flex: 1, backgroundColor: 'transparent'
        , paddingHorizontal: 15, paddingVertical: -50
    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45, flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'lightgray', marginHorizontal: 0,
        borderRadius: 5, marginBottom: 5, marginTop: 20
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
        width: 23,
        height: 16,
        marginLeft: 15,


    }, hiddenImages: {
        width: 18,
        height: 18,
    },
    menuSEC: {
        width: 5,
        height: 18, marginRight: 15

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
        flex: 1, borderRadius: 15,
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1, margin: 10,
        marginTop: 0
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
        marginTop: 70,borderRadius:5,
        alignItems: 'center',
        height: 45,
        backgroundColor: "black",
        width: '50%',
        justifyContent: 'center'
    }
});
