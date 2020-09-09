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
    RefreshControl,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


import SideMenu from 'react-native-side-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import ModalPremium from './../modals/ModalPremium';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import ModalUpdateShareWin from './../modals/ModalUpdateShareWin';
const editblack = require('./../../assets/editblack.png');
const dagger = require('../../images/dager.png');
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const starshinegray = require('./../../images/starshinegray.png');
const nextarrow = require('./../../assets/nextarrow.png');
const image11 = require('./../../images/image-11.png');
const image12 = require('./../../images/image-12.png');
const image13 = require('./../../images/image-13.png');
const hands = require('./../../images/handsblue.png');
const commentblue = require('./../../images/commentblue.png');
const checkyellow = require('./../../images/checkyellow1.png');
const checkgray = require('./../../images/checkgray.png');
const backg = require('./../../images/bg_popup.png');
const crossarrow = require('./../../images/close.png');
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;
const unlockblack = require('./../../assets/unlockblack.png');
const unlockgray = require('./../../assets/unlockgray.png');
const boxIcon = require('./../../images/high-five-bar.png');
const handsBlack = require('./../../images/hand-blck.png');
const handsBlue = require('./../../images/hand-blue.png');
const comments1 = require('../../images/commentblue.png');
export default class Feature5 extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            accessToken: '',
            UID: 0,
            winsStatus: 0,
            featureType: this.props.dataFromParent.feature_type,
            //featureType: 1,
            challenge_id: this.props.challenge_id,
            feature_category_id: 0,
            editModal: false,
            offSetLoader: false,
            title: '',
            editIndex: '',
            editPost: {},
            challengeArray: this.props.dataFromParent,
            basicArray: this.props.basicData,
            winsArray: [],
            winsArrayData: [],
        };
        this.premium = this.premium.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
    }

    editmodalVisible() {
      this.setState({editModal: !this.state.editModal})
    }

    onedit(data, index) {
      this.setState({editPost: data});
      this.setState({editIndex: index});
      this.editmodalVisible();
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
        console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
            this.getWins();
        }
    }

    async getWins() {
      this.setState({offSetLoader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/get-small-win-all';
      var parameters = {
          challenge_id:this.state.challenge_id,
          page_size: 6,
          feature_id:5,
          data_offset : 0,
          day: this.state.basicArray.details.day,
          week: this.state.basicArray.details.week,
          uid:this.state.UID,
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
                  if(dataobject.status) {
                    this.setState({offSetLoader:false});
                    this.setState({feature_category_id: dataobject.feature_category_id});
                    this.setState({winsArray: dataobject.small_win_all});
                    this.setState({title: dataobject.feature_title});
                    this.setState({winsStatus: dataobject.user_today_actions});
                  }
                  else {
                    alert('Something went wrong.');
                  }

              }
          )
          .catch((error) => {
              alert(' Exception causes' + error)
          })
    }

    refresh=(data)=> {
      this.setState({UID: data.uid});
      this.getWins();
      this.props._handeleDayChange();
    }

    editUpdateData (dataGet) {
      this.state.winsArray[this.state.editIndex] = dataGet;
      this.setState({winsArray: this.state.winsArray});
    }


    async messageHighFive(data, ind) {
             const url = global.base_url_live+'v1/api/submit-small-win-action';
             const token_ = await SecureStore.getItemAsync('token');

             var parameters = {
                 token: JSON.parse(token_),
                 uid: this.state.UID,
                 challenge_id:this.state.challenge_id,
                 feature_id:5,
                 week: this.state.basicArray.details.week,
                 type: 'l',
                 linked_comment_id: data.comment_id,
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
                           this.state.winsArray[ind].if_you_high_fived = true;
                           var count = parseInt(parseInt(this.state.winsArray[ind].total_high_fives) + 1);
                           this.state.winsArray[ind].total_high_fives = count;
                           this.setState({winsArray: this.state.winsArray});
                         }
                         else {
                             alert(dataobject.message);
                         }
                     }
                 )
                 .catch((error) => {
                 })
    }

    renderRowComment(item, rowmap){
           return(
             <View style={styles.win_user_itemsview}>

             <View style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  paddingHorizontal: 15,
                 flexDirection: 'row',
                 alignItems: 'center',
                 width: '100%'
             }}>
             <View style={{flex: 0.16, backgroundColor: 'transparent'}}>
                 <Image source={{uri:item.profile_pic}}
                        style={{width: 40, height: 40, borderRadius: 40 / 2, overflow: "hidden", marginTop: 12}}>
                 </Image>
            </View>
            <View style={{flex: 0.84, backgroundColor: 'transparent', marginLeft: 2}}>
                 <Text style={{
                     fontFamily: 'PoppinsBold',
                     fontSize: 14,
                     marginTop: 10,
                     marginLeft: 0
                 }}numberOfLines={1}> {item.name}
                 </Text>
                 <Text style={{
                     color: 'gray',
                     fontFamily: 'PoppinsRegular',
                     fontSize: 10,
                     marginTop: -1,
                     marginLeft: 0
                 }}> {item.time}
                 </Text>
            </View>
             </View>

             <View style={{backgroundColor: 'transparent'}}>
                 <Text style={{
                     color: '#000',
                     fontSize: 11,
                     minHeight: 82,
                     marginTop: 10,
                     fontFamily: 'PoppinsSemiBold',
                     marginHorizontal: 10
                 }}numberOfLines={4}>
                     {item.comment}
                 </Text>
             </View>

             <View style={{flex: 1, flexDirection: 'row', paddingBottom: 15, marginTop: 0, backgroundColor: 'transparent', paddingVertical: 5, paddingHorizontal: 15}}>
               <View style={{flex: 0.44, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center'}}>

               { item.if_you_high_fived &&
                 <View style={{backgroundColor: '#1BBEFD', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High Five</Text></View>
               }
               {!item.if_you_high_fived &&
               <TouchableOpacity onPress={() => {if(this.state.featureType == 0) {
                 this.messageHighFive(item, rowmap);
               }
               else {
                 this.premium();
               }}}
               >
                 <View style={{backgroundColor: '#626E77', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15}}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High Five</Text></View>
               </TouchableOpacity>
               }
                   <View style={{backgroundColor: 'transparent', marginLeft: 6}}>
                   <ImageBackground source={boxIcon} resizeMode='contain' style={{width: 70, height: 30}}>
                   <View style={{flexDirection: 'row', flex: 1}}>
                         <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 10}}>
                         {item.if_you_high_fived &&
                             <Image source={handsBlue} style={{height: 15, width: 15}}>
                             </Image>
                         }
                         {!item.if_you_high_fived &&
                             <Image source={handsBlack} style={{height: 15, width: 15}}>
                             </Image>
                         }
                         </View>

                         <View style={{flex: 0.5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end', marginRight: 8}}>
                          {item.if_you_high_fived &&
                             <Text style={{color:'#1BBEFD',
                                 fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                             }}>{item.total_high_fives}</Text>
                          }
                          {!item.if_you_high_fived &&
                             <Text style={{color:'gray',
                                 fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium',
                             }}>{item.total_high_fives}</Text>
                          }
                         </View>
                   </View>
                   </ImageBackground>
                   </View>
               </View>

               <View style={{flex: 0.46, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center'}}>
               </View>
                <View style={{flex: 0.10, flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'center'}}>
                {this.state.UID == item.uid &&
                  <Menu>
                    <MenuTrigger>
                    {this.state.featureType == 0 &&
                      <View style={{backgroundColor: 'transparent', paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10}}>
                        <Image source={dagger} style={{width: 6, height: 22}}>
                        </Image>
                      </View>
                    }
                    {this.state.featureType !== 0 &&
                      <TouchableOpacity onPress={() => this.premium()}>
                          <View style={{backgroundColor: 'transparent', paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10}}>
                            <Image source={dagger} style={{width: 6, height: 21}}>
                            </Image>
                          </View>
                      </TouchableOpacity>
                    }

                    </MenuTrigger>
                    <MenuOptions>

                      <MenuOption onSelect={() => this.onedit(item, rowmap)}>
                        <View style={{paddingTop: 8, backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, flexDirection: 'row'}}>
                        <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                        <Image source={editblack} style={{height: 12, width: 10, marginTop: 0}}/>
                        </View>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                  }
               </View>

             </View>



             </View>
         )

   }

    render() {
        var dataholder = this.state.challengeArray;
        const {navigate} = this.props.nav;
        var winsArray = this.state.winsArray;
        var chlObject = {'challenge_id':this.state.challenge_id, 'feature_category_id': this.state.feature_category_id, 'day': this.state.basicArray.details.day, 'week': this.state.basicArray.details.week, 'feature_name': dataholder.feature_name};


        return (
          <View style={{borderBottomWidth: 1, borderTopWidth: 1, marginTop: 15, paddingVertical: 15, borderColor: '#F6D000', backgroundColor: 'transparent', marginBottom: 15}}>

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

          <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
          hasBackdrop = {true} isVisible={this.state.editModal} >
          <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
            <View style={{padding: 0}}>
                  <TouchableOpacity onPress={this.editmodalVisible}>
                    <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                      <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                    </View>
                  </TouchableOpacity>
                  <Text style={{fontFamily: 'PoppinsRegular', fontSize: 17, textAlign: 'center', borderBottomWidth: 1, borderBottomColor:'lightgray', paddingBottom: 7}}>Edit Share a Win</Text>
                  <ScrollView>
                    <ModalUpdateShareWin
                    updateContent= {this.state.editPost}
                    week = {this.state.basicArray.details.week}
                    challengeId = {this.state.challenge_id}
                    onGoBack={this.editUpdateData}
                    onPopUp={this.editmodalVisible}
                    nav = {this.props.nav}/>
                  </ScrollView>
            </View>
          </View>
          </Modal>

          <View style={styles.win_view}>
          <TouchableOpacity
              onPress={()=>{
                if(this.state.featureType == 0) {
                  navigate('ShareAWin', {DATA:dataholder, challenge_details:chlObject, onGoBack: this.refresh})
                }
                else {
                  this.premium();
                }
              }}
          >
              <View style={{flexDirection: 'row', flex: 1, paddingBottom: 5, backgroundColor: 'transparent'}}>
                  <View style={{flex: 0.9, backgroundColor: 'transparent'}}>
                      <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                          {this.state.winsStatus == 0 &&
                                <Image source={checkgray}
                                       style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                </Image>
                          }
                          {this.state.winsStatus > 0 &&
                                <Image source={checkyellow}
                                       style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                </Image>
                          }

                          <Text style={{
                              marginTop: 0, marginLeft: 5, fontSize: 14,
                              fontFamily: 'PoppinsRegular', color: '#F6D000',
                          }}>{dataholder.feature_name.toUpperCase()}</Text>
                      </View>
                  </View>
                  <View
                      style={{flex: 0.1, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                      {this.state.featureType == 1 &&
                          <Image source={unlockgray}
                             style={{width: 35, height: 35, marginRight: 0}}>
                          </Image>
                      }
                      {this.state.featureType == 0 &&
                          <Image source={nextarrow}
                                 style={{width: 12, height: 20, alignItems: 'flex-end', marginRight: 0}}>
                          </Image>
                      }
                  </View>
                    </View>


                    <View style={{backgroundColor: 'transparent'}}>
                    <Text style={{
                        fontFamily: 'PoppinsBold',
                        color: '#000',
                        fontSize: 13,
                        marginLeft: 0,
                        marginTop: 0,
                    }}>{this.state.title} </Text>
                    <Text style={{
                        marginLeft: 0,
                        marginTop: 0,
                        color: '#000',
                        padding: 0,
                        fontFamily: 'PoppinsBold',
                        fontSize: 13
                    }}>{dataholder.points} Points </Text>
                    </View>
                  </TouchableOpacity>


              {this.state.offSetLoader &&
                      <View style={{backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                          <ActivityIndicator size="large"/>
                      </View>
              }



              <View style={{
                  flexDirection: 'row',
                  marginHorizontal: 0,
                  borderRadius: 10,
                  marginTop: 8
              }}>

              {this.state.winsArray == 0  &&
                <View style={{backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems:'center'}}>
                    <Text style={{fontFamily: 'PoppinsLight'}}>No wins available now.</Text>
                </View>
              }

              {this.state.featureType == 1 &&
                  <TouchableOpacity onPress={() => this.premium()}>
                      <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}
                                data={this.state.winsArray}
                                renderItem={({item, index}) => this.renderRowComment(item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                />
                  </TouchableOpacity>
              }
              {this.state.featureType == 0 &&
                  <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} horizontal={true}
                            data={this.state.winsArray}
                            renderItem={({item, index}) => this.renderRowComment(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            />
              }

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
        marginBottom: 0, marginTop: 0,
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
        width: 300,
        //height: 145,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 3,
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
