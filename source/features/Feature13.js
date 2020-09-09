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
    Text,
    ActivityIndicator,
    TouchableOpacity,
    View
} from 'react-native';


import SideMenu from 'react-native-side-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
const new_icon = require('./../../images/new.png');
const injoy_daily = require('./../../images/injoy-daily.png');
const image27 = require('./../../images/img123.png');
const unlockgray = require('./../../images/play-btn.png');
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';




console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class Feature13 extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            accessToken: '',
            UID: 0,
            offSetLoader: false,
            challenge_id: this.props.challenge_id,
            featureId: 13,
            challengeArray: [],
            jeffData: [],

        };

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
        if (this.state.accessToken = !'') {
            this.jeffUpdates();
        }


    }

    async jeffUpdates() {
      this.setState({offSetLoader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/get-jeff-updates-active-content-dashboard';

      var parameters = {
          uid:this.state.UID,
          challenge_id:this.state.challenge_id,
          feature_id:this.state.featureId,
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
                    this.setState({jeffData: dataobject});
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

    refresh=(data)=> {
       //this.setState({UID: data.uid});
       //this.setState({challenge_id: data.challenge_id});
       //this.setState({category_id: data.category_id});
       //this.setState({day: data.day});
       //this.setState({week: data.week});
       //this.getInspiration();
       //this.props._handeleDayChange();
   }


    render() {
      var WholeData = this.state.jeffData;
      const {navigate} = this.props.nav;
      if(WholeData.length !== 0) {
        var title = WholeData.jeff_updates.title;
        var imgUrl = WholeData.jeff_updates.dashboard_image;
        var chlObject = {'challenge_id':this.state.challenge_id, 'feature_category_id':WholeData.jeff_updates.feature_category_id};
      }
      else{
        var title = '';
        var imgUrl = '';
        var chlObject = {};
      }
        return (
          <View>
                    <TouchableOpacity onPress={() => navigate('JeffUpdate',{DATA:WholeData, challenge_details:chlObject, onGoBack: this.refresh})}
                    style={styles.weekly_view}>
                    {this.state.offSetLoader &&
                        <View style={{backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                            <ActivityIndicator size="large"/>
                        </View>
                    }
                        <View style={{flexDirection: 'row'}}>
                        {/*
                        <View style={{marginTop: -20, marginLeft: -10, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, zIndex: 9}}>
                            <Image source={new_icon} style={{width: 40, height: 40, zIndex: 99}}></Image>
                        </View>
                        */}
                            <View style={{
                                flex: 1,
                                borderColor: '#F6D000',
                                //backgroundColor: 'red',
                                borderWidth: 3,
                                borderRadius: 35,
                                flexDirection: 'row',
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                marginRight: 0
                            }}>
                            <View style={{flex:0.15, justifyContent: 'center', backgroundColor: 'transparent'}}>
                              <Image source={{uri: imgUrl}} style={{width: 60, height: 60, borderRadius: 60/2, borderColor:'#4AAFE3',  borderWidth: 2}}></Image>
                            </View>

                            <View style={{flex:0.85, backgroundColor: 'transparent'}}>
                                <Text style={{
                                    fontFamily: 'PoppinsBold',
                                    color: 'black',
                                    fontSize: 15,
                                    marginLeft: 15,
                                    marginRight: 5,
                                    marginTop: 10,
                                    marginBottom: 5,
                                    lineHeight: 23
                                }} numberOfLines={2}
                                >
                                    {title}</Text>
                              </View>
                            </View>
                            {/*<View style={{
                                flex: 0.30,
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5
                            }}>
                                <ImageBackground source={image27} imageStyle={{ borderTopRightRadius: 10, borderBottomRightRadius: 10}} style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10
                                }}>
                                <View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 99}}>
                                    <Image source={unlockgray} style={{width: 35, height: 35}}>
                                    </Image>
                                </View>
                                </ImageBackground>
                            </View>*/}
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
weekly_view: {
    flex: 1,
    marginHorizontal: 15,
    // padding: 10,
    //borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 15, marginTop: 15,
    // elevation: 2,
    // shadowColor: "#000000",
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    // shadowOffset: {
    //     height: 1,
    //     width: 1
    // }`
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
