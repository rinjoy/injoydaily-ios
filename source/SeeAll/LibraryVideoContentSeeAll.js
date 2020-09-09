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
import ReadMore from 'react-native-read-more-text';
import * as SecureStore from 'expo-secure-store';
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
const playButton = require('../../images/play-btn.png');
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

export default class LibraryVideoContentSeeAll extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accessToken: '',
            featureId: '',
            categoryId: '',
            challengeId: this.props.navigation.state.params.DATA.CHID,
            itemId: this.props.navigation.state.params.DATA.ITEMID,
            day: '',
            week: '',
            uid: '',
            commentText: '',
            offSet: 0,
            offSetLoader: false,
            data_list: [],
            inFullscreen: false,
            reverse: false,
            content: '',
            weeklyVideo_title: '',
            weeklyVideo_Desc: '',
            feature_name: '',
            button_text: '',
            isDialogVisible: false,
            itemCount: 0,
            popupQuestion: '',
            isPause: [],
            shouldPlay: [],
            commentOwn: false,
            notInUse: false,
            tempActionStatus: false,
            pagetitle:this.props.navigation.state.params.DATA.TITLE,
            splittedTitle:'',

            //directionY : [{ scaleY: -1 }],
            //directionX : [{ scaleX: -1 }],

        }

    }


    componentDidMount() {
        // alert('ji')
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );
        this.getDataObject()
         this.state.splittedTitle =  this.state.pagetitle.split(' ');

    }


    getDataObject() {
        if ((this.state.challengeId != undefined && this.state.itemId != undefined)) {
           // this.setState({offSetLoader: true});
            this.getVideos();
        }


        // setTimeout(() => {
        //     if (this.state.challengeId != undefined) {
        //         this.setState({offSetLoader: true});
        //         this.getDailyInspirationApiData(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid);
        //     }
        // }, 1000);


    }

    async getVideos() {
        this.setState({offSetLoader: true});
      const{uid, challengeId ,itemId  }= this.state;
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-all-tagged-library-video-details';

        var parameters = {
            token: JSON.parse(token_),
            uid : uid,
            challenge_id : challengeId,
            tag_id : itemId,
            page_size : 7,
            data_offset:this.state.offSet
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
                    //alert(JSON.stringify(dataobject))
                   // console.log('dataobject', dataobject);
                    this.setState({itemCount: dataobject.count_records});
                   this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
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
            uid: uid,
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
                        //this.props.navigation.navigate('DashBoard');


                        // this.setState({data_list: []});
                        // this.setState({offSetLoader: true});
                        this.setState({commentOwn: true});
                        // this.setState({notInUse: true});
                        //await  this.getDailyInspirationApiData(this.state.challengeId, this.state.featureId, this.state.categoryId, this.state.week, this.state.uid);

                        // this.setState({commentText:''});
                        //   alert('success');
                    }
                }
            )
            .catch((error) => {
            })


    }

    setDataList(text) {
        this.setState({data_list: this.state.data_list.concat(text)});
    }

    InheritedData(data) {
       // alert(JSON.stringify(data.content))
        if (data.status == true) {
            this.setDataList(data.content)
            this.setState({offSetLoader: false});

        }
    }

    handeLoadMoreItem = () => {
      ///  alert(this.state.itemCount)
        if (this.state.itemCount !== 0) {
            this.setState({offSet: this.state.offSet + 7});
            this.getVideos();
        }
    }

    footerComponent = () => {

            return (
                <View style={{height: 50}}>
                    <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>

                </View>
            )


    }

    emptyContainer = () =>{
        return (<View style={{flex:1 ,alignItems:'center',justifyContent:'center',height:screenHeight}}>
            <Text style={{fontFamily:'PoppinsRegular',fontSize:12}}>No Video available.</Text>
        </View>);
    }


    renderRow(dataHolder, index) {
        //  console.log('renderRow',this.state.commentOwn);
       // const check = dataHolder.user_actions.action_status;
        //const regex = /(<([^>]+)>)/ig;
        var result = dataHolder.description.replace(/<(.|\n)*?>/g, '');
        result = result.replace(/\&nbsp;/g, '');
        result = result.replace(/\&#39;/g, "'");
        result = result.replace(/\&rsquo;/g, "'");
        //dataHolder.item.description.replace(/\&nbsp;/g, '');
        //const result = dataHolder.item.description;
        return (
            <View
                key={index}
                style={{marginTop: 0, marginBottom: 20, backgroundColor: 'transparent', width: '100%'}}>
                {/*<View style={{paddingHorizontal: 15}}>*/}
                {/*    <Text style={{color: 'gray', fontFamily: 'PoppinsBold'}}>{"Week : " + dataHolder.week}</Text>*/}
                {/*</View>*/}
                {/*<View style={{*/}
                {/*    height: 1.5,*/}
                {/*    marginLeft: 15,*/}
                {/*    marginRight: 15,*/}
                {/*    backgroundColor: 'lightgray',*/}
                {/*    marginTop: 5*/}
                {/*}}></View>*/}

                <TouchableOpacity activeOpacity={1} style={{marginTop: 0}}
                                  onPress={() => this.setState({
                                      shouldPlay: true,
                                      isPause: false
                                  })}>
                    {this.state.isPause &&
                    <View style={{justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <Image source={{uri: dataHolder.image}}
                               style={{width: '100%', height: 220, borderRadius: 6}}
                        ></Image>
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image source={playButton}
                                   style={{height: 55, width: 55}}
                            ></Image>
                        </View>
                    </View>
                    }

                    {!this.state.isPause &&
                    <Video
                        source={{uri: dataHolder.video}}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        ref={videoplayer => {
                            this.videoPlayer = videoplayer
                        }}
                        resizeMode="cover"
                        //onTouchStart={() => alert('start')}
                        isLooping={false}
                        shouldPlay={this.state.shouldPlay}
                        shouldCorrectPitch={true}
                        useNativeControls={true}
                        paused={this.state.isPause}

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
                    }
                </TouchableOpacity>

                {/*</TouchableOpacity>*/}
                <View style={{paddingHorizontal: 15}}>
                    <Text style={{
                        fontFamily: 'PoppinsSemiBold', fontSize: 18,
                        marginTop: 8
                    }}
                    >{dataHolder.title}
                    </Text>

                    <ReadMore
                        numberOfLines={5}
                        renderTruncatedFooter={this._renderTruncatedFooter}
                        renderRevealedFooter={this._renderRevealedFooter}
                        onReady={this._handleTextReady}>
                        <Text style={{fontSize: 14, marginTop: 5, paddingHorizontal: 15}}>
                            {result}
                        </Text>
                    </ReadMore>

                    {/*<HTML
                    allowFontScaling={false}
                    html={dataHolder.item.description}
                    imagesMaxWidth={screenWidth}
                    containerStyle={{marginTop: 1,}}
                />*/}

                    {/*{(dataHolder.user_actions.action_status) &&*/}
                    {/*this.renderCommentSection(dataHolder, dataHolder.index)*/}
                    {/*}*/}

                    {/*{this.state.commentOwn && dataHolder.index == 0 &&*/}
                    {/*this.renderCommentSection(dataHolder, dataHolder.index)*/}
                    {/*}*/}

                    {/*{(this.state.week == dataHolder.item.week && !dataHolder.item.user_actions.action_status && !this.state.commentOwn) &&*/}
                    {/*<TouchableOpacity*/}
                    {/*    style={styles.login_button}*/}
                    {/*    onPress={() => this.setState({isDialogVisible: true})}*/}
                    {/*>*/}

                    {/*    <Text*/}
                    {/*        style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold'}} numberOfLines={1}>*/}
                    {/*        {dataHolder.item.question_placeholder}</Text>*/}

                    {/*</TouchableOpacity>*/}
                    {/*}*/}
                </View>
            </View>
        )
    }


    _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={{color: '#008CE3', marginTop: 5}} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={{color: '#008CE3', marginTop: 0}} onPress={handlePress}>
                Show less
            </Text>
        );
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
                }}>{this.state.commentOwn ? this.state.popupQuestion : dataHolder.item.question_placeholder}</Text>
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
                {/*<Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>*/}
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
                                <Text
                                    style={{
                                        fontFamily: 'PoppinsBold',
                                        color: '#fff',
                                        fontSize: 18
                                    }}>{this.state.splittedTitle[0]}</Text>


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
                                >{this.state.popupQuestion}</Text>


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

                <FlatList
                    style={styles.flatlist}
                    contentContainerStyle={{paddingVertical:20}}
                    //  keyExtractor={this._keyExtractor}
                    //showsHorizontalScrollIndicator={false}
                    // showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.footerComponent}
                    onEndReached={this.handeLoadMoreItem}
                    onEndReachedThreshold={0}
                    pagingEnabled={false}
                    extraData={this.state}
                    ListEmptyComponent={this.emptyContainer}
                    data={this.state.data_list}
                    renderItem={({item, index}) => this.renderRow(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />


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
        , paddingHorizontal: 0, paddingVertical: 0
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
        marginTop: 5, alignItems: 'center', height: 60, backgroundColor: "transparent"
    }
});
