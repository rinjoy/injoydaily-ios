import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    Image,
    ImageBackground,
    Dimensions,
    StatusBar,
    RefreshControl,
    StyleSheet,
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
import Toast, {DURATION} from 'react-native-easy-toast';
console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const unlockgray = require('./../../assets/unlockgray.png');
const starshinegray = require('./../../images/starshinegray.png');
const image13 = require('./../../images/image-13.png');
const unlockblack = require('./../../assets/unlockblack.png');
const backg = require('./../../images/bg_popup.png');
const checkyellow = require('./../../images/checkblue1.png');
const checkgray = require('./../../images/checkgray.png');
const crossarrow = require('./../../images/close.png');

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;
export default class Feature6 extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            accessToken: '',
            offSetLoader: false,
            premiumModal: false,
            challenge_id: this.props.challenge_id,
            challengeArray: this.props.dataFromParent,
            feature_category_id: 0,
            featureType: this.props.dataFromParent.feature_type,
            //featureType: 1,
            weekData: [],
            basicArray: this.props.basicData,
        };
        this.premium = this.premium.bind(this);
    }

    componentDidMount() {
      getUserId().then(id =>
          this.setState({UID: id}),
      );
        this.getAccessToken();
    }

    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});
        //alert(this.state.accessToken);
        //console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
            if(this.state.basicArray.length !== 0) {
            this.getWeekly();
          }
        }
    }


    async getWeekly() {
      this.setState({offSetLoader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/get-weekly-video-content-current';

      var parameters = {
          uid:this.state.UID,
          challenge_id:this.state.challenge_id,
          feature_id:6,
          day: this.state.basicArray.details.day,
          week: this.state.basicArray.details.week,
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
                  this.setState({weekData: dataobject});
                  this.setState({feature_category_id: dataobject.weekly_video_current.feature_category_id});
              }
          )
          .catch((error) => {
              alert(' Exception causes' + error)
          })
    }

    refresh=(data)=> {
        this.setState({UID: data.uid});
        this.getWeekly();
        this.props._handeleDayChange();
    }

    premium() {
      this.setState({premiumModal: !this.state.premiumModal})
    }

    _handelePaymentUpdate = () => {
        this.props._handelePaymentUpdate();
    }


    render() {
      var dataholder = this.state.challengeArray;
      const {navigate} = this.props.nav;

      const weekDetails = this.state.weekData;
      if(weekDetails.length !== 0){
        var imageUri = weekDetails.weekly_video_current.home_image;
        var question = weekDetails.weekly_video_current.home_question;
        var checkStatus = weekDetails.weekly_video_current.user_actions.action_status;
        var chlObject = {'challenge_id':this.state.challenge_id, 'day': this.state.basicArray.details.day, 'week': this.state.basicArray.details.week, 'feature_name': dataholder.feature_name, 'feature_category_id': this.state.feature_category_id, 'check_status': checkStatus};
      }
      else {
        //var imageUri = this.state.inspData.content.image;
        var checkStatus = false;
        var question = '';
        var chlObject = {};
      }

        return (<View>

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


                <TouchableOpacity style={styles.weekly_view}
          onPress={()=>{
            if(this.state.featureType == 0) {
              navigate('WeaklyVideo',{DATA:dataholder, challenge_details:chlObject, onGoBack: this.refresh})
            }
            else {
              this.premium();
            }
          }}
          >
          {this.state.offSetLoader &&
              <View style={{backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                  <ActivityIndicator size="large"/>
              </View>
          }

          <Toast
                    ref="toast"
                    style={{backgroundColor:'black'}}
                    position='top'
                    positionValue={50}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
              <View style={{flexDirection: 'row',borderBottomColor: '#4AAFE3',
              borderWidth: 3,
              borderRadius: 10,
              borderColor: '#4AAFE3',
              //borderBottomWidth: 3,
              //borderTopLeftRadius: 10,
              //borderBottomLeftRadius: 10,
              //borderTopColor: '#64BD45',
              //borderTopWidth: 3,
              //borderLeftColor: '#64BD45',
              //borderLeftWidth: 3
            }}>
                  <View style={{
                      flex: 0.7,
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      marginRight: 0
                  }}>
                      <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 15}}>
                            {checkStatus &&
                              <Image source={checkyellow}
                                     style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                              </Image>
                            }
                            {!checkStatus &&
                              <Image source={checkgray}
                                     style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                              </Image>
                            }
                          <Text style={{
                              marginTop: 0, marginLeft: 5, fontSize: 14,
                              fontFamily: 'PoppinsRegular', color: '#4AAFE3',
                          }}>{dataholder.feature_name.toUpperCase()}</Text>
                      </View>

                      <Text style={{
                          fontFamily: 'PoppinsBold',
                          color: '#000',
                          fontSize: 13,
                          marginLeft: 15,
                          marginRight: 5,
                          marginTop: 10,
                          lineHeight: 23
                      }}
                      >
                          {question}</Text>
                      <Text style={{
                          marginLeft: 15,
                          marginTop: 4,
                          marginBottom: 15,
                          color: '#000',
                          padding: 0,
                          fontFamily: 'PoppinsBold',
                          fontSize: 12
                      }}>{dataholder.points} Points </Text>

                  </View>
                  <View style={{
                      flex: 0.30,
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      //borderRadius: 5
                  }}>
                      <ImageBackground source={{uri: imageUri}} imageStyle={{ borderTopRightRadius: 7, borderBottomRightRadius: 7}} style={{
                          width: '100%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          //borderRadius: 10
                      }}>

                      {this.state.featureType == 1 &&
                        <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 99}}>
                            <Image source={unlockgray} style={{width: 35, height: 35}}>
                            </Image>
                        </View>
                      }

                      </ImageBackground>
                  </View>
              </View>
          </TouchableOpacity></View>
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
        flex: 1,
        marginHorizontal: 15,
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
