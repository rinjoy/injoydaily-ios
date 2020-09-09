//import React, {Component} from 'react';
import React from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Platform,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,ScrollView,
    View
} from 'react-native';
//import {WebView} from 'react-native-webview';
// import { Constants, Video ,ScreenOrientation} from 'expo';
// import VideoPlayer from '@expo/videoplayer';
import {Video} from 'expo-av'
import Toast from "react-native-easy-toast";
import * as SecureStore from 'expo-secure-store';
import HTML from 'react-native-render-html';
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";
import ReadMore from 'react-native-read-more-text';
import Emoji from "react-native-emoji";
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

const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');

const messageopenblack = require('../../assets/messageopenblack.png');

const image12 = require('../../images/image-12.png');
const image5 = require('../../images/image-5.png');
const userImage = require('../../images/image-11.png');
const image14 = require('../../images/image-14.png');
const image16 = require('../../images/image-16.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');
const playButton = require('../../images/play-btn.png');

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
            challengeId:this.props.navigation.state.params.challenge_details.challenge_id,
            featureId: 6,
            categoryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            day: this.props.navigation.state.params.challenge_details.day,
            week: this.props.navigation.state.params.challenge_details.week,
            points: this.props.navigation.state.params.DATA.points,
            check_status: this.props.navigation.state.params.challenge_details.check_status,
            uid: '',
            commentText: '',
            offSet: 0,
            offSetLoader: true,
            data_list: [],
            inFullscreen: false,
            reverse: false,
            shouldPlay: false,
            isPause: true,
            content: '',
            weeklyVideo_title: '',
            weeklyVideo_Desc: '',
            feature_name: this.props.navigation.state.params.challenge_details.feature_name,
            button_text: '',
            isDialogVisible: false,
            itemCount: 0,
            popupQuestion: '',
            commentOwn: false,
            notInUse: false,
            profilePic: null,
            userName: '',
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
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                //this.setState({offSetLoader: true});
                this.getDailyInspirationApiData();
            }
        }, 1000);


    }


    async getDailyInspirationApiData() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-weekly-video-content-see-all-current';

        var parameters = {
            token: JSON.parse(token_),
            challenge_id: this.state.challengeId,
            feature_id: this.state.featureId,
            week: this.state.week,
            uid: this.state.id,
            day: this.state.day
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
                    console.log('responseText', responseText);
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
            this.setDataList(data.weekly_video_current);
            this.setState({profilePic: data.weekly_video_current[0].user_details.profile_pic});
            this.setState({userName: data.weekly_video_current[0].user_details.username});

            var data = data.weekly_video_question_placeholder
            this.setState({popupQuestion: data});
        }
    }


    async commentOnVideo() {
      if(this.state.commentText == '' && !this.state.check_status) {
        alert('please fill text first...')
      }
      else if(this.state.check_status){
        alert('You have submitted already.')
      }
      else{
        this.setState({isDialogVisible: false});
        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/submit-weekly-video-action';


        var parameters = {
            token: JSON.parse(token_),
            challenge_id: this.state.challengeId,
            feature_id: 6,
            week: this.state.week,
            uid: this.state.id,
            comment: this.state.commentText,
            category_id: this.state.categoryId
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
                      this.setState({offSetLoader: false});
                        this.setState({commentOwn: true});
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>Nailed It! </Text>
                                <Emoji name="raised_hands" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                />
                            </View>)
                        this.getDailyInspirationApiData();
                    }
                }
            )
            .catch((error) => {
            })

      }
    }

    navigateToAll(challangeId, categoryId, featureId, week, uid) {
        //alert(categoryId)
        var parameters = {
            //  token: JSON.parse(token_),
            challenge_id: challangeId,
            category_id: categoryId,
            feature_id: featureId,
            week: week,
            uid: uid
        };

        // alert(JSON.stringify(parameters));
        this.props.navigation.navigate('WeekelyVideoSeeAll', {DATA: parameters});
    }

    _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: '#4AAFE3', marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: '#4AAFE3', marginTop: 0}} onPress={handlePress}>
        Show less
      </Text>
    );
  }


  textInputFocused () {
    this.scrollViewWeekly.scrollTo(400);
  }

    renderRow(dataHolder, index) {
      const regex = /(<([^>]+)>)/ig;
      const result = dataHolder.item.description.replace(regex, '');
       return (
           <View
               key={index}
               style={{marginTop: 20, backgroundColor: 'transparent', flex: 1}}>
               <Text style={{color: 'gray', paddingHorizontal: 15, fontFamily: 'PoppinsBold'}}>{"Week : " + dataHolder.item.week}</Text>
               <View style={{height: 1.5, backgroundColor: 'lightgray', marginLeft: 15, marginRight: 15, marginTop: 5}}></View>
               <TouchableOpacity activeOpacity={1} style={{marginTop: 20}}
                                 onPress={() => this.setState({
                                     shouldPlay: true,
                                     isPause: false
                                 })}>



                   {this.state.isPause &&
                     <View style={{justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                         <Image source={{uri:dataHolder.item.video_poster}}
                                style={{ width: '100%', height: 220 ,borderRadius:6}}
                         ></Image>
                         <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                           <Image source={playButton}
                                  style={{height: 55, width: 55}}
                           ></Image>
                         </View>
                   </View>
                   }

                   {!this.state.isPause &&
                   <Video
                       source={{uri: dataHolder.item.video_url}}
                       rate={1.0}
                       volume={1.0}
                       mute={false}
                       ref={videoplayer => {
                           this.videoPlayer = videoplayer
                       }}
                       resizeMode="stretch"
                       //onTouchStart={() => alert('start')}
                       isLooping={false}
                       shouldPlay={this.state.shouldPlay}
                       //  shouldCorrectPitch={true}
                       useNativeControls={true}
                       paused={this.state.isPause}
                       //onMagicTap={()=>alert('ff')}
                       //paused={this.state.shouldPlay[index]}
                       //  onPlaybackStatusUpdate={(isPlaying ,isBuffering ) =>console.log(isPlaying.isPlaying)}
                       // onPlaybackStatusUpdate={()=>alert("playing")}
                       // onReadyForDisplay={()=>alert('playing...')}
                       //usePoster={true}
                       // onPlaybackStatusUpdate={(status)=>console.log(status)}
                       //posterSource={{url: dataHolder.item.video_poster}}
                       //posterStyle={{width: '100%', height: 220, resizeMode: 'stretch'}}
                       style={{width: '100%', height: 220, borderRadius: 6, marginTop: 20}}
                   />
                   }
               </TouchableOpacity>

               <Text style={{
                   backgroundColor: 'transparent', fontFamily: 'PoppinsSemiBold', backgroundColor: 'transparent', textAlign: 'center', fontSize: 18,
                   paddingHorizontal: 28,
                   marginTop: 8
               }}
               >{dataHolder.item.title}
               </Text>
               <View style={{marginTop: 15, marginBottom: 15, paddingHorizontal: 15}}>
               <ReadMore
                   numberOfLines={1}
                   renderTruncatedFooter={this._renderTruncatedFooter}
                   renderRevealedFooter={this._renderRevealedFooter}
                   onReady={this._handleTextReady}>
                   <Text style={{fontSize: 14, marginTop: 1, paddingHorizontal: 15}}>
                     {result}
                   </Text>
                 </ReadMore>
              </View>
               {/*<HTML
                   allowFontScaling={false}
                   html={dataHolder.item.description}
                   imagesMaxWidth={screenWidth}
                   containerStyle={{marginTop: 1, paddingHorizontal: 15}}
               />*/}
               <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
                  <View style={{height: 1.5, backgroundColor: 'lightgray', width: 250, marginTop: 5}}></View>
               </View>
               {(this.state.check_status) &&
               this.renderCommentSection(dataHolder, dataHolder.index)
               }
               {/*{this.state.commentOwn && dataHolder.index == 0 &&*/}
               {this.state.commentOwn &&
               this.renderCommentSection(dataHolder, dataHolder.index)
               }

               {/*{(this.state.week == this.state.week && !this.state.check_status && !this.state.commentOwn) &&
               <TouchableOpacity
                   style={styles.login_button}
                   //onPress={() => this.setState({isDialogVisible: true})}
               >

                   <Text
                       style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold'}}>
                       {this.state.popupQuestion}</Text>

               </TouchableOpacity>
               }*/}


               {(this.state.week == this.state.week && !this.state.check_status && !this.state.commentOwn) &&
               <View style={{paddingHorizontal: 15}}>
                   <Text
                       style={{fontSize: 17, color: 'black', fontFamily: 'PoppinsSemiBold'}}>
                       {this.state.popupQuestion}</Text>
                       <View style={{flex: 1, borderRadius: 15,
                       marginHorizontal: 0,
                       flexDirection: 'row',
                       backgroundColor: 'white',
                       borderColor: 'white',
                       borderWidth: 1, margin: 10,
                       marginTop: 10}}>
                       <View style={{flex: 0.18, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                         {this.state.profilePic == null &&
                         <Image
                             source={profile}
                             style={{width: 50, height: 50, borderRadius: 50/2}}>
                         </Image>
                         }
                         {this.state.profilePic != null &&
                         <Image
                             source={{uri: this.state.profilePic}}
                             style={{width: 50, height: 50, borderRadius: 50/2}}>
                         </Image>
                         }
                       </View>

                       <View style={{flex: 0.82, backgroundColor: 'transparent'}}>
                           <TextInput
                               placeholder='Share your takeaway here...'
                               returnKeyType={'next'}
                               numberOfLines= {3}
                               onFocus={this.textInputFocused.bind(this)}
                               value={this.state.commentText}
                               onChangeText={(text) => this.setState({commentText: text})}
                               style={{textAlignVertical: "top", minHeight: 80,
                                   marginTop: 0, fontSize: 15, padding: 0, color: 'gray',
                                   paddingVertical: 6, height: 200, borderWidth: 1, borderColor: 'lightgray', borderRadius: 25, paddingHorizontal: 10, backgroundColor: '#F0F0F6',
                                   width: '100%', height: '100%'
                               }}
                               multiline={true}
                           >
                           </TextInput>
                        </View>
                       </View>
                  </View>
                }

               <View style={{marginTop: 25, paddingHorizontal: 15, backgroundColor: 'transparent', justifyContent: 'space-between', flexDirection: 'row', flex: 1, marginBottom: 20}}>
               <View style={{flex: 0.2}}>

               </View>
               <View style={{flex: 0.6, justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center'}}>
                    {/*{(this.state.week == this.state.week && !this.state.check_status && !this.state.commentOwn) &&*/}
                     <TouchableOpacity
                         style={{alignItems: 'center',
                         justifyContent: 'center',
                         backgroundColor: '#4AAFE3',
                         flexDirection: 'row',
                         borderWidth: 1, paddingVertical: 8,
                         paddingHorizontal: 25,
                         borderColor: 'lightgray', marginHorizontal: 0,
                         borderRadius: 25, marginBottom: 0, marginTop: 0}}
                         onPress={() => this.commentOnVideo()}
                     >
                     {dataHolder.item.user_actions.action_status &&
                       <Image source={checkyellow}
                              style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                       </Image>
                     }
                     {!dataHolder.item.user_actions.action_status &&
                       <Image source={checkgray}
                              style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                       </Image>
                     }
                         <Text
                             style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold', marginLeft: 10}}>
                             Submit {this.state.points} Points</Text>
                     </TouchableOpacity>
                     {/*}*/}
               </View>
               <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                     {this.state.week !== 1 &&
                       <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 0}}>
                           <TouchableOpacity
                               style={{borderRadius: 5,
                                 alignItems: 'flex-start',
                                 width: '100%',
                                 justifyContent: 'center'}}
                               onPress={() => this.navigateToAll(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.week, this.state.id)}>
                               <Text style={{fontSize: 15, color: 'black', borderBottomWidth: 1, fontFamily: 'PoppinsRegular'}}>See All ></Text>
                           </TouchableOpacity>
                       </View>
                     }
               </View>
               </View>

           </View>
       )
   }

    renderCommentSection(dataHolder, index) {
        return (
            <View key={index}
                  style={{backgroundColor: 'transparent', marginTop: 10, paddingHorizontal: 15}}>
                {/*<View style={{height: 1, backgroundColor: 'lightgray', marginTop: 0, width: 22}}>*/}
                {/*</View>*/}
                <Text style={{
                    color: 'black',
                    fontFamily: 'PoppinsSemiBold',
                    fontSize: 17,
                    marginTop: 0, marginLeft: 0, marginRight: 0
                }}>{ this.state.popupQuestion }</Text>
                <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
                </View>



                <View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                  {this.state.profilePic == null &&
                    <Image
                        source={profile}
                        style={{width: 45, height: 45, borderRadius: 45/2}}>
                    </Image>
                    }
                    {this.state.profilePic != null &&
                    <Image
                        source={{uri: this.state.profilePic}}
                        style={{width: 45, height: 45, borderRadius: 45/2}}>
                    </Image>
                    }

                    <View style={{backgroundColor:'transparent',alignItems:"flex-start", flex: 1.0, marginLeft:10}}>
                                <Text style={{fontFamily:'PoppinsBold'}} >{this.state.userName}</Text>
                                <Text  style={{fontSize:13,fontFamily:'PoppinsRegular',color:'black',marginTop:0}}>{this.state.commentOwn ? this.state.commentText : dataHolder.item.user_actions.comment}</Text>
                    </View>
                  </View>
                </View>



            </View>
        )
    }

	 shiftBack() {
      var obj={'uid': this.state.id};
      this.props.navigation.state.params.onGoBack(obj);
      this.props.navigation.goBack();
    }

    _keyExtractor = (item, index) => item.id + '' + index;

    render() {
        console.log("Render")
        return (
            <View style={styles.container}>
            <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
            <View style={{flex: 1}}>
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
                                        color: '#fff',
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
                                    fontSize: 17,
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
                                                  onPress={() => this.commentOnVideo()}
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

                <ScrollView keyboardShouldPersistTaps={'handled'} ref={ref => {this.scrollViewWeekly = ref}} style={{flex:1,backgroundColor:'white'}}>
                    <FlatList
                        style={styles.flatlist}
                        ref={ref => this.flatListR = ref}
                        keyboardShouldPersistTaps={'handled'}
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
                </ScrollView>

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='bottom'
                    positionValue={130}
                    fadeInDuration={700}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                </View>
              </KeyboardAvoidingView>

            </View>
        );
    }


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'transparent'
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
        flex: 1, backgroundColor: 'white'
        , paddingHorizontal: 0, paddingVertical: -50
    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'black',
        borderWidth: 1,paddingVertical:13,
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
        marginTop: 32,borderRadius:5,
        alignItems: 'center',
        height: 45,
        backgroundColor: "black",
        width: '50%',
        justifyContent: 'center'
    }
});
