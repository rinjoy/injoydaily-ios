import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    Image,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    StatusBar,
    ScrollView,
    AppState,
    TextInput,
    KeyboardAvoidingView,
    Text,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    View
} from 'react-native';

import ModalPremium from './../modals/ModalPremium';
import ModalUpdateShoutOut from './../modals/ModalUpdateShoutOut';
import SideMenu from 'react-native-side-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import Loader from './../loader/Loader';
import RNPickerSelect from 'react-native-picker-select';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';

const boxIcon = require('./../../images/high-five-bar.png');
const handsBlack = require('./../../images/hand-blck.png');
const handsBlue = require('./../../images/hand-blue.png');
const unlockblack = require('./../../assets/unlockblack.png');
const starshinegray = require('./../../images/starshinegray.png');
const nextarrow = require('./../../assets/nextarrow.png');
const unlockgray = require('./../../assets/unlockgray.png');
const hands = require('./../../images/handsblue.png');
const checkyellow = require('./../../images/checkblue1.png');
const checkgray = require('./../../images/checkgray.png');
const unlike = require('./../../images/2.png');
const like = require('./../../images/3.png');
const flags = require('./../../images/1.png');
const comments = require('./../../images/4.png');
const dagger = require('../../images/dager.png');
const comments1 = require('../../images/comments.png');
const commentblue = require('./../../images/commentblue.png');
const backg = require('./../../images/bg_popup.png');
const editblack = require('./../../assets/editblack.png');
const flagblack = require('./../../assets/flagblack.png');
const crossarrow = require('./../../images/close.png');

console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;

export default class Feature2 extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            comment_list: [].fill('')
            .map((_, i) => ({key: `${i}`, text: `item #${i}`}))
            ,
            comment_reply_list: [].fill('')
            .map((_, i) => ({key: `${i}`, text: `item #${i}`}))
            ,
            accessToken: '',
            offSetLoader:false,
            offSetLoader1: false,
            scrollDown: false,
            reportcommentText: '',
            commentText: '',
            view2LayoutProps: {
              left: 0,
              top: 0,
              width: 100,
              height: 100,
            },
            todayCount: 0,
            spamVal: null,
            linkFeatureId: 0,
            title: '',
            challenge_id: this.props.challenge_id,
            feature_id: 2,
            flagIndex: '',
            appState: AppState.currentState,
            basicArray: this.props.basicData,
            week: this.props.basicData.details.week,
            day: this.props.basicData.details.week,
            UID: 0,
            featureType: this.props.dataFromParent.feature_type,
            //featureType: 1,
            premiumModal: false,
            userProfilePic: this.props.user_pic,
            premiumModal1: false,
            editIndex: '',
            editPost: {},
            flagModal: false,
            editModal: false,
            itemCount: 0,
            offSet:0,
            challengeArray: this.props.dataFromParent,
        };
        this.premium1 = this.premium1.bind(this);
        this.flagmodalVisible = this.flagmodalVisible.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
        this.getShoutReplyComments = this.getShoutReplyComments.bind(this);
    }

    componentDidMount() {

      AppState.addEventListener('change', this._handleAppStateChange);
      getUserId().then(id =>
          this.setState({UID: id}),
      );
        this.getAccessToken();
        this.getShoutOutApiData();
    }

    componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async(nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        this.getShoutOutApiData();
      }
      this.setState({appState: nextAppState});
    }

    premium1() {
      this.setState({premiumModal1: !this.state.premiumModal1})
    }

    flagmodalVisible() {
      this.setState({flagModal: !this.state.flagModal})
    }

    editmodalVisible() {
      this.setState({editModal: !this.state.editModal})
    }

    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});
        //alert(this.state.accessToken);
        console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
            //this.getChallenges();
        }

    }

    componentWillReceiveProps(nextProps) {
      // alert('Here');
    }

    async getShoutOutApiData() {

      this.setState({offSetLoader:true});
        const token_  =await SecureStore.getItemAsync('token');
       const url = global.base_url_live+'v1/api/get-shout-all';
 // alert(token_)
       var parameters = {
           token: JSON.parse(token_),
           challenge_id:this.state.challenge_id,
           feature_id:this.state.feature_id,
           uid: this.state.UID,
           page_size:10,
           data_offset:this.state.offSet
       };
       var token = `Bearer ${JSON.parse(token_)}`;
  //   alert(JSON.stringify(parameters));
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
                   //console.log('FULL Data', dataobject);
                    //alert(JSON.stringify(responseText))
                   //this.setState = ({data_list: dataobject})
                   // Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                   //this.setState({offSetLoader:false});
                   this.setState({itemCount: dataobject.count_records});
                   this.setState({title: dataobject.shout_out_all.shout_out_category.title});
                   this.setState({todayCount: dataobject.user_today_actions});


                   if(dataobject.count_records == 0){
                    ///  alert('countis xoe')
                      this.setState({offSetLoader:false});
                  }


                this.InheritedData(dataobject);


               }
           )
           .catch((error) => {
           })
   }

   setDataList(text) {
    this.setState({offSetLoader:false});
    this.setState({comment_list:[]});
    this.setState({comment_list:this.state.comment_list.concat(text)});
}


   InheritedData(data) {

       if (data.status == true) {
          //this.setState({offSetLoader:false});
          this.setDataList(data.shout_out_all.shout_out_category.high_five);
      }
  }

    async messageHighFive(data, ind) {
             const url = global.base_url_live+'v1/api/app-insert-high-five';
             const token_ = await SecureStore.getItemAsync('token');

             var parameters = {
                 token: JSON.parse(token_),
                 type: 'l',
                 uid: this.state.UID,
                 linked_feature_id: data.shout_out.id,
                 day: this.state.day,
                 week: this.state.week,
                 challenge_id:this.state.challenge_id,
                 feature_id:this.state.feature_id,
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
                         if(dataobject.status == true) {
                           this.state.comment_list[ind].shout_out.if_you_high_fived = true;
                           var count = parseInt(parseInt(this.state.comment_list[ind].shout_out.total_high_fives) + 1);
                           this.state.comment_list[ind].shout_out.total_high_fives = count;
                           this.setState({comment_list: this.state.comment_list});
                         }
                         else {
                             alert(dataobject.message);
                         }
                     }
                 )
                 .catch((error) => {
                 })
    }


   //  async getShoutReplyComments(dt, index) {
   //    // alert(JSON.stringify(dt));
   //    // return false;
   //      this.setState({offSetLoader1:true});
   //      if(dt !== undefined) {
   //        this.setState({popUpIndex: index});
   //        this.setState({linkFeatureId:dt.shout_out.id});
   //      }
   //      this.setState({UID:dt.user_details.uid});
   //      const token_  =await SecureStore.getItemAsync('token');
   //     const url = global.base_url_live+'v1/api/get-shout-reply-comments';
   //     var parameters = {
   //         token: JSON.parse(token_),
   //         challenge_id:this.state.challenge_id,
   //         uid:this.state.UID,
   //         feature_id:this.state.feature_id,
   //         linked_feature_id:dt.shout_out.id,
   //         // page_size:10,
   //         // data_offset:this.state.offSet
   //     };
   //
   //     var token = `Bearer ${JSON.parse(token_)}`;
   //
   //     fetch(url,
   //         {
   //             method: 'POST',
   //             headers: new Headers({
   //                 'Content-Type': 'application/json',
   //                 'Authorization': token,
   //             }), body: JSON.stringify(parameters),
   //         })
   //         .then(async (response) => response.text())
   //         .then(async (responseText) => {
   //                 var dataobject = JSON.parse(responseText);
   //                 this.setState({offSetLoader1:false});
   //                  this.setState({comment_reply_list:[]});
   //              this.InheritedDataComments(dataobject);
   //
   //
   //             }
   //         )
   //         .catch((error) => {
   //         })
   // }


   async getShoutReplyComments(dt, index) {
     this.setState({popUpIndex: index});
     // console.log(this.state.challengeArray);
     const {navigate} = this.props.nav;
     navigate('AddReply', {'DATA': dt,
     'feature_array': this.state.challengeArray,
     'basic_array': this.state.basicArray,
     'profile_pic': this.state.userProfilePic,
      'onGoBack': this.refresh,
     'challengeID': this.state.challenge_id,
      });
  }


   setDataListComments(text) {
    this.setState({comment_reply_list:this.state.comment_reply_list.concat(text)});
    this.setState({premiumModal: true })
   }

   InheritedDataComments(data) {

       if (data.status == true) {
          this.setDataListComments(data.shout_out_replies);
      }
  }

  onLayout(event) {
   const {x, y, height, width} = event.nativeEvent.layout;
   const newHeight = this.state.view2LayoutProps.height + 1;
   const newLayout = {
       height: newHeight ,
       width: width,
       left: x,
       top: y,
     };
   this.setState({ view2LayoutProps: newLayout });
 }

 editUpdateData (dataGet) {
   this.state.comment_list[this.state.editIndex] = dataGet;
   this.setState({comment_list: this.state.comment_list});
 }

 onflag(id, index) {
   this.setState({linkFeatureId: id});
   this.setState({flagIndex: index});
   this.flagmodalVisible();
 }

 onedit(data, index) {
   this.setState({editPost: data});
   this.setState({editIndex: index});
   this.editmodalVisible();
 }


    renderRowComment(item, rowmap){
      var dataHolderrr = item;
      const ratio = this.state.view2LayoutProps.width/dataHolderrr.shout_out.shout_image_width;
      const ViewHeight = dataHolderrr.shout_out.shout_image_height * ratio;
      const ViewWidth = this.state.view2LayoutProps.width;
     //console.log('test', item)
           return(

             <View style={{
                 marginLeft: 0,
                 marginTop: 12,
                 backgroundColor: 'tranparent',
                 paddingBottom: 5,
                 borderBottomWidth: rowmap == this.state.comment_list.length - 1 ? 0 : 0.3,
                 borderColor: 'lightgray'
             }}>
             <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'tranparent'}}>

                     <View style={{flex: 0.2, flexDirection: 'row', backgroundColor: 'tranparent'}}>
                         <Image source={{uri: dataHolderrr.user_details.profile_pic}}
                                style={{
                                    width: 50,
                                    height: 50,
                                    marginLeft: 15,
                                    borderRadius: 50 / 2
                                }}>
                         </Image>
                       </View>

                       <View style={{flex: 0.8, backgroundColor: 'tranparent'}}>

                       <View style={{backgroundColor: 'transparent', paddingRight: 10}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flex: 0.5 , backgroundColor: 'transparent'}}>
                           <Text
                               style={{marginLeft: 5,
                               fontFamily: 'PoppinsSemiBold',
                               fontSize: 12,
                               lineHeight: 20}}>{dataHolderrr.user_details.name}
                           </Text>
                        </View>
                        <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end'}}>
                           <Text style={{  marginLeft: 5,
                             fontFamily: 'PoppinsRegular',
                             lineHeight: 15,
                             fontSize: 11,
                             marginTop: 3}}>{dataHolderrr.shout_out.time}
                           </Text>
                        </View>
                        </View>
                           <Text style={styles.appreciation_desc}
                                 numberOfLines={2}>{dataHolderrr.shout_out.comment}
                           </Text>
                       </View>


                       </View>

             </View>

             <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4, backgroundColor: 'transparent'}}>
               <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                 {dataHolderrr.shout_out.shout_image !== '' &&

                         <View onLayout={(event) => this.onLayout(event)} style={{marginTop: 5, backgroundColor: 'transparent', justifyContent: 'flex-start', marginLeft: 0, alignSelf: 'stretch'}}>
                         <TouchableOpacity onPress={() => {if(this.state.featureType == 0) {
                           this.getShoutReplyComments(dataHolderrr, rowmap)
                         }
                         else {
                           this.premium1();
                         }}}>
                           <Image source={{uri:dataHolderrr.shout_out.shout_image}} style={{height: ViewHeight, width:ViewWidth, borderRadius: 4}}/>
                        </TouchableOpacity>
                         </View>
                 }
                 </View>
             </View>

             <View style={{flex: 1, flexDirection: 'row', paddingBottom: 15, marginTop: 10, backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 15}}>
               <View style={{flex: 0.44, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center'}}>

               { dataHolderrr.shout_out.if_you_high_fived &&
                 <View style={{backgroundColor: '#7BD1FD', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High Five</Text></View>
               }
               {!dataHolderrr.shout_out.if_you_high_fived &&
               <TouchableOpacity onPress={() => {if(this.state.featureType == 0) {
                 this.messageHighFive(item, rowmap);
               }
               else {
                 this.premium1();
               }}}
               >
                 <View style={{backgroundColor: '#626E77', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High Five</Text></View>
               </TouchableOpacity>
               }
                   <View style={{backgroundColor: 'transparent', marginLeft: 6}}>
                   <ImageBackground source={boxIcon} resizeMode='contain' style={{width: 70, height: 30}}>
                   <View style={{flexDirection: 'row', flex: 1}}>
                         <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 10}}>
                         {dataHolderrr.shout_out.if_you_high_fived &&
                             <Image source={handsBlue} style={{height: 15, width: 15}}>
                             </Image>
                         }
                         {!dataHolderrr.shout_out.if_you_high_fived &&
                             <Image source={handsBlack} style={{height: 15, width: 15}}>
                             </Image>
                         }
                         </View>

                         <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end', marginRight: 8}}>
                          {dataHolderrr.shout_out.if_you_high_fived &&
                             <Text style={{color:'#7BD1FD',
                                 fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                             }}>{dataHolderrr.shout_out.total_high_fives}</Text>
                          }
                          {!dataHolderrr.shout_out.if_you_high_fived &&
                             <Text style={{color:'gray',
                                 fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                             }}>{dataHolderrr.shout_out.total_high_fives}</Text>
                          }
                         </View>
                   </View>
                   </ImageBackground>
                   </View>
               </View>

               <View style={{flex: 0.46, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center'}}>
               <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => {if(this.state.featureType == 0) {
                 this.getShoutReplyComments(dataHolderrr, rowmap)
               }
               else {
                 this.premium1();
               }}}>
               <Image source={comments1} style={{width: 15, height: 15}}>
               </Image>
               <Text style={{color:'gray',
                   fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
               }}>Comments ({dataHolderrr.shout_out.total_replies})</Text>
               </TouchableOpacity>
               </View>
                <View style={{flex: 0.10, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center'}}>
                {(this.state.UID == dataHolderrr.user_details.uid || !dataHolderrr.shout_out.if_you_flagged) &&
                  <Menu>
                    <MenuTrigger>
                    {this.state.featureType == 0 &&
                      <View style={{backgroundColor: 'transparent', paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10}}>
                        <Image source={dagger} style={{width: 6, height: 22}}>
                        </Image>
                      </View>
                    }
                    {this.state.featureType !== 0 &&
                      <TouchableOpacity onPress={() => this.premium1()}>
                          <View style={{backgroundColor: 'transparent', paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10}}>
                            <Image source={dagger} style={{width: 6, height: 21}}>
                            </Image>
                          </View>
                      </TouchableOpacity>
                    }

                    </MenuTrigger>
                    <MenuOptions>
                    {this.state.UID == dataHolderrr.user_details.uid &&
                      <MenuOption onSelect={() => this.onedit(dataHolderrr, rowmap)}>
                        <View style={{paddingTop: 8, backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, flexDirection: 'row'}}>
                        <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                        <Image source={editblack} style={{height: 12, width: 10, marginTop: 0}}/>
                        </View>
                      </MenuOption>
                    }

                      {(!dataHolderrr.shout_out.if_you_flagged && this.state.UID !== dataHolderrr.user_details.uid) &&
                        <MenuOption onSelect={() => this.onflag(dataHolderrr.shout_out.id, rowmap)}>
                            <View style={{paddingTop: 8,  backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'PoppinsMedium'}}>Flag</Text>
                            <Image source={flagblack} style={{height: 12, width: 10, marginTop: 0}}/>
                            </View>
                        </MenuOption>
                      }
                    </MenuOptions>
                  </Menu>
                }
               </View>

             </View>


             {/*
                 <View style={{
                    backgroundColor: 'transparent',
                     marginTop: 8,
                     borderTopWidth: 0.2,
                     borderColor: 'lightgray',
                     flexDirection: 'row',
                     paddingVertical: 6,
                     flex: 1,
                 }}>

                 <View style={{flex: 0.33}}>
                 { dataHolderrr.shout_out.if_you_high_fived &&
                     <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                           <Image source={like} style={{width: 20, height: 20}}>
                           </Image>
                           <Text style={{color:'#1577FD',
                               fontSize: 11, marginLeft: 5, fontFamily: 'PoppinsMedium',
                           }}>High-Five</Text>
                       </View>
                 }
                 {!dataHolderrr.shout_out.if_you_high_fived &&
                   <TouchableOpacity onPress={() => this.messageHighFive(item, index)}>
                       <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                           <Image source={unlike} style={{width: 20, height: 20}}>
                           </Image>
                           <Text style={{color:'gray',
                               fontSize: 11, marginLeft: 5, fontFamily: 'PoppinsMedium',
                           }}>High-Five</Text>
                           </View>
                     </TouchableOpacity>
                 }
                 </View>


             <View style={{flex: 0.33, alignItems: 'center'}}>
             {/*<TouchableOpacity onPress={() => this.messageDetails(dataHolder)}>
             <TouchableOpacity onPress={() => this.getShoutReplyComments(dataHolderrr, rowmap)}>

                 <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                     <Image source={comments}
                            style={{width: 20, height: 20 }}>
                     </Image>
                     <Text
                         style={{color:'gray', marginLeft: 5, fontSize: 11, fontFamily: 'PoppinsMedium'}}>Comment</Text>
                  </View>
               </TouchableOpacity>
             </View>

             <View style={{alignItems: 'center', flex: 0.33}}>
                 <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                   <Image source={flags}
                        style={{width: 20, height: 20}}>
                   </Image>
                   <Text
                   style={{color:'gray', marginLeft: 5, fontSize: 11, fontFamily: 'PoppinsMedium'}}>Flag</Text>
                 </View>
               </View>


                 </View>*/}

             </View>
         )

   }

 refresh=(data)=> {
   if(data.from_page == 'PostComments') {
          this.getShoutOutApiData();
          this.props._handeleDayChange();
   }
   else{
     var Index = this.state.popUpIndex;
     this.state.comment_list[Index].shout_out.total_replies = data.comment_count;
     this.state.comment_list[Index].shout_out.total_high_fives = data.high_five_count;
     this.state.comment_list[Index].shout_out.if_you_high_fived = data.high_five_status;
     this.setState({comment_list: this.state.comment_list});
   }
 }

 handeLoadMoreItem = () =>{
   if(this.state.itemCount !== 0) {
     this.setState({scrollDown: true});
     var offset = this.state.offSet;
     var addoffset = parseInt(offset+5);
     this.setState({offSet:addoffset});
     this.getShoutOutApiData()
  }
 }

 updatePrevious() {
   this.state.comment_list[this.state.popUpIndex].shout_out.total_replies = this.state.comment_reply_list.length;
   this.setState({comment_list: this.state.comment_list});
   this.setState({premiumModal: !this.state.premiumModal})
 }


 renderRowCommentReply(dataHolder,rowmap,index){
 // console.log(dataHolder)
        return(

            <View style={{marginRight: 0, marginBottom: 0,
                flexDirection: 'row',
                marginTop:0,
                backgroundColor:'white',
                borderBottomWidth: 0.3,
                borderBottomColor: '#CACACA',
                paddingLeft:15,
                paddingRight:15,
                paddingVertical: 10,
            }}>




                <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row',alignItems:'flex-start'}}>
                    <Image source={{uri:dataHolder.item.user_details.profile_pic}} style={{height:50, width:50, marginLeft:6, borderRadius:50/2}}/>
                    <View style={{backgroundColor:"transparent",flex:1, marginLeft:12,marginRight:10,padding:1}}>

                        <View style={{backgroundColor:'transparent',alignItems:"center",flexDirection:'row',justifyContent:'space-between'}}>
                                    <Text style={{fontFamily:'PoppinsBold'}} >{dataHolder.item.user_details.name}</Text>
                            <Text style={{fontFamily:'PoppinsRegular',color:'gray',fontSize:10}} >{dataHolder.item.shout_out.time}</Text>
                        </View>
                        <View style={{flex:1,height:'100%',backgroundColor:'transparent',padding:3}}>
                                    <Text  style={{fontSize:12,fontFamily:'PoppinsSemiBold',color:'gray',marginTop:-3}} numberOfLines={3}>{dataHolder.item.shout_out.comment}</Text>
                        </View>

                    </View>

                </View>

            </View>
      )

}


async replyMessage() {

  this.setState({offSetLoader1:true});
  if (this.state.commentText != '') {
      const token_ = await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/app-insert-high-five';
      const formData = new FormData();

      formData.append('token', JSON.parse(token_));
      formData.append('type', 'r');
      formData.append('feature_value', this.state.commentText);
      formData.append('uid', this.state.UID);
      formData.append('day', this.state.day);
      formData.append('week', this.state.week);
      formData.append('challenge_id', this.state.challenge_id);
      formData.append('linked_feature_id', this.state.linkFeatureId);
      formData.append('feature_id', this.state.feature_id);

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
                  var dataobject = JSON.parse(responseText);
                  console.log('Statsu', dataobject);
                  if(dataobject.status == true) {
                    this.state.comment_reply_list.unshift(dataobject.high_five);
                    this.setState({offSetLoader1:false});
                    this.textInputComment.clear();
                    this.setState({commentText:''});


                  }
                  else {
                    alert(dataobject.message);
                    this.setState({offSetLoader1:false});
                  }

              }
          )
          .catch((error) => {
          })


  } else {
      this.setState({offSetLoader1:false});
      alert('Please add Comment.')
  }
}


footerComponent = () =>{
    // const data = this.state.offSetLoader;

    if(this.state.offSetLoader1){
        return(
            <Loader loaderVal = {this.state.offSetLoader1} />
        )
    }
    return (<View style={{height:10}}></View>);

}

async submitFlag() {
  var flagcmtIndex = this.state.flagIndex;
    if(this.state.spamVal == null)  {
      alert('Please select reason.');
      return false;
    }
    else if (this.state.reportcommentText == '') {
      alert('Please add comment.');
      return false;
    }
    else{
      this.setState({offSetLoader1:true});
          const token_ = await SecureStore.getItemAsync('token');
          const url = global.base_url_live+'v1/api/app-insert-high-five';
          const formData = new FormData();

          formData.append('token', JSON.parse(token_));
          formData.append('type', 'f');
          formData.append('challenge_id', this.state.challenge_id);
          formData.append('uid', this.state.UID);
          formData.append('day', this.state.day);
          formData.append('week', this.state.week);
          formData.append('feature_value', this.state.reportcommentText);
          formData.append('linked_feature_id', this.state.linkFeatureId);
          formData.append('flag_drop', this.state.spamVal);

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
                      var dataobject = JSON.parse(responseText);
                      if(dataobject.status == true) {
                        this.setState({offSetLoader1:false});
                        this.setState({spamVal: null});
                        this.setState({reportcommentText: ''});
                        this.state.comment_list[flagcmtIndex].shout_out.if_you_flagged = true;
                        this.setState({comment_list: this.state.comment_list});
                        this.flagmodalVisible();
                        alert('Report submitted successfully.');
                      }
                      else {
                        alert(dataobject.message);
                        this.setState({offSetLoader1:false});
                      }

                  }
              )
              .catch((error) => {
              })
    }

}


    render() {
      const placeholder = {
      label: 'Select Reason...',
      value: null,
      color: '#000',
    };
      var dataholder = this.state.challengeArray;
      //dataholder.shout_out_category.high_five = [];
      const {navigate} = this.props.nav;
      var chlObject = {'challenge_id':this.state.challenge_id, 'week': this.state.week, 'day': this.state.day};
        return (
          <View style={styles.appreciatio_view}>
          {this.state.offSetLoader1 &&
            <Loader loaderVal = {this.state.offSetLoader1} />
          }

          <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
          hasBackdrop = {true} isVisible={this.state.flagModal} >
          <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
            <View style={{padding: 0}}>
                  <TouchableOpacity onPress={this.flagmodalVisible}>
                    <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                      <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                    </View>
                  </TouchableOpacity>
                  <Text style={{fontFamily: 'PoppinsRegular', fontSize: 17, textAlign: 'center', borderBottomWidth: 1, borderBottomColor:'lightgray', paddingBottom: 7}}>REPORT COMMENT</Text>
                  <ScrollView>
                  <View style={{padding: 15}}>
                    <Text style={{fontFamily: 'PoppinsSemiBold'}}>Why do you wan't to flag this comment ?</Text>
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
                                  { label: 'Inappropriate language', value: 0 },
                                  { label: 'Inappropriate Image', value: 1 },
                                  { label: 'Spam', value: 2 },
                                  { label: 'Bullying', value: 3 },
                                  { label: 'Other', value: 4 },
                              ]}
                          />
                  </View>

                  <View style={{paddingHorizontal: 15}}>
                    <View style={{flexDirection: 'row',
                    alignItems: 'flex-start',
                    width: '100%',
                    marginHorizontal: 0,
                    backgroundColor: 'white',
                    borderColor: 'lightgray',
                    borderWidth: 1,
                    marginTop: 8}}>
                        <TextInput
                            multiline={true}
                            numberOfLines={8}
                            placeholder="Report the comment"
                            value={this.state.reportcommentText}
                            onChangeText={(text) => this.setState({reportcommentText: text})}
                            style={{width: '100%', height: 120, textAlignVertical: "top", paddingHorizontal: 5, marginTop: 12}}
                        >
                        </TextInput>
                    </View>
                  </View>

                  <View style={{marginTop: 20, backgroundColor: 'tranparent', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity
                          style={{alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#4AAFE3',
                          borderWidth: 1, paddingVertical: 8,
                          borderColor: 'lightgray', marginHorizontal: 0,
                          borderRadius: 25, marginBottom: 0, marginTop: 0}}
                          onPress={() =>
                              this.submitFlag()}
                      >
                          <Text
                              style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold', paddingVertical: 0, paddingHorizontal: 35}}>
                              Comment</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              </ScrollView>
            </View>
          </View>
          </Modal>


          <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
          hasBackdrop = {true} isVisible={this.state.editModal} >
          <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
            <View style={{padding: 0}}>
                  <TouchableOpacity onPress={this.editmodalVisible}>
                    <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                      <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                    </View>
                  </TouchableOpacity>
                  <Text style={{fontFamily: 'PoppinsRegular', fontSize: 17, textAlign: 'center', borderBottomWidth: 1, borderBottomColor:'lightgray', paddingBottom: 7}}>Edit COMMENT</Text>
                  <ScrollView>
                    <ModalUpdateShoutOut
                    updateContent= {this.state.editPost}
                    challengeId = {this.state.challenge_id}
                    onGoBack={this.editUpdateData}
                    onPopUp={this.editmodalVisible}
                    nav = {this.props.nav}/>
                  </ScrollView>
            </View>
          </View>
          </Modal>


          <Modal style={{marginLeft: 10, marginRight: 10, marginBottom: 0, marginTop: StatusBar.currentHeight}} transparent={true} deviceWidth={deviceWidth}
          deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal1} >
          <View style={{flex: 1, height:'100%' , width: '100%', backgroundColor: '#fff', padding: 0, margin: 0}}>
          <ImageBackground resizeMode= 'contain' source={backg} style={{flex: 1, height: '100%', width: '100%'}}>
            <View style={{padding: 0}}>
                  <TouchableOpacity onPress={this.premium1}>
                    <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                      <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                    </View>
                  </TouchableOpacity>

                  <ModalPremium
                      closeModal={this.premium1}
                      nav={this.props.nav}/>
            </View>
           </ImageBackground>
          </View>
          </Modal>

          <Modal style={{marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: StatusBar.currentHeight}} transparent={true} deviceWidth={deviceWidth}
        deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal} >

              <View style={{flex: 1, height:'100%' , width: '100%', backgroundColor: '#fff', padding: 0, margin: 0}}>
                <View style={{padding: 0, flex: 1}}>
                      <TouchableOpacity onPress={() => this.updatePrevious()}>
                        <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                          <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                        </View>
                      </TouchableOpacity>


                      {!this.state.offSetLoader &&
                      <View style={{zIndex: 99,  height: 50, backgroundColor: 'transparent',  bottom: 0, marginHorizontal: 10, marginBottom: 5}}>
                                    <KeyboardAvoidingView style={{position: 'absolute', left: 0, right: 0, top: 15}} behavior="position">
                                    <View style={{flexDirection: 'row', flex: 1}}>
                                    <View style={{flex: 0.8}}>
                                              <TextInput
                                                  style={{paddingHorizontal: 5, backgroundColor: 'transparent', borderColor: '#919191', borderWidth: 1, width: '100%',height: 40,color: '#000'}}
                                                  placeholder="Enter comment"
                                                  placeholderTextColor="grey"
                                                  ref={input => { this.textInputComment = input }}
                                                  onChangeText={text => this.setState({ commentText: text })}
                                                  underlineColorAndroid='transparent'
                                                />
                                              </View>
                                              <View style={{flex: 0.02}}>
                                              </View>
                                              <View style={{flex: 0.18}}>
                                                <TouchableOpacity onPress={() => this.replyMessage()}>
                                                    <View style={{height: 40, backgroundColor:'black', borderRadius:4, justifyContent: 'center'}}>
                                                      <Text style={{fontFamily:'PoppinsBold',fontSize:11,color:'white', textAlign: 'center'}}>SEND</Text>
                                                    </View>
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                         </KeyboardAvoidingView>
                        </View>
                      }

                      {this.state.comment_reply_list.length !== 0 &&
                        <FlatList
                             keyboardShouldPersistTaps={'handled'}
                             contentContainerStyle={{ flexGrow: 1 }}
                             style={{backgroundColor: 'transparent',  marginTop: 20,backgroundColor:'transparent',paddingHorizontal:0}}
                             data={this.state.comment_reply_list}
                             renderItem={(data, rowMap) => this.renderRowCommentReply(data, rowMap)}
                             keyExtractor={(data, rowMap) => rowMap.toString()}
                             //onEndReached={this.handeLoadMoreItem}
                             //onEndReachedThreshold={0}
                             ListFooterComponent={this.footerComponent}
                         />
                       }

                       {(this.state.comment_reply_list.length == 0 && !this.state.offSetLoader) &&
                         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                             <Text style={{fontFamily: 'PoppinsLight'}}>no comments available.</Text>
                         </View>
                       }

                </View>
              </View>

      </Modal>

              <View>
                  <TouchableOpacity onPress={() => {
                    if(this.state.featureType == 0) {
                      navigate('PostComments',{DATA:dataholder, challenge_details:chlObject, profile_pic: this.state.userProfilePic, basic_array: this.state.basicArray, onGoBack: this.refresh})
                    }
                    else {
                      this.premium1();
                    }
                  }}
                  >
                  <View style={{
                      flexDirection: 'row',
                      paddingHorizontal: 15,
                      alignItems: 'center',
                      marginTop: 15
                  }}>
                  {this.state.todayCount == 0 &&
                    <View style={{flexDirection: 'row'}}>
                    <Image source={checkgray}
                           style={{width: 18, height: 18, marginLeft: 0, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkgray}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkgray}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    </View>
                  }
                  {this.state.todayCount == 1 &&
                    <View style={{flexDirection: 'row'}}>
                    <Image source={checkyellow}
                           style={{width: 18, height: 18, marginLeft: 0, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkgray}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkgray}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    </View>
                  }
                  {this.state.todayCount == 2 &&
                    <View style={{flexDirection: 'row'}}>
                    <Image source={checkyellow}
                           style={{width: 18, height: 18, marginLeft: 0, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkyellow}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkgray}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    </View>
                  }
                  {this.state.todayCount >= 3 &&
                    <View style={{flexDirection: 'row'}}>
                    <Image source={checkyellow}
                           style={{width: 18, height: 18, marginLeft: 0, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkyellow}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    <Image source={checkyellow}
                           style={{width: 18, height: 18, marginLeft: 3, alignItems: 'center'}}>
                    </Image>
                    </View>
                  }

                      <Text style={{
                          fontSize: 13,
                          color: '#4AAFE3',
                          marginLeft: 4,
                          marginTop: 2,
                          fontFamily: 'PoppinsBold',
                          alignItems: 'center'
                      }}> {dataholder.feature_name.toUpperCase()}</Text>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {this.state.featureType == 1 &&
                          <Image source={unlockgray}
                             style={{width: 35, height: 35, marginRight: 0, marginTop: 8}}>
                          </Image>
                      }
                      {this.state.featureType == 0 &&
                          <Image source={nextarrow}
                                 style={{width: 12, height: 20, marginRight: 0, marginTop: 8}}>
                          </Image>
                      }
                      </View>
                    </View>
                      {/* <Image source={nextarrow} style={{width: 9, height: 16, marginRight: 5,justifyContent:'flex-end'}}>
              </Image>*/}




                  <Text style={{
                      fontFamily: 'PoppinsBold',
                      fontSize: 13,
                      marginLeft: 15,
                      marginTop: 2,
                  }}>{this.state.title} </Text>
                  <Text style={{
                      marginLeft: 12,
                      marginTop: 5,
                      color: '#000',
                      fontFamily: 'PoppinsBold',
                      fontSize: 12
                  }}> {dataholder.points + " Points"} </Text>
                  <View style={{
                      height: 0.5,
                      backgroundColor: 'lightgray',
                      alignItems: 'flex-end',
                      marginTop: 10,
                      marginBottom: 5,
                  }}>
                  </View>
                  </TouchableOpacity>

                  {this.state.offSetLoader &&
                      <View style={{backgroundColor: 'transparent', zIndex: 99, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                          <ActivityIndicator size="large"/>
                      </View>
                  }
                  <View style={{height: 32, alignItems: 'center', justifyContent: 'center', marginTop: -15}}>
                  </View>

                  {this.state.comment_list.length == 0 &&
                    <TouchableOpacity onPress={() => {
                      if(this.state.featureType == 1) {
                        this.premium1();
                      }
                    }}
                    >
                      <View style={{height: 350, justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'PoppinsLight', textAlign: 'center'}}>no shout out available now.</Text>
                      </View>
                    </TouchableOpacity>
                  }

                  {/* Started Appericiation List */}
                  {this.state.comment_list.length !== 0 &&

                    <View style={{height: 350, backgroundColor: 'transparent'}}>
                    {this.state.featureType == 1 &&
                        <TouchableOpacity onPress={() => this.premium1()}>
                            <FlatList nestedScrollEnabled={true} showsVerticalScrollIndicator={true} horizontal={false} style={{marginTop: -20}}
                                      data={this.state.comment_list}
                                      //keyExtractor={(data, rowMap) => rowMap.toString()}
                                      renderItem={({item, index}) => this.renderRowComment(item, index)}
                                      keyExtractor={(item, index) => index.toString()}
                                      // onEndReachedThreshold={0.2}
                                      // onEndReached={this.handeLoadMoreItem}
                                      />
                        </TouchableOpacity>
                    }
                    {this.state.featureType == 0 &&
                        <FlatList nestedScrollEnabled={true} showsVerticalScrollIndicator={true} horizontal={false} style={{marginTop: -20}}
                                  data={this.state.comment_list}
                                  //keyExtractor={(data, rowMap) => rowMap.toString()}
                                  renderItem={({item, index}) => this.renderRowComment(item, index)}
                                  keyExtractor={(item, index) => index.toString()}
                                  // onEndReachedThreshold={0.2}
                                  // onEndReached={this.handeLoadMoreItem}
                                  />
                    }

                    </View>

                  }
{/* Ended Apperication List */}



              </View>
          </View>

        );
    }


    async logOutWithToken() {

        this.setState({showloader: true});

        const url_logout = global.base_url_live+'v1/api/app-logout';

        //alert(JSON.parse(this.state.token))
        // return
        var token = await SecureStore.getItemAsync('token');

        var parameters = {
            token: JSON.parse(token)
        };

        var token1 = `Bearer ${JSON.parse(token)}`;
        fetch(url_logout,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token1,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);

                    if (dataobject.status == 1) {
                        this.setState({email: ''});
                        this.setState({password: ''});
                        this.setState({showloader: false});
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(false));
                        //await SecureStore.deleteItemAsync('FACEBOOKPROFILE')
                        await AsyncStorage.removeItem('FACEBOOKPROFILE');
                        this.props.navigation.navigate('Login');
                    } else {
                        Alert.alert('injoy', JSON.stringify(dataobject), [{
                            text: 'Ok',
                            onPress: () => this.setState({showloader: false})
                        }])
                    }


                }
            )
            .catch((error) => {
                //Remove textfield data
                this.setState({email: ''});
                this.setState({password: ''});
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}]);


                console.log("Exception on login time is ===", error)
                // alert(error);
            })
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
        backgroundColor: 'red'
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
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#4AAFE3',
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
        marginLeft: 0,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 12,
        lineHeight: 20
    },

    appreciation_desc: {
        marginLeft: 5,
        fontFamily: 'PoppinsRegular',
        lineHeight: 15,
        fontSize: 11,
        marginTop: 3

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
        marginBottom: 15, marginTop: 15,
        height: 245
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
        width: 250,
        height: 145,
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
