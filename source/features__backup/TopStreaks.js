import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    Dimensions,
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
import Modal from 'react-native-modal';
import ModalPremium from './../modals/ModalPremium';
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';
const checkyellow = require('./../../images/checkyellow.png');
const checkgray = require('./../../images/checkgray.png');
const nextarrow = require('./../../assets/nextarrow.png');
const backg = require('./../../images/bg_popup.png');
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system';
import AnimatedLoader from "react-native-animated-loader";
import Toast, {DURATION} from 'react-native-easy-toast';
const orangearrow = require('./../../images/orangearrow.png');
const unlockblack = require('./../../assets/unlockblack.png');
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

export default class TopStreaks extends Component {
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
            leaderData:[],
            premiumModal: false,
            category_id: 0,
            challenge_id: this.props.challengeId,
            basicArray: this.props.basicData,
            day: this.props.basicData.details.day,
            week: this.props.basicData.details.week,
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
            this.getLeaderboard();
          }
        }
    }

    async getLeaderboard() {
      this.setState({offSetLoader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/get-top-leaderboard-users-points';

      var parameters = {
          uid:this.state.UID,
          challenge_id:this.state.challenge_id,
          sort : 's',
          day: this.state.day,
          week: this.state.week,
          page_size : 10,
	        data_offset : 0
      };

      // console.log('dataobject', parameters);

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
                  //console.log('dataobject', dataobject);
                  this.setState({offSetLoader:false});
                  this.setState({leaderData: dataobject.leaderboard});
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
      if(data.daily_inspiration_category.image !== undefined) {
        this.setState({offSetLoader:true});
        var image_source = data.daily_inspiration_category.image;
        var imgName = image_source.substring(image_source.lastIndexOf("/")+1,image_source.length);
        FileSystem.downloadAsync(
              image_source,
              FileSystem.documentDirectory  + imgName
            )
              .then(({ uri }) => {
                  console.log('Finished downloading to ', uri);
                  this.setState({offSetLoader:false});
                  Sharing.shareAsync(uri);
              })
              .catch(error => {
                console.error(error);
              });
      }
      else {
        alert('Image not loaded. Please check Image.');
      }
      };

    refresh=()=> {
        this.getLeaderboard();
        this.props._handeleDayChange();
    }

    renderLeaderboard(item, rowmap){

      var nums = ["#FFAE55", "#63BE45", "#4AAFE3", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100", "#4AAFE3", "#63BE45", "#FFAE55", "#F7D100","#FFAE55", "#63BE45", "#4AAFE3", "#F7D100"];
      var bgColor = nums[rowmap];
//       var nums = ["#FFAE55", "#63BE45", "#4AAFE3", "#F7D100"];
//       var ranNums = [],
//       i = nums.length,
//       j = 0;
//
// while (i--) {
//     j = Math.floor(Math.random() * (i+1));
//     ranNums.push(nums[j]);
//     var bgColor = nums.splice(j,1);
// }
      //  var items = ["#FFAE55", "#63BE45", "#4AAFE3", "#F7D100"];
      //
      //  var colour = items[Math.floor(Math.random() * items.length)];
      // var bgColor = colour;

           return(
             <View style={styles.topuser_itemsview}>
                 <View style={{backgroundColor: bgColor, width: '100%',
                 justifyContent: 'center', alignItems: 'center',
                 borderTopLeftRadius: 10,
                 borderTopRightRadius: 10}}>
                 <Image source={{uri:item.user_details.profile_pic}}
                        style={{width: 50, height: 50, borderRadius: 50 / 2, overflow: "hidden", marginTop: 12, marginBottom: 12}}>
                 </Image>
                 </View>
                 <View style={{justifyContent: 'center', alignItems: 'center'}}>
                 <Text style={{
                     fontFamily: 'PoppinsSemiBold',
                     fontSize: 10,
                     textAlign: 'center',
                     marginTop: 10
                 }} numberOfLines={2}>{item.user_details.name}</Text>
                 </View>
                 <View style={{
                     flexDirection: 'row',
                     justifyContent: 'center',
                     alignItems: 'center'}}>
                 <Image source={orangearrow} style={{width: 18, height: 16}}>
                 </Image>
                 <Text style={{
                     color: '#19bffd',
                     marginTop: 3,
                     fontFamily: 'PoppinsBold',
                     fontSize: 10
                 }}> {item.streaks} Streaks </Text>
                </View>
             </View>
         )

   }


    render() {
      const {navigate} = this.props.nav;
      if(this.state.leaderData.length !== 0) {
        return (
            <View style={styles.leaderboard_view}>
          <View style={{flex: 1}}>
          <TouchableOpacity style={{flex: 1}}
          onPress={()=>navigate('LeaderShipSecond', {uId:this.state.UID,week:this.state.week,day:this.state.day, cId: this.state.challenge_id, onGoBack: this.refresh, index: 1})}>

      <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  backgroundColor: 'transparent',
                  justifyContent: 'space-between',
                  alignItems: 'center',
              }}>
                  <Text style={{fontSize: 20, fontFamily: 'PoppinsBold'}}> Top Streaks
                  </Text>
                  <Image source={nextarrow} style={{width: 12, height: 20, marginRight: 10}}>
                  </Image>
              </View>
          </TouchableOpacity>

              <View style={{
                  flexDirection: 'row',
                  flex: 1,
                  height: 170,
                  backgroundColor: 'transparent',
                  marginHorizontal: 0,
                  borderRadius: 10,
                  marginTop: 5,
                  marginBottom: 10,
              }}>
              {this.state.offSetLoader &&
                  <View style={{backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                      <ActivityIndicator size="large"/>
                  </View>
              }
              {this.state.leaderData.length !== 0 &&
                <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                          horizontal={true}
                          data={this.state.leaderData}
                          renderItem={({item, index}) => this.renderLeaderboard(item, index)}
                          keyExtractor={(item, index) => index.toString()}
                          />
              }

              </View>
              </View></View>
        );
      }else {
        return (
            <View></View>
        );
      }

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
        //height: 190,
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
        height: 150,
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
