import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    Image,
    Dimensions,
    ImageBackground,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Modal from 'react-native-modal';
import ModalPremium from './../modals/ModalPremium';
import SideMenu from 'react-native-side-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
const backg = require('./../../images/bg_popup.png');
const crossarrow = require('./../../images/close.png');
const unlockblack = require('./../../assets/unlockblack.png');
const unlockgray = require('./../../assets/unlockgray.png');
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;



console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const starshinegray = require('./../../images/starshinegray.png');
const checkyellow = require('./../../images/checkgreen1.png');
const checkgray = require('./../../images/checkgray.png');

const nextarrow = require('./../../assets/nextarrow.png');
const profile = require('./../../images/image-9.png');
const image13 = require('./../../images/image-27.png');
const checkgreen = require('./../../images/checkgreen.png');
const docs = require('./../../images/docs.png');
const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
export default class Feature12 extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            featureType: this.props.dataFromParent.feature_type,
            //featureType: 0,
            UID: 0,
            accessToken: '',
            offSetLoader: false,
            coreData: [],
            feature_category_id: 0,
            challengeArray: this.props.dataFromParent,
            challengeId: this.props.challenge_id,
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
        console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
            this.coreValues();
        }
    }

    async coreValues() {

      this.setState({offSetLoader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/get-core-values-dashboard-content';

      var parameters = {
          uid:this.state.UID,
          challenge_id:this.state.challengeId,
          feature_id:12,
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
                  this.setState({feature_category_id: dataobject.core_values_content.feature_category_id});
                  this.setState({coreData: dataobject});
              }
          )
          .catch((error) => {
              alert(' Exception causes' + error)
          })
    }

    premium() {
      this.setState({premiumModal: !this.state.premiumModal})
    }

    refresh=(data)=> {
        this.setState({UID: data.uid});
        this.coreValues();
        this.props._handeleDayChange();
    }

    _handelePaymentUpdate = () => {
        this.props._handelePaymentUpdate();
    }

    render() {
        var dataholder = this.state.challengeArray;
        const {navigate} = this.props.nav;

        const coreDetails = this.state.coreData;
        if(coreDetails.length !== 0){
          var imageUri = coreDetails.core_values_content.image;
          var title = coreDetails.core_values_content.heading;
          var checkStatus = coreDetails.core_values_content.user_actions.action_status;
          var chlObject = {'challenge_id':this.state.challengeId, 'feature_category_id': this.state.feature_category_id, 'day': this.state.basicArray.details.day, 'week': this.state.basicArray.details.week, 'feature_name': dataholder.feature_name};
        }
        else {
          var imageUri = '';
          var checkStatus = false;
          var title = '';
          var chlObject = {};
        }

        return (
          <View style={styles.core_values}>
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


              <TouchableOpacity
                  onPress={() => {
                    if(this.state.featureType == 0) {
                      navigate('CoreValues',{DATA:dataholder, challenge_details:chlObject, onGoBack: this.refresh})
                    }
                    else {
                      this.premium();
                    }
                  }}
                  style={{flex: 1, flexDirection: 'row',backgroundColor:'transparent'}}>

                  {this.state.offSetLoader &&
                      <View style={{backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                          <ActivityIndicator size="large"/>
                      </View>
                  }
                  <View style={{
                      flex: 0.65,
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      marginRight: 0
                  }}>
                      <View style={{flexDirection: 'row', marginTop: 0}}>
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
                              fontFamily: 'PoppinsRegular', color: '#64BD45',
                          }}>{dataholder.feature_name.toUpperCase()}</Text>
                      </View>

                      <Text style={{
                          fontFamily: 'PoppinsBold',
                          color: '#000',
                          fontSize: 13,
                          marginLeft: 0,
                          marginTop: 7,
                          lineHeight: 23
                      }} numberOfLines={2}
                      >
                          {title}</Text>
                      <Text style={{
                          marginLeft: 0,
                          marginBottom: 0,
                          marginTop: 4,
                          color: '#000',
                          fontFamily: 'PoppinsBold',
                          fontSize: 12
                      }}>{dataholder.points} Points </Text>

                  </View>

                  <View style={{flex: 0.02}}>
                  </View>

                  <View style={{
                    flex: 0.33,
                    height: '100%',
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    justifyContent: 'flex-end',
                    borderRadius: 0
                  }}>
                  <View style={{alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'transparent'}}>
                  <Image source={{uri:imageUri}} style={{marginTop: 10, width: 80, height: 80, borderRadius: 80/2}}>
                  </Image>
                  </View>
                  <View style={{alignItems: 'flex-end', justifyContent: 'flex-start'}}>
                  {this.state.featureType == 1 &&
                      <Image source={unlockgray}
                         style={{width: 35, height: 35, alignItems: 'center', marginLeft: 10}}>
                      </Image>
                  }
                  {this.state.featureType == 0 &&
                      <Image source={nextarrow}
                             style={{width: 12, height: 20, alignItems: 'center', marginLeft: 10}}>
                      </Image>
                  }
                  </View>
                      {/*<ImageBackground resizeMode={'stretch'} source={image13} imageStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0}} style={{
                          flex: 1,
                          width: '100%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                      }}>  </ImageBackground> */}
                  </View>
              </TouchableOpacity>
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
    core_values: {
      flex: 1,
      borderColor: '#64BD45',
      borderWidth: 3,
      marginHorizontal: 15,
      padding: 15,
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
