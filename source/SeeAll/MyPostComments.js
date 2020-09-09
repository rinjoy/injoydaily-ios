import React, {Component, useReducer} from 'react';
import {Alert, FlatList, Image, ImageBackground, StyleSheet,StatusBar,
    Text, TouchableOpacity,ActivityIndicator, Keyboard, KeyboardAvoidingView, TextInput,Dimensions, View, ScrollView,

 Animated} from 'react-native';
 import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import Loader from './../loader/Loader';
import ActionSheet from 'react-native-actionsheet';
import * as Permissions from 'expo-permissions';
import ModalPremium from './../modals/ModalPremium';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import RNPickerSelect from 'react-native-picker-select';
//import { RadioButton } from 'react-native-paper';
import ModalUpdateShoutOut from './../modals/ModalUpdateShoutOut';
const editblack = require('./../../assets/editblack.png');
const flagblack = require('./../../assets/flagblack.png');
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
//const gallaryblack = require('../../assets/gallaryblack.png');
const gallaryblack = require('../../images/cameraclick.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');
const profile = require('../../images/image-9.png');
const dagger = require('../../images/dager.png');
const unlike = require('../../images/2.png');
const like = require('../../images/3.png');
const flags = require('../../images/1.png');
const comments = require('../../images/4.png');
const commentblue = require('../../images/commentblue.png');
const messageopenblack = require('../../assets/messageopenblack.png');
import Modal from 'react-native-modal';
const image12 = require('../../images/image-12.png');
const userImage = require('../../images/image-11.png');
const image14 = require('../../images/image-14.png');
const image16 = require('../../images/image-16.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');
const backg = require('./../../images/bg_popup.png');
const crossarrow = require('./../../images/close.png');
const unlock = require('./../../images/unlock.png');
const star = require('./../../images/star.png');
const boxIcon = require('./../../images/high-five-bar.png');
const handsBlack = require('./../../images/hand-blck.png');
const handsBlue = require('./../../images/hand-blue.png');
const whitecheck = require('../../images/checkboxBlack.png');
const cameraClick = require('../../images/cameraclick.png');
const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');
import { SwipeListView } from 'react-native-swipe-list-view';
import Toast from "react-native-easy-toast";
import Emoji from "react-native-emoji";
const comments1 = require('../../images/comments.png');
const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const getUserDetails = async () => {
    return await SecureStore.getItemAsync('UserDetails');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;

export default class MyPostComments extends Component {

  showActionSheet = () => {
      //To show the Bottom ActionSheet
      this.ActionSheet.show();
  };

    constructor(props) {
       // alert('in')
        super(props);
        this.state = {
            data_list: [].fill('')
            .map((_, i) => ({key: `${i}`, text: `item #${i}`}))
            ,
            comment_list: [].fill('')
            .map((_, i) => ({key: `${i}`, text: `item #${i}`}))
            ,

            checked:true,

            listViewData: Array(2)
                .fill('')
                .map((_, i) => ({key: `${i}`, text: `item #${i}`})),

                accessToken:'',
                setImageHeight: 0,
                setImageWidth: 0,
                chDetails: this.props.navigation.state.params.challenge_details,
                challengeId:this.props.navigation.state.params.challenge_details.challenge_id,
                day: this.props.navigation.state.params.challenge_details.day,
                week: this.props.navigation.state.params.challenge_details.week,
                basicArray: this.props.navigation.state.params.basic_array,
                radioImageFirst :false,
                radioSecondbutton:false,
                radioThirdbutton:false,
                popUpIndex: 0,
                todayCount: 0,
                premiumModal1: false,
                profilePic: this.props.navigation.state.params.profile_pic,
                isDialogVisible: false,
                reportcommentText: '',
                commentText: '',
                editIndex: '',
                editPost: {},
                commentText1: '',
                linkFeatureId: 0,
                imageUrl: null,
                premiumModal: false,
                itemCount: 0,
                flagModal: false,
                editModal: false,
                featureId:2,
                spamVal: null,
                linkFeatureId: 0,
                flagIndex: '',
                offSet:0,offSetLoader:false,
                offSetLoader1:false,
                Alldata:this.props.navigation.state.params.DATA,
                imagetype:null,
                name:null,

        }
        this.premium = this.premium.bind(this);
        this.premium1 = this.premium1.bind(this);
        this.imageHeightGet = 0;
        this.renderRow = this.renderRow.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.messageDetails = this.messageDetails.bind(this);
        this.flagmodalVisible = this.flagmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
        this.getShoutReplyComments = this.getShoutReplyComments.bind(this);
        this.rowSwipeAnimatedValues = {};
        Array(20)
            .fill('')
            .forEach((_, i) => {
                this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
            });
    }

    editUpdateData (dataGet) {
      this.state.data_list[this.state.editIndex] = dataGet;
      this.setState({data_list: this.state.data_list});
    }


    componentDidMount() {
      console.log('basicArray', this.state.basicArray);
        getAccessToken().then(token =>
            this.setState({accessToken:token}),
        );
        getUserId().then(id =>
            this.setState({id: id}),
        );
        //alert(this.state.profilePic);
        this.getDataObject();

    }

    premium1() {
      this.setState({premiumModal1: !this.state.premiumModal1})
    }

componentWillReceiveProps(nextProps) {
  if(nextProps.navigation.state.params.DATA !== undefined) {
    this.setState({offSetLoader1:true});
     this.setState({data_list:[]});
     this.setState({offSet:0});
    this.getDataObject();
  }

  if(nextProps.navigation.state.params.comment_count !== undefined) {

  }

  if(nextProps.navigation.state.params.CAPTUREDIMAGE !== undefined) {
  const uri    =  nextProps.navigation.state.params.CAPTUREDIMAGE;
  let filename = uri.split('/').pop();
  let match = /\.(\w+)$/.exec(filename);
  let fileType = match ? `image/${match[1]}` : `image`;
  this.setState({ imageUrl: uri , imagetype: fileType, name:`.${filename}`});
  }
}

premium() {
  this.setState({premiumModal: !this.state.premiumModal})
    //alert('Here');
}




    getDataObject(){


    setTimeout(()=>{

        if (this.state.challengeId != undefined){

            this.getDailyInspirationApiData();
        }

    },1000);
    }



    async getDailyInspirationApiData() {

this.setState({offSetLoader1:true});
        const token_  =await SecureStore.getItemAsync('token');
       const url = global.base_url_live+'v1/api/get-user-shouts';
 // alert(token_)
       var parameters = {
           token: JSON.parse(token_),
           challenge_id:this.state.challengeId,
           feature_id:2,
           uid: this.state.id,
           page_size:6,
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
                    //console.log('FULL Data', dataobject);
                   this.setState({offSetLoader1:false});
                   this.setState({itemCount: dataobject.count_records});
                   this.setState({todayCount: dataobject.user_today_actions});
                   if(dataobject.count_records == 0){
                      this.setState({offSetLoader1:false});
                  }
                this.InheritedData(dataobject);
               }
           )
           .catch((error) => {
           })
   }

  //  async getShoutReplyComments(dt, index) {
  //
  //      this.setState({offSetLoader1:true});
  //      if(dt !== undefined) {
  //        this.setState({popUpIndex: index});
  //        this.setState({linkFeatureId:dt.shout_out.id});
  //      }
  //      const token_  =await SecureStore.getItemAsync('token');
  //     const url = global.base_url_live+'v1/api/get-shout-reply-comments';
  //
  //     var parameters = {
  //         token: JSON.parse(token_),
  //         challenge_id:this.state.challengeId,
  //         uid:this.state.id,
  //         feature_id:this.state.featureId,
  //         linked_feature_id:this.state.linkFeatureId,
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
  //                  this.setState({comment_list:[]});
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
    const {navigate} = this.props.navigation;
    navigate('AddReply', {'DATA': dt,
    'feature_array': this.state.Alldata,
    'basic_array': this.state.basicArray,
    'profile_pic': this.state.profilePic,
    'onGoBack': this.refresh,
    'challengeID': this.state.challengeId,
     });
 }

 refresh=(data)=> {
   var Index = this.state.popUpIndex;
   this.state.data_list[Index].shout_out.total_replies = data.comment_count;
   this.state.data_list[Index].shout_out.total_high_fives = data.high_five_count;
   this.state.data_list[Index].shout_out.if_you_high_fived = data.high_five_status;
   this.setState({data_list: this.state.data_list});
}

  setDataListComments(text) {
   this.setState({comment_list:this.state.comment_list.concat(text)});
   this.setState({premiumModal: true })
  }

  InheritedDataComments(data) {
      if (data.status == true) {
         this.setDataListComments(data.shout_out_replies);
     }
 }


   setDataList(text) {
    this.setState({data_list:this.state.data_list.concat(text)});
}


  InheritedData(data) {
        if (data.status == true) {
            this.setDataList(data.shout_out_all.shout_out_category.high_five);
            this.checkItOut(data.user_today_actions);
        }
    }

    checkItOut(data){
        if (data == "0"){
        }else if(data == "1"){
           this.setState({radioImageFirst:true})
        }else if (data == "2"){
            this.setState({radioImageFirst:true,radioSecondbutton:true});
        }else if (data =="3"){
            this.setState({radioImageFirst:true,radioSecondbutton:true,radioThirdbutton:true}) ;
        }
    }

  handeLoadMoreItem = () =>{
    if(this.state.itemCount !== 0) {
    var offset = this.state.offSet;
    var addoffset = parseInt(offset+6);
    this.setState({offSet:addoffset});
    this.getDailyInspirationApiData()
  }
}

    footerComponent = () =>{
        // const data = this.state.offSetLoader;

        if(this.state.offSetLoader1){
            return(
              <View style={{height:10}}></View>
            )
        }
        return (<View style={{height:10}}></View>);



    }


   renderHiddenItems(data ,rowMap){
       <View style={styles.rowBack}>
           <TouchableOpacity
               style={[
                   styles.backRightBtn,
                   styles.backRightBtnRight,
               ]}
               onPress={() =>
                   this.deleteRow(rowMap, data.item.key)
               }
           >
               <Animated.View
                   style={[
                       styles.trash,
                       {
                           transform: [
                               {
                                   scale: this.rowSwipeAnimatedValues[
                                       data.item.key
                                       ].interpolate({
                                       inputRange: [
                                           45,
                                           90,
                                       ],
                                       outputRange: [0, 1],
                                       extrapolate:
                                           'clamp',
                                   }),
                               },
                           ],
                       },
                   ]}
               >
                   <Image
                       source={hands}
                       style={styles.trash}
                   />
               </Animated.View>
           </TouchableOpacity>
       </View>
   }

   messageDetails(data) {
     this.props.navigation.navigate('AddReply', {'DATA': data, 'featureID': this.state.featureId, 'challengeID': this.state.challengeId});
   }

   onflag(id, index) {
     this.setState({linkFeatureId: id});
     this.setState({flagIndex: index});
     this.flagmodalVisible();
   }
   flagmodalVisible() {
     this.setState({flagModal: !this.state.flagModal})
   }

   async messageHighFive(data,ind) {
             const token_  =await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/app-insert-high-five';
      // alert(token_)
            var parameters = {
                token: JSON.parse(token_),
                type: 'l',
                uid: this.state.id,
                day: this.state.day,
                week: this.state.week,
                linked_feature_id: data.shout_out.id,
                challenge_id: this.state.challengeId,
                feature_id: this.state.featureId,
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
                        if(dataobject.status == true) {
                          this.state.data_list[ind].shout_out.if_you_high_fived = true;
                          var count = parseInt(parseInt(this.state.data_list[ind].shout_out.total_high_fives) + 1);
                          this.state.data_list[ind].shout_out.total_high_fives = count;
                          this.setState({data_list: this.state.data_list});
                            this.refs.toast.show(
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'white',fontSize:12}}>Yes!  </Text>
                                    <Emoji name="clap" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                    />

                                </View>)
                        }
                        else {
                            alert(dataobject.message);
                        }
                    }
                )
                .catch((error) => {
                })
   }

   onedit(data, index) {
     this.setState({editPost: data});
     this.setState({editIndex: index});
     this.editmodalVisible();
   }

   editmodalVisible() {
     this.setState({editModal: !this.state.editModal})
   }

     renderRow(dataHolder, rowmap){
        const ratio = deviceWidth/dataHolder.shout_out.shout_image_width;
        const height = dataHolder.shout_out.shout_image_height * ratio;

            return(
                <View style={{
                    flexDirection: 'row',
                    marginTop:13,
                    backgroundColor:'white',
                    borderBottomWidth: 0.3,
                    borderBottomColor: '#D4D4D6',
                    paddingHorizontal:0,
                    paddingTop:10,
                }}>




                    <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row',alignItems:'flex-start'}}>
                        <View style={{backgroundColor:"transparent",flex:1,  marginTop:0,padding:0}}>
                        <View style={{paddingHorizontal: 15}}>
                          <View style={{flexDirection: 'row', flex: 1}}>
                            <Image source={{uri:dataHolder.user_details.profile_pic}} style={{height:50, marginTop: 0, width:50, borderRadius:50/2}}/>

                            <View style={{backgroundColor:'transparent',alignItems:"flex-start", flex: 0.8, marginLeft:10}}>
                                        <Text style={{fontFamily:'PoppinsBold'}} >{dataHolder.user_details.name}</Text>
                                        <Text style={{fontFamily:'PoppinsRegular',color:'gray',fontSize:10}} >{dataHolder.shout_out.time}</Text>
                            </View>
                            <View style={{backgroundColor:'transparent',alignItems:"flex-end", flex: 0.2}}>
                            </View>
                          </View>
                            <View style={{flex:1,height:'100%',backgroundColor:'transparent',marginTop:12, paddingLeft: 5}}>
                                        <Text  style={{fontSize:13,fontFamily:'PoppinsRegular',color:'black',marginTop:0}}>{dataHolder.shout_out.comment}</Text>
                            </View>
                        </View>

                        <View style={{flex: 1, justifyContent: 'center', marginTop: 4, alignItems: 'center', backgroundColor: 'transparent'}}>

                        {dataHolder.shout_out.shout_image !== '' &&
                          <View style={{marginTop: 0}}>
                            <Image source={{uri:dataHolder.shout_out.shout_image}} style={{height: height-30, width:deviceWidth-30, borderRadius: 3}}/>
                          </View>
                        }
                        </View>


                        <View style={{flex: 1, flexDirection: 'row', paddingBottom: 15, backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 15}}>
                          <View style={{flex: 0.44, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center'}}>

                          { dataHolder.shout_out.if_you_high_fived &&
                            <View style={{backgroundColor: '#7BD1FD', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High Five</Text></View>
                          }
                          {!dataHolder.shout_out.if_you_high_fived &&
                          <TouchableOpacity onPress={() => this.messageHighFive(dataHolder, rowmap)}>
                            <View style={{backgroundColor: '#626E77', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High Five</Text></View>
                          </TouchableOpacity>
                          }
                              <View style={{backgroundColor: 'transparent', marginLeft: 6}}>
                              <ImageBackground source={boxIcon} resizeMode='contain' style={{width: 70, height: 30}}>
                              <View style={{flexDirection: 'row', flex: 1}}>
                                    <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 10}}>
                                    {dataHolder.shout_out.if_you_high_fived &&
                                        <Image source={handsBlue} style={{height: 15, width: 15}}>
                                        </Image>
                                    }
                                    {!dataHolder.shout_out.if_you_high_fived &&
                                        <Image source={handsBlack} style={{height: 15, width: 15}}>
                                        </Image>
                                    }
                                    </View>

                                    <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end', marginRight: 8}}>
                                    {dataHolder.shout_out.if_you_high_fived &&
                                        <Text style={{color:'#7BD1FD',
                                            fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                                        }}>{dataHolder.shout_out.total_high_fives}</Text>
                                    }
                                    {!dataHolder.shout_out.if_you_high_fived &&
                                        <Text style={{color:'gray',
                                            fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                                        }}>{dataHolder.shout_out.total_high_fives}</Text>
                                    }
                                    </View>
                              </View>
                              </ImageBackground>
                              </View>
                          </View>

                          <View style={{flex: 0.46, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center'}}>
                          <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.getShoutReplyComments(dataHolder, rowmap)}>
                          <Image source={comments1} style={{width: 15, height: 15}}>
                          </Image>
                          <Text style={{color:'gray',
                              fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
                          }}>Comments ({dataHolder.shout_out.total_replies})</Text>
                          </TouchableOpacity>
                          </View>
                          <View style={{flex: 0.10, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center'}}>
                          {(this.state.id == dataHolder.user_details.uid || !dataHolder.shout_out.if_you_flagged) &&
                            <Menu>
                              <MenuTrigger>

                                <View style={{backgroundColor: 'transparent', paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10}}>
                                  <Image source={dagger} style={{width: 6, height: 22}}>
                                  </Image>
                                </View>

                              </MenuTrigger>
                              <MenuOptions>
                              {this.state.id == dataHolder.user_details.uid &&
                                <MenuOption onSelect={() => this.onedit(dataHolder, rowmap)}>
                                  <View style={{paddingTop: 8, backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, flexDirection: 'row'}}>
                                  <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                                  <Image source={editblack} style={{height: 12, width: 10, marginTop: 0}}/>
                                  </View>
                                </MenuOption>
                              }

                                {(!dataHolder.shout_out.if_you_flagged && this.state.id !== dataHolder.user_details.uid) &&
                                  <MenuOption onSelect={() => this.onflag(dataHolder.shout_out.id, rowmap)}>
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

                        {/*<View style={{flex: 1, flexDirection: 'row', backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 15}}>
                          <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                          <Image source={like} style={{width: 20, height: 20}}>
                          </Image>
                          <Text style={{color:'gray',
                              fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
                          }}>{dataHolder.shout_out.total_high_fives}</Text>
                          </View>
                          <View style={{flex: 0.5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.getShoutReplyComments(dataHolder, rowmap)}>
                              <View style={{flexDirection: 'row'}}>
                                <Text style={{color:'gray',
                                    fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
                                }}>{dataHolder.shout_out.total_replies} Comment</Text>
                                </View>
                            </TouchableOpacity>
                          </View>

                        </View>*/}

                      {/*  <View style={{marginTop: 0, flex: 1, marginTop: 0, paddingVertical: 10, borderTopWidth: 0.3, borderColor: '#D4D4D6', justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'transparent'}}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 0
                                }}>

                                    <View style={{flex: 0.33}}>
                                    { dataHolder.shout_out.if_you_high_fived &&
                                        <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                              <Image source={like} style={{width: 20, height: 20}}>
                                              </Image>
                                              <Text style={{color:'#1577FD',
                                                  fontSize: 11, marginLeft: 5, fontFamily: 'PoppinsMedium',
                                              }}>High-Five</Text>
                                          </View>
                                    }
                                    {!dataHolder.shout_out.if_you_high_fived &&
                                      <TouchableOpacity onPress={() => this.messageHighFive(dataHolder, rowmap)}>
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
                                <TouchableOpacity onPress={() => this.getShoutReplyComments(dataHolder, rowmap)}>

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
                                </View>
                        </View>*/}



                        </View>

                    </View>

                </View>




          )

    }


    renderRowComment(dataHolder,rowmap,index){
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
     this.setState({offSetLoader:true});
     if (this.state.commentText != '') {
         const token_ = await SecureStore.getItemAsync('token');
         const url = global.base_url_live+'v1/api/app-insert-high-five';
         const formData = new FormData();

         formData.append('token', JSON.parse(token_));
         formData.append('type', 'r');
         formData.append('feature_value', this.state.commentText);
         formData.append('uid', this.state.id);
         formData.append('day', this.state.day);
         formData.append('week', this.state.week);
         formData.append('challenge_id', this.state.challengeId);
         formData.append('linked_feature_id', this.state.linkFeatureId);
         formData.append('feature_id', this.state.featureId);

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
                     //console.log('Statsu', dataobject);
                     if(dataobject.status == true) {
                      this.state.comment_list.unshift(dataobject.high_five);
                       this.setState({offSetLoader:false});
                       this.textInputComment.clear();
                     }
                     else {
                       alert(dataobject.message);
                       this.setState({offSetLoader:false});
                     }

                 }
             )
             .catch((error) => {
             })


     } else {
         this.setState({offSetLoader:false});
         alert('Please add Comment.')
     }
   }

   updatePrevious() {
     this.state.data_list[this.state.popUpIndex].shout_out.total_replies = this.state.comment_list.length;
     this.setState({data_list: this.state.data_list});
     this.setState({premiumModal: !this.state.premiumModal})
   }

   shiftBack() {
     //this.props.navigation.navigate('DashBoard');
     var obj={'from_page': 'PostComments'}
     this.props.navigation.state.params.onGoBack(obj);
     this.props.navigation.goBack();
   }

   notDo() {

   }

   pickImage = async () => {
       this.setDialogVisibility(true);
   };

   setDialogVisibility(text) {
       this.setState({isDialogVisible: text});
   }

   async doComment() {
       if (this.state.commentText1 != '') {
            Keyboard.dismiss();
            this.setState({offSetLoader1:true});
           const token_ = await SecureStore.getItemAsync('token');
           const url = global.base_url_live+'v1/api/app-insert-high-five';
           const formData = new FormData();

           formData.append('token', JSON.parse(token_));
           formData.append('challenge_id', this.state.challengeId);
           formData.append('feature_id', this.state.featureId);
           formData.append('day', this.state.day);
           formData.append('week', this.state.week);
           formData.append('type', 'c');
           formData.append('feature_value', this.state.commentText1);
           formData.append('uid', this.state.id);

           if (this.state.imageUrl != null) {
               // let imagefile = {
               //     uri: this.state.imageUrl, type: this.state.imagetype ,name:this.state.name
               // }
               // formData.append('image', imagefile);

               Keyboard.dismiss();
               let photo = {uri: this.state.imageUrl};
               formData.append('image', {uri: photo.uri, name: this.state.name, type: this.state.imagetype})
              // alert(JSON.stringify(imagefile));
           }
           // if(this.state.imageUrl!= null){
           //     var parameters = {
           //         token: JSON.parse(token_),
           //         challenge_id: this.state.challengeId,
           //         feature_id: this.state.featureId,
           //         type: "c",
           //         feature_value: this.state.commentText,
           //         uid: this.state.UID,
           //         image:formData
           //     };
           var token = `Bearer ${JSON.parse(token_)}`;

         //  alert(JSON.stringify(formData))
          // console.log(formData);


           var object = {
               method: 'POST',
               body: formData,
               headers: new Headers({
                        //'Content-Type': 'application/json'
                        'Authorization': token,
                    })
           };

         //  alert(JSON.stringify(object));
           // {
           //     method: 'POST',
           //         headers: new Headers({
           //     //'Content-Type': 'application/json'
           //     'Authorization': token,
           // }), body: fromData,
           ///  alert(JSON.stringify(parameters));
           fetch(url, object)
               .then(async (response) => response.text())
               .then(async (responseText) => {
                      var dataobject = JSON.parse(responseText);
                      this.setState({offSetLoader1:false});
                      this.inheritedDataPost(dataobject);
                   }
               )
               .catch((error) => {
               })


       } else {
           this.setState({offSetLoader1:false});
           alert('Please add Comment.')
       }
   }

   inheritedDataPost(dataObject){
       if (dataObject.status) {
           this.refs.inputText.blur();
           this.setState({commentText1: ''});
           this.setState({imageUrl: null});
           var cnt = parseInt(this.state.todayCount)+1;
           this.setState({todayCount: cnt})
           this.state.data_list.unshift(dataObject.high_five);
           Keyboard.dismiss();
           this.refs.toast.show(
               <View style={{flexDirection:'row',alignItems:'center'}}>
                   <Text style={{color:'white',fontSize:12}}>Awesome! </Text>
                   <Emoji name="yellow_heart" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                   />

               </View>)
       }
   }

   pickFromCamera() {
       this.setDialogVisibility(false);
       this.props.navigation.navigate('CameraFor');
       // this.setState({openCamera:true})


   }

   async pickFromGallery() {

       let result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.All,
           allowsEditing: true,
           aspect: [4, 3],
           quality: 1
       });

       /// console.log(result);
       this.setDialogVisibility(false);
       if (!result.cancelled) {

           let filename = result.uri.split('/').pop();
           let match = /\.(\w+)$/.exec(filename);
           let fileType = match ? `image/${match[1]}` : `image`;
           this.setState({imageUrl:result.uri , imagetype: fileType, name:`.${filename}`});
          /// alert(this.state.imageUrl);


       }

   }

   ///Selet image from Camera
   _takePhoto = async () => {
       const {
           status: cameraPerm
       } = await Permissions.askAsync(Permissions.CAMERA);

       const {
           status: cameraRollPerm
       } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

       // only if user allows permission to camera AND camera roll
       if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
           let pickerResult = await ImagePicker.launchCameraAsync({
               allowsEditing: true,
               aspect: [4, 3],
               quality: 1

           });

           let filename = pickerResult.uri.split('/').pop();
           let match = /\.(\w+)$/.exec(filename);
           let fileType = match ? `image/${match[1]}` : `image`;

           if (!pickerResult.cancelled) {
               this.setState({imageUrl: pickerResult.uri, imagetype: fileType, name: `.${filename}`});
           }

           // this.uploadImageAsync(pickerResult.uri);
       }
   };

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
             formData.append('challenge_id', this.state.challengeId);
             formData.append('uid', this.state.id);
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
                           this.state.data_list[flagcmtIndex].shout_out.if_you_flagged = true;
                           this.setState({data_list: this.state.data_list});
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


   ///Selet image from Gallery
   _pickImage = async () => {
       let result = await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
           allowsEditing: true,
           aspect: [1, 1],
           quality: 1
       });
       console.log(result);
       let filename = result.uri.split('/').pop();
       let match = /\.(\w+)$/.exec(filename);
       let fileType = match ? `image/${match[1]}` : `image`;

       if (!result.cancelled) {
         this.setState({imageUrl:result.uri , imagetype: fileType, name:`.${filename}`});
       }
   }


    render() {
      var chlObject = {'challenge_id':this.state.challengeId};
      let {imageUrl} = this.state;

      var optionArray = [
          'Open Camera',
          'Choose from Gallery',
          'Remove Image',
          'Cancel',
      ];

      const placeholder = {
      label: 'Select Reason...',
      value: null,
      color: '#000',
    };
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
            hasBackdrop = {true} isVisible={this.state.editModal} >
                <KeyboardAvoidingView
                    enabled
                    behavior='position'
                    keyboardVerticalOffset={deviceHeight/12}>
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
                      challengeId = {this.state.challengeId}
                      onGoBack={this.editUpdateData}
                      onPopUp={this.editmodalVisible}
                      nav = {this.props.nav}/>
                    </ScrollView>
              </View>
            </View>
                </KeyboardAvoidingView>
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

                    <ModalPremium/>
              </View>
             </ImageBackground>
            </View>
            </Modal>


            <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
            hasBackdrop = {true} isVisible={this.state.flagModal} >
                <KeyboardAvoidingView
                    enabled
                    behavior='position'
                    keyboardVerticalOffset={deviceHeight/12}>
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
                              blurOnSubmit={true}
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
                </KeyboardAvoidingView>
            </Modal>

            <Modal style={{marginLeft: 0, marginRight: 0, marginBottom: 0, marginTop: StatusBar.currentHeight}} transparent={true} deviceWidth={deviceWidth}
          deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal} >
                <KeyboardAvoidingView
                    enabled
                    behavior='position'
                    keyboardVerticalOffset={deviceHeight/12}>
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
                                      <View style={{flex: 0.7}}>
                                                <TextInput
                                                    //style={{paddingHorizontal: 5, backgroundColor: 'transparent', borderColor: '#919191', borderWidth: 1, width: '100%',height: 40,color: '#000'}}
                                                    style={{width: '100%', minHeight: 40, backgroundColor: '#F0F0F6', paddingHorizontal: 10,
                                                    elevation: 3,
                                                    textAlignVertical: "center",
                                                    shadowColor: "#000000",
                                                    shadowOpacity: 0.3,
                                                    shadowRadius: 2,
                                                    shadowOffset: {
                                                        height: 1,
                                                        width: 1
                                                    },
                                                    paddingVertical: 5, borderRadius: 20}}
                                                    placeholder="Enter comment"
                                                    placeholderTextColor="grey"
                                                    ref={input => { this.textInputComment = input }}
                                                    onChangeText={text => this.setState({ commentText: text })}
                                                    underlineColorAndroid='transparent'
                                                  />
                                        </View>
                                        <View style={{flex: 0.02}}>
                                        </View>
                                        <View style={{flex: 0.28}}>
                                          <TouchableOpacity onPress={() => this.replyMessage()}>
                                              <View style={{height: 40, backgroundColor: '#4AAFE3', borderRadius:25, justifyContent: 'center'}}>
                                                <Text style={{fontFamily:'PoppinsBold', paddingHorizontal: 25, fontSize:11,color:'white', textAlign: 'center'}}>Submit</Text>
                                              </View>
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                   </KeyboardAvoidingView>
                          </View>
                          }

                          {this.state.offSetLoader &&

                              <View style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems:'center'}}>
                                  <ActivityIndicator size="large"/>
                              </View>
                          }

                        {this.state.comment_list.length !== 0 &&
                          <FlatList
                               contentContainerStyle={{ flexGrow: 1 }}
                               style={{backgroundColor: 'red',  marginTop: 20,backgroundColor:'transparent',paddingHorizontal:0}}
                               data={this.state.comment_list}
                               renderItem={(data, rowMap) => this.renderRowComment(data, rowMap)}
                               keyExtractor={(data, rowMap) => rowMap.toString()}
                               //onEndReached={this.handeLoadMoreItem}
                               //onEndReachedThreshold={0}
                               ListFooterComponent={this.footerComponent}
                           />
                         }

                         {(this.state.comment_list.length == 0 && !this.state.offSetLoader) &&
                           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                               <Text style={{fontFamily: 'PoppinsLight'}}>no comments available.</Text>
                           </View>
                         }


                  </View>
                </View>
                </KeyboardAvoidingView>
        </Modal>

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
                                justifyContent: 'center',backgroundColor:'transparent',
                                flex:1
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}>My {this.state.Alldata.feature_name}
                                </Text>

                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}

                {this.state.isDialogVisible &&


                <Modal
                    //  hasBackdrop={true}
                    //   onBackdropPress={this.OnBackDrop.bind(this)}
                    //   ref={"modal1"}
                    // coverScreen={true}
                    isVisible={this.state.isDialogVisible}
                    // onSwipeComplete={() => this.setState({ isModalVisible: null })}
                    style={{
                        height: 200, width: '60%', backgroundColor: 'white', flex: 0.3,
                        borderRadius: 6
                        , alignItems: 'center', justifyContent: 'center', alignContent: 'center'
                        , alignSelf: 'center', marginTop: deviceHeight / 2.1
                    }}
                    // backdropOpacity={0.2}
                    //  swipeDirection="down"
                    //scrollTo={this.handleScrollTo}
                    //scrollOffset={this.state.scrollOffset}

                >

                    <View style={{flex: 1, width: '100%'}}>

                        <TouchableOpacity style={{
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            flex: 0.5,
                            justifyContent: 'center'
                        }}
                                          onPress={() => this.pickFromCamera()}
                        >
                            <Text style={{
                                color: 'black',
                                fontSize: 17,
                                fontFamily: 'PoppinsMedium'
                            }}>Camera</Text>
                        </TouchableOpacity>

                        <View style={{height: 1, backgroundColor: 'gray'}}></View>

                        <TouchableOpacity style={{
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            flex: 0.5,
                            justifyContent: 'center'
                        }}
                                          onPress={() => [this.pickFromGallery()]}
                        >
                            <Text style={{
                                color: 'black',
                                fontSize: 17,
                                fontFamily: 'PoppinsMedium'
                            }}>Gallery</Text>
                        </TouchableOpacity>

                    </View>

                </Modal>


                }


              {/*  {!this.state.offSetLoader &&

                  <TouchableOpacity style={{
                borderWidth: 1.5, backgroundColor: 'black',
                     marginHorizontal: 15, height: 45, marginTop: 10, alignItems: 'center',
                     justifyContent: 'center', borderRadius: 2,flexDirection:'row'
            }}
                              onPress={()=>[Keyboard.dismiss(),this.props.navigation.navigate('DoComment', {DATA: this.state.Alldata, challenge_details:chlObject})]}
            >

                <TouchableOpacity
                    style={styles.radiobuttonContainer}
                    //onPress={()=>this.setState({radioImageFirst:true})}
                >

                    {this.state.radioImageFirst &&
                    <Image
                        source={whitecheck}
                        style={styles.radiobuttonImageContainer}
                    >
                    </Image>
                    }

                </TouchableOpacity>


                <TouchableOpacity
                    // onPress={()=>this.setState({radioSecondbutton:true})}
                    style={[styles.radiobuttonContainer,{marginLeft:10}]}>

                    {this.state.radioSecondbutton &&
                    <Image
                        source={whitecheck}
                        style={styles.radiobuttonImageContainer}
                    >
                    </Image>
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    // onPress={()=>this.setState({radioSecondbutton:true})}
                    style={[styles.radiobuttonContainer,{marginLeft:10}]}>

                    {this.state.radioThirdbutton &&
                    <Image
                        source={whitecheck}
                        style={styles.radiobuttonImageContainer}
                    >
                    </Image>
                    }
                </TouchableOpacity>

                <Text style={{
                    marginLeft: 10,
                    fontFamily: 'PoppinsBold',
                    fontSize: 12,
                    color: 'white'
                }}>POST YOUR COMMENT</Text>
            </TouchableOpacity>


                 }*/}


                    {this.state.data_list.length !== 0 &&
                      <FlatList
                          style={{flex: 1, marginTop: 10,backgroundColor:'transparent',paddingHorizontal:0}}
                          data={this.state.data_list}
                          renderItem={({item, index}) => this.renderRow(item, index)}
                          keyExtractor={(item, index) => index.toString()}
                          onEndReached={this.handeLoadMoreItem}
                          onEndReachedThreshold={0.2}
                          ListFooterComponent={this.footerComponent}
                      />
                    }



                    {(this.state.data_list.length == 0 && !this.state.offSetLoader) &&
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: 'PoppinsLight'}}>no content available now.</Text>
                      </View>
                    }

                    {this.state.offSetLoader1 &&

                          <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'transparent', justifyContent: 'center', alignItems:'center'}}>
                            <ActivityIndicator size="large"/>
                        </View>
                    }


                    <ActionSheet
                        ref={o => (this.ActionSheet = o)}
                        //Title of the Bottom Sheet
                        title={'Which one do you like ?'}
                        //Options Array to show in bottom sheet
                        options={optionArray}
                        //Define cancel button index in the option array
                        //this will take the cancel option in bottom and will highlight it
                        cancelButtonIndex={3}
                        //If you want to highlight any specific option you can use below prop
                        destructiveButtonIndex={3}
                        onPress={index => {
                            //Clicking on the option will give you the index of the option clicked

                            if (index == 0) {
                                this._takePhoto()
                            } else if (index == 1) {
                                this._pickImage()
                            }
                            else if (index == 2) {
                                this.setState({imageUrl: null});
                            }
                            // alert(optionArray[index]);
                        }}
                    />


            </View>
        );


    }



    onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    onCheckBoxPressed(){

        if(this.state.checked){
            this.setState({checked:false})
        }else {
            this.setState({checked:true})
        }
    }
}

const styles = StyleSheet.create({
  radiobuttonContainer:{
      height:18,width:18,borderRadius:18/2,marginLeft:10,
      backgroundColor:'lightgray',borderColor:'white',borderWidth:0,justifyContent:'center',alignItems:'center'
  },
  radiobuttonImageContainer:{
      height: 18, width: 18, alignItems: 'center', justifyContent: 'center'
  },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 90,

    },
    backTextWhite: {
        color: '#FFF',fontSize:10,fontFamily:'PoppinsSemiBold'
    },
    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'transparent',
        marginTop: 35,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,borderBottomLeftRadius:5,borderTopLeftRadius:5
    },
    backRightBtn222: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 65,
    },
    column:{
      flexDirection:'column',justifyContent:'center',alignItems:'center'
    },
    trash: {
        height: 65,
        width: 65,backgroundColor:'yellow'
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
        marginTop:13,marginBottom: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',


    },

    menu: {
      width: 25,
      height: 25,
      marginLeft: 15,


    },hiddenImages:{
        width:18,
        height: 18,
    },
    menuSEC:{
        width: 5,
        height: 18,marginRight:15

    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,flexDirection:'row',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,marginBottom:5,marginTop:20
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
    loader:{
        marginTop:5,alignItems:'center',height:60,
    }
});
