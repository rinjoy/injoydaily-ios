import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    Dimensions,
    Share,
    Image,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    StatusBar,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    View
} from 'react-native';


import SideMenu from 'react-native-side-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import ModalPremium from './../modals/ModalPremium';
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';
const checkyellow = require('./../../images/checkorange1.png');
const checkgray = require('./../../images/checkgray.png');
const nextarrow = require('./../../assets/nextarrow.png');
const backg = require('./../../images/bg_popup.png');
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system';
import AnimatedLoader from "react-native-animated-loader";
import Toast, {DURATION} from 'react-native-easy-toast';
const unlockblack = require('./../../assets/unlockblack.png');
const unlockgray = require('./../../assets/unlockgray.png');
const crossarrow = require('./../../images/close.png');

const dailyInsp = require('./../../images/dailyInsp/daily4.png');
console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;

export default class Feature1 extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            offSetLoader: false,
            UID: 0,
            accessToken: '',
            inspData:[],
            premiumModal: false,
            challenge_id: this.props.challenge_id,
            category_id: 0,
            view2LayoutProps: {
              left: 0,
              top: 0,
              width: 100,
              height: 100,
            },
            challengeArray: this.props.dataFromParent,
            basicArray: this.props.basicData,
            day: this.props.basicData.details.day,
            feature_category_id: 0,
            week: this.props.basicData.details.week,
            featureType: this.props.dataFromParent.feature_type,
            //featureType: 1,
            submitButtonColor:false,
        };
        this.premium = this.premium.bind(this);
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
        // console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
          if(this.state.basicArray.length !== 0) {
            this.getInspiration();
          }
        }
    }

    async getInspiration() {
      this.setState({offSetLoader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/get-daily-inspiration-content-current';

      var parameters = {
          uid:this.state.UID,
          challenge_id:this.state.challenge_id,
          feature_id:1,
          day: this.state.day,
          week: this.state.week,
      };

      var token = `Bearer ${JSON.parse(token_)}`;

      fetch(url,
          {
              method: 'POST',
              headers: new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': token,
              }),body: JSON.stringify(parameters),
          })
          .then(async (response) => response.text())
          .then(async (responseText) => {
                  var dataobject = JSON.parse(responseText);
                  this.setState({offSetLoader:false});
                  if(dataobject.status) {
                    this.setState({feature_category_id: dataobject.content.feature_category_id});
                    this.setState({inspData: dataobject});
                  }
                  else{
                      alert('Something Went Wrong');
                  }
              }
          )
          .catch((error) => {
              alert(' Exception causes' + error)
          })
    }

     async submitPoints(dataholder){

            const token_  =await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-daily-inspiration-action';


           var parameters = {
               uid: this.state.UID,
               day: this.state.day,
               feature_id:1,
               week: this.state.week,
               challenge_id: this.state.challenge_id,
           };
           var token = `Bearer ${JSON.parse(token_)}`;
           //alert(JSON.stringify(parameters));
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
                      if(dataobject.status){
                          this.state.inspData.content.user_actions.action_status = true;
                          this.setState({inspData: this.state.inspData});
                          this.refs.toast.show(dataobject.user_message);
                      }
                   }
               )
               .catch((error) => {
               })


    }

    async  onShare(data) {
      if(data.content.image !== undefined) {

        this.setState({offSetLoader:true});
        var image_source = data.content.image;
        var imgName = image_source.substring(image_source.lastIndexOf("/")+1,image_source.length);
        FileSystem.downloadAsync(
              image_source,
              FileSystem.documentDirectory  + imgName
            )
              .then(async({ uri }) => {
                  console.log('Finished downloading to ', uri);
                  this.setState({offSetLoader:false});

                  // if (!(await Sharing.isAvailableAsync())) {
                  //   alert(`Uh oh, sharing isn't available on your platform`);
                  //   return;
                  // }
                  // await Sharing.shareAsync(uri);

                  // let  text = 'Want more buzz around your photos on Insta, Facebook, Twitter, Whatsapp posts?\n\nLet\'s make your stories get more eyeballs..\nVisit Website '
                  // if(Platform.OS === 'android')
                  // {
                  //   text = text.concat('https://injoyglobal.com/')
                  // }
                  // else
                  // {
                  //     text = text.concat('https://injoyglobal.com/')
                  // }
                  // text.concat(data.content.image);

                  try {
                    const result = await Share.share({
                      //message:text,
                      url: uri,
                    });
                    if (result.action === Share.sharedAction) {
                      if (result.activityType) {
                        console.log('Activity Type', result.activityType);
                      } else {
                        console.log('Shared');
                      }
                    } else if (result.action === Share.dismissedAction) {
                      console.log('Dismissed');
                    }
                  } catch (error) {
                    alert(error.message);
                  }


              })
              .catch(error => {
                console.error(error);
              });
      }
      else {
        alert('Image not loaded. Please check Image.');
      }
      };

     refresh=(data)=> {
        this.setState({UID: data.uid});
        this.setState({challenge_id: data.challenge_id});
        this.setState({category_id: data.category_id});
        this.setState({day: data.day});
        this.setState({week: data.week});
        this.getInspiration();
        this.props._handeleDayChange();
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


    render() {
      const inspDetails = this.state.inspData;
      if(inspDetails.length !== 0){
        var imageUri = inspDetails.content.image;
        var checkStatus = inspDetails.content.user_actions.action_status;
        var chlObject = {'challenge_id':this.state.challenge_id, 'feature_category_id':this.state.feature_category_id, 'day': this.state.day, 'week': this.state.week};

        const ratio = this.state.view2LayoutProps.width/inspDetails.content.dimensions.width;
        var ViewHeight = inspDetails.content.dimensions.height * ratio;
        var ViewWidth = deviceWidth - 30;
      }
      else {
        var ViewHeight = 280;
        var ViewWidth = deviceWidth - 30;
        var chlObject = {};
        var checkStatus = false;
      }
      const {navigate} = this.props.nav;
      var dataholder = this.state.challengeArray;
        return (
          <View style={styles.challenge_view}>

          <Modal style={{marginLeft: 10, marginRight: 10, marginBottom: 0, marginTop: StatusBar.currentHeight}} transparent={true} deviceWidth={deviceWidth}
          deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal} >
          <View style={{flex: 1, height:'100%' , width: '100%', backgroundColor: '#fff', padding: 0, margin: 0}}>
          <ImageBackground resizeMode= 'contain' source={backg} style={{flex: 1, height: '100%', width: '100%'}}>
            <View style={{padding: 0}}>
                  <TouchableOpacity onPress={this.premium}>
                    <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                      <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                    </View>
                  </TouchableOpacity>

                  <ModalPremium/>
            </View>
           </ImageBackground>
          </View>
          </Modal>

          <Toast
                    ref="toast"
                    style={{backgroundColor:'black'}}
                    position='top'
                    positionValue={240}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
          {this.state.offSetLoader &&
              <View style={{backgroundColor: 'transparent', zIndex: 99, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                  <ActivityIndicator color="#000000" size="large"/>
              </View>
          }

              <TouchableOpacity
              onPress={() => {
                if(this.state.featureType == 0) {
                  navigate('DailyInspiration',{DATA:dataholder, challenge_details:chlObject, onGoBack: this.refresh});
                }
                else {
                  this.premium();
                }
              }}
              >
              <View onLayout={(event) => this.onLayout(event)}>
                <Image source={{uri: imageUri}}
                       style={{flex: 1,
                       height: ViewHeight,
                       width: ViewWidth,
                       borderTopLeftRadius: 10,
                       borderTopRightRadius: 10}}>
                </Image>
              </View>
              </TouchableOpacity>

              <View
                  style={{flexDirection: 'row', borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderBottomColor: '#FFAD56',
                  borderBottomWidth: 3,
                  borderRightColor: '#FFAD56',
                  borderRightWidth: 3,
                  borderLeftColor: '#FFAD56',
                  borderLeftWidth: 3,
                  }}>
                  <View style={{width: '100%', backgroundColor: 'transparent', paddingVertical: 12}}>

                      <View>

                          <TouchableOpacity style={{
                              flexDirection: 'row',
                              backgroundColor: 'transparent',
                              marginBottom: 10,
                              alignItems: 'center',
                          }}
                          onPress={() => {
                            if(this.state.featureType == 0) {
                              navigate('DailyInspiration',{DATA:dataholder, challenge_details:chlObject, onGoBack: this.refresh})
                            }
                              else {
                                this.premium();
                              }
                             }}
                          >
                          {checkStatus &&
                            <Image source={checkyellow}
                                   style={{width: 18, height: 18, marginLeft: 15, marginTop: 0}}>
                            </Image>
                          }
                          {!checkStatus &&
                            <Image source={checkgray}
                                   style={{width: 18, height: 18, marginLeft: 15, marginTop: 0}}>
                            </Image>
                          }

                              <Text style={{
                                  marginTop: 0, marginLeft: 5, fontSize: 14,
                                  fontFamily: 'PoppinsRegular', color: '#FFAD56',
                              }}>{dataholder.feature_name.toUpperCase()}</Text>
                              <View style={{
                                  flex: 1,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: 'transparent',
                                  justifyContent: 'flex-end'
                              }}>
                              {this.state.featureType == 1 &&
                                  <Image source={unlockgray}
                                     style={{width: 35, height: 35, marginRight: 15, marginTop: 0}}>
                                  </Image>
                              }
                              {this.state.featureType == 0 &&
                                  <Image source={nextarrow}
                                         style={{width: 12, height: 20, marginRight: 15, marginTop: 0}}>
                                  </Image>
                              }
                              </View>
                          </TouchableOpacity>

                          <View style={{
                              flexDirection: 'row',
                              flex: 1,
                              width: '100%',
                              backgroundColor: 'transparent',
                              alignItems: 'center',
                              marginTop: 12
                          }}>
                              <View style={{
                                  flexDirection: 'row',
                                  flex: 1, backgroundColor: 'transparent',
                                  alignItems: 'flex-end',
                                  justifyContent: 'flex-end', paddingRight: 15

                              }}>
                              <View style={{flex: 0.50, paddingLeft: 15}}>
                              {!checkStatus &&
                              <Text style={{
                                  //color: '#19bffd',
                                  color: '#000',
                                  alignItems: 'center',
                                  fontFamily: 'PoppinsBold',
                                  fontSize: 12
                              }}>  {dataholder.points + " Points"} </Text>
                            }

                              </View>

                              <View style={{flex: 0.25, backgroundColor: 'transparent'}}>
                              {!checkStatus &&
                                  <TouchableOpacity style={{
                                      backgroundColor: '#4AAFE3',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      paddingVertical: 5,
                                      paddingHorizontal: 8,
                                      borderRadius: 25
                                  }}
                                  onPress={()=>{
                                    if(this.state.featureType == 0) {
                                      this.submitPoints(dataholder)
                                    }
                                      else {
                                        this.premium();
                                      }
                                  }}
                                  >
                                  {/*checkStatus &&
                                    <Image source={checkyellow}
                                           style={{width: 15, height: 15, marginRight: 2, marginTop: 0}}>
                                    </Image>
                                  */}
                                  {/*!checkStatus &&
                                    <Image source={checkgray}
                                           style={{width: 15, height: 15, marginRight: 2, marginTop: 0}}>
                                    </Image>
                                  */}

                                      <Text style={{
                                          color: 'white',
                                          fontSize: 11,
                                          flexWrap: 'wrap',
                                          fontFamily: 'PoppinsBold',
                                          marginTop: 0
                                      }}> Submit</Text>
                                  </TouchableOpacity>
                                }
                                </View>

                                <View style={{flex: 0.25, backgroundColor: 'transparent'}}>
                                  <TouchableOpacity style={{
                                      backgroundColor: '#4AAFE3',
                                      marginLeft: 8,
                                      paddingVertical: 5,
                                      flexDirection: 'row',
                                      paddingHorizontal: 8,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderRadius: 25
                                  }}
                                  onPress={()=>
                                    {
                                      if(this.state.featureType == 0) {
                                        this.onShare(inspDetails)
                                      }
                                        else {
                                          this.premium();
                                        }
                                    }}
                                  >
                                      <Text style={{
                                          color: 'white',
                                          fontSize: 11,
                                          fontFamily: 'PoppinsBold',
                                          marginTop: 0
                                      }}> Share</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>

                          </View>

                      </View>
                  </View>


              </View>
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
        height: 250,
        width: deviceWidth - 30,
        resizeMode:'cover' ,
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
