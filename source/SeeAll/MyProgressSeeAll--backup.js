import React from 'react'
import {Dimensions, Alert, AsyncStorage, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import SideMenu from 'react-native-side-menu';
import ContentView from '../ContentView';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import Loader from "../loader/Loader";
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

const injoycirclelogo = require('../../images/fullimagewithtext.png');
const circleroundprogress = require('../../images/circle-round-progress.png');
const headerback = require('../../images/image-8.png')
const orangearrow = require('../../images/orangearrow.png')
const menuImg = require('../../assets/menu.png')
const profile = require('../../images/image-9.png')
const calendar = require('../../assets/calendar.png')
const library = require('../../assets/gallary.png')
const user = require('../../assets/user.png')
const arrowfor = require('../../images/backarrow.png');
const shoulderyellow = require('../../assets/shoulderyellow.png')
const documentsgreen = require('../../assets/documentsgreen.png')
const volume = require('../../assets/volume.png')
const trophy = require('../../assets/trophy.png')
const trophylightyellow = require('../../images/trophylightyellow.png')
const trophydarkgray = require('../../images/trophydarkgray.png')
const trophylightgray = require('../../images/trophylightgray.png')
const trophydarkyellow = require('../../images/trophydarkyellow.png')

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserName = async () => {
    return await SecureStore.getItemAsync('USERNAME');
};
const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const getChallangeId = async () => {
    return await SecureStore.getItemAsync('USERCHALLANGEIDNEW');

}

const renderTabBar = props => (
    <TabBar
        {...props}

        activeColor='#19bffd'
        inactiveColor='#000000'
        indicatorStyle={{backgroundColor: '#19bffd'}}
        labelStyle={{color: 'black', fontSize: 15, fontFamily: 'PoppinsSemiBold'}}
        getLabelText={({route}) => route.title}
        style={{
            marginHorizontal: 0,
            backgroundColor: 'transparent', height: 45, borderRadius: 0,
            elevation: 8,
            borderBottomColor: 'rgba(211,211,211,0.58)',
            borderBottomWidth: 0.5,
            shadowColor: "gray",
            shadowOpacity: 0.1,
            shadowRadius: 2,
            shadowOffset: {
                height: 0.5,
                width: 1,
            }
        }}
    />
);

export default class MyProgressSeeAll extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            routes: [
                {key: 'first', title: 'Monthly'},
                {key: 'second', title: 'Overall'},
            ],
            index: this.props.navigation.state.params.index,
            selectedItem: 'DashBoard',
            token: '',
            challangeId: '',
            userId: '',
            data_list: [],
            data_list_overall: [],
            offSetLoader: true,
            imageArray: [shoulderyellow, documentsgreen, volume, trophy],
            imageProfile: '',
            userName: '',
            userTrophy: 'Bronze',
            userTrophyOverAll: 'Bronze',
            weeklyActions: this.props.navigation.state.params.total_action_monthly,
            userPointsMonthly: 0,
            userPointsOverAll: 0,
            userFbProfile: null,
            overAllActions: this.props.navigation.state.params.total_action_overAll,
            checkInCount: 0
        };


        this.toggle = this.toggle.bind(this);
    }

    async componentDidMount() {

      var cntGraph = this.calculateWeekly(this.state.weeklyActions);
      var cntGraph1 = this.calculateWeekly(this.state.overAllActions);
      this.setState({weeklyActions: cntGraph});
      this.setState({overAllActions: cntGraph1});

        getAccessToken().then(token =>
            this.setState({token: token}),
        );

        getUserId().then(id =>
            this.setState({userId: id}),
        );
        getChallangeId().then(id =>
            this.setState({challangeId: id}),
        )
        getUserName().then((name) =>
            this.setState({userName: JSON.parse(name)})
        )
        this.getFacebookProfilePic();

        if(this.state.index == 0) {
          this.setState({offSetLoader: true});
          this.getMonthlyApiData();
        }
        else {
          this.setState({offSetLoader: true});
          this.getOverallApiData();
        }

    }

    async getOverallApiData() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-my-progress-total-actions-trophy';
        var parameters = {
            token: JSON.parse(token_),
            challenge_id: this.state.challangeId,
            uid: this.state.userId,
            trophy_action_type: "a",
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
                    //  alert(JSON.stringify(dataobject));
                    await this.InheritedDataOverAll(dataobject);
                }
            )
            .catch((error) => {
            })

    }

    async getMonthlyApiData() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-my-progress-total-actions-trophy';
        var parameters = {
            token: JSON.parse(token_),
            challenge_id: this.state.challangeId,
            uid: this.state.userId,
            trophy_action_type: "m",
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
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })

    }


    InheritedData(dataObject) {
        if (dataObject.status) {
            var data = dataObject.content.trophy.all;
            this.setState({userPointsMonthly: dataObject.content.actions.month_actions});
            this.setState({data_list: data, offSetLoader: false});
            this.setState({userTrophy: dataObject.content.trophy.user});
            //dataObject.content.actions.week_actions
        } else {
            alert('Failed.')
        }
    }


    InheritedDataOverAll(dataObject) {
        if (dataObject.status) {
            var data = dataObject.content.trophy.all;
            this.setState({userPointsOverAll: dataObject.content.actions.total_actions});
            this.setState({data_list_overall: data, offSetLoader: false});
            this.setState({userTrophyOverAll: dataObject.content.trophy.user});
        } else {
            alert('Failed.')
        }
    }

    calculateWeekly(weekly) {
      if(weekly <= 200) {
        var total = (weekly/200)*30;
        return total;
      }else if (weekly <= 750) {
        var total = ((weekly/750)*30)+30;
        return total;
      }else if (weekly <= 2000) {
        var total = ((weekly/2000)*40)+60;
        return total;
      }else {
        var total = 100;
        return total;
      }

    }

    handleIndexChange = index => {
      this.setState({index});
      if(index == 0) {
        this.setState({offSetLoader: true});
        this.getMonthlyApiData();
      }
      else {
        this.setState({offSetLoader: true});
        this.getOverallApiData();
      }
  };


    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    updateMenuState(isOpen) {
        this.setState({isOpen});
    }

    onMenuItemSelected = item =>
        this.setState({
            isOpen: false,
            selectedItem: item == 'logout' ? this.logOutWithToken() : this.props.navigation.navigate(item),
        });


    loaderView = () => {
        return (
          <View style={{zIndex: 1, backgroundColor: 'transparent'}}>
              <Spinner
                  visible={this.state.offSetLoader}
                  textContent={''}
                  color={'black'}
              />
          </View>
        )
    };


    selectedTrophy(type){
        if(type =='Bronze'){
             return trophylightyellow;
        }else if(type == 'Silver'){
            return  trophylightgray;
        }else if(type == 'Gold') {
            return trophydarkyellow;
        }else  if(type == 'Platinum'){
            return trophydarkgray;
        }
    }

    async getFacebookProfilePic() {
        let userId = '';
        try {
            userId = await AsyncStorage.getItem('FACEBOOKPROFILE');
            console.log("URLLLL" + userId);
        } catch (error) {
            // Error retrieving data
            console.log("URLLLL" + error.message);
        }
        this.setState({userFbProfile: JSON.parse(userId)})
    }

    setProfile() {
        if (this.state.userProfile != null) {
            return this.state.userProfile
        } else if (this.state.userFbProfile == null) {
            return profile
        } else {
            return profile
        }
    }

    returnText(index){
        if(index == 0){
            return '0-200';
        }else if(index == 1){
            return  '201-750';
        }else if (index == 2){
            return  '751-2K'
        }else if ((index == 3)){
            return '2K+'
        }
    }

    rednerTrophiesMonthly(){
        return this.state.data_list.map((item,rowmap)=>{
            return(

                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        margin: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ImageBackground source={this.selectedTrophy(item)}
                                         style={{
                                             width: 60,
                                             height: 52,
                                             alignSelf: 'center',
                                             marginRight: 0,
                                             margin: 0
                                         }}
                        ></ImageBackground>
                        <Text style={{marginTop: 5, fontFamily: 'PoppinsSemiBold', fontSize: 16}}>{this.returnText(rowmap)}</Text>
                    </View>

            )
        })
    }

    rednerTrophiesAll(){
        return this.state.data_list_overall.map((item,rowmap)=>{
            return(

                    <View style={{
                        flex: 1,
                        backgroundColor: 'white',
                        margin: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ImageBackground source={this.selectedTrophy(item)}
                                         style={{
                                             width: 60,
                                             height: 52,
                                             alignSelf: 'center',
                                             marginRight: 0,
                                             margin: 0
                                         }}
                        ></ImageBackground>
                        <Text style={{marginTop: 5, fontFamily: 'PoppinsSemiBold', fontSize: 16}}>{this.returnText(rowmap)}</Text>
                    </View>

            )
        })
    }

    SecondRoute = () => {
      const {userPointsOverAll,data_list_overall} = this.state;
        return (
          <View style={{paddingHorizontal: 8, flex: 1}}>

              <View style={{
                  backgroundColor: 'transparent',
                  marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
              }}>
                  <ImageBackground resizeMode='contain' style={{height: 90, width: screenWidth}} source={injoycirclelogo}>


                  </ImageBackground>

              </View>

              <View style={{
                  flex: 0.72, backgroundColor: 'transparent', alignItems: 'center', marginTop: 0,
                  padding: 0, justifyContent: 'center'
              }}>
                  <ImageBackground
                      style={{
                          width: 350,
                          alignSelf: 'center',
                          alignItems: 'center',
                          justifyContent: 'center'
                      }} resizeMode={"contain"}
                      source={circleroundprogress}>


                      <AnimatedCircularProgress
                          size={250}
                          width={25}
                          duration={3000}
                          fill={this.state.overAllActions}
                          //fill={75}
                          ref={(ref) => this.circularProgressSecond = ref}
                          tintColor="#f7d21b"
                          backgroundColor="white"
                          arcSweepAngle={270}
                          rotation={225}
                          lineCap="square"
                          padding={15}
                          //renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
                      />
                      {this.state.offSetLoader &&
                      this.loaderView()
                      }
                      <View style={{
                          position: 'absolute', width: '100%', height: '100%', top: 20,
                          backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'
                      }}>
                          <Text style={{
                              fontSize: 16,
                              fontFamily: 'PoppinsBold',
                              color: '#fff',
                              marginTop:0
                          }}>
                              My Total</Text>
                          <Text
                              style={{fontSize: 16, fontFamily: 'PoppinsBold', color: '#fff', marginTop: 0}}>
                              Actions</Text>
                          <Text
                              style={{fontSize: 30, fontFamily: 'PoppinsBold', color: '#fff', marginTop: 5, marginBottom: 0}}>
                              {userPointsOverAll}</Text>

                              <ImageBackground source={this.selectedTrophy(this.state.userTrophyOverAll)}
                                               style={{
                                                   width: 60,
                                                   height: 52,
                                                   alignSelf: 'center',
                                                   marginTop: 10,
                                                   margin: 0
                                               }}
                              ></ImageBackground>

                      </View>

                  </ImageBackground>
              </View>
              <View style={{flex: 0.03, backgroundColor: 'transparent'}}></View>
              <View style={{
                  flex: 0.25, backgroundColor: 'transparent', flexDirection: 'row',
                  marginBottom: 0, paddingHorizontal: 25
              }}>
              {this.rednerTrophiesAll()}
              </View>

          </View>
        )
    }


    FirstRoute = () => {
      const {userPointsMonthly,data_list} = this.state;
        return (
          <View style={{paddingHorizontal: 8, flex: 1}}>

              <View style={{
                backgroundColor: 'transparent',
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                  <ImageBackground resizeMode='contain' style={{height: 90, width: screenWidth}} source={injoycirclelogo}>


                  </ImageBackground>

              </View>

              <View style={{
                  flex: 0.72, backgroundColor: 'transparent', alignItems: 'center', marginTop: 0,
                  padding: 0, justifyContent: 'center'
              }}>
                  <ImageBackground
                      style={{
                          width: 350,
                          alignSelf: 'center',
                          alignItems: 'center',
                          justifyContent: 'center'
                      }} resizeMode={"contain"}
                      source={circleroundprogress}>


                      <AnimatedCircularProgress
                          size={250}
                          width={25}
                          duration={3000}
                          fill={this.state.weeklyActions}
                          //fill={25}
                          ref={(ref) => this.circularProgressFirst = ref}
                          tintColor="#f7d21b"
                          backgroundColor="white"
                          arcSweepAngle={270}
                          rotation={225}
                          lineCap="square"
                          padding={15}
                          //renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="10" fill="blue" />}
                      />
                      {this.state.offSetLoader &&
                      this.loaderView()
                      }
                      <View style={{
                          position: 'absolute', width: '100%', height: '100%', top: 20,
                          backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'
                      }}>
                          <Text style={{
                              fontSize: 16,
                              fontFamily: 'PoppinsBold',
                              color: '#fff',
                              marginTop:0
                          }}>
                              My Monthly</Text>
                          <Text
                              style={{fontSize: 16, fontFamily: 'PoppinsBold', color: '#fff', marginTop: 0}}>
                              Actions</Text>
                          <Text
                              style={{fontSize: 30, fontFamily: 'PoppinsBold', color: '#fff', marginTop: 5, marginBottom: 0}}>
                              {userPointsMonthly}</Text>

                              <ImageBackground source={this.selectedTrophy(this.state.userTrophy)}
                                               style={{
                                                   width: 60,
                                                   height: 52,
                                                   alignSelf: 'center',
                                                   marginTop: 10,
                                                   margin: 0
                                               }}
                              ></ImageBackground>

                      </View>

                  </ImageBackground>
              </View>
              <View style={{flex: 0.03, backgroundColor: 'transparent'}}></View>
              <View style={{
                  flex: 0.25, backgroundColor: 'transparent', flexDirection: 'row',
                  marginBottom: 0, paddingHorizontal: 25
              }}>
              {this.rednerTrophiesMonthly()}
              </View>

          </View>
        )
    }


    render() {
        const menu = <ContentView
            userProfile={this.state.userFbProfile}
            userName={this.state.userName}
            onItemSelected={this.onMenuItemSelected}/>;

        return (

            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}>

                <View style={styles.view_container}>
                    {/* Header View */}
                    <View style={styles.header_view}>
                        <ImageBackground source={headerback} style={styles.header_image}>
                            {/* Header items View */}
                            <View style={styles.header_items}>
                                <TouchableOpacity style={{flex: 0.20,}} onPress={()=>this.props.navigation.goBack()}>
                                    <Image source={arrowfor} style={styles.menu}>
                                    </Image>
                                </TouchableOpacity>

                                <View style={{
                                    flexDirection: 'column',
                                    marginLeft: 0,
                                    backgroundColor: 'tranaparent',
                                    flex: 0.65,
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontFamily: 'PoppinsBold', color:'#fff', fontSize: 20, alignSelf: 'center'}}>My
                                        Progress</Text>
                                    {/*<View style={{flexDirection: 'row', marginTop: -5}}>*/}
                                    {/*    <Text style={{fontFamily: 'PoppinsBold'}}>120</Text>*/}
                                    {/*    <Text style={{fontFamily: 'PoppinsRegular'}}> Points*/}
                                    {/*    </Text>*/}
                                    {/*</View>*/}
                                </View>



                                {/*<View style={{
                                    flex: 0.15,
                                    alignItems: 'flex-end',
                                    marginRight: 15,
                                    backgroundColor: 'tranaparent'
                                }}>
                                    {this.state.userFbProfile == null &&
                                    <Image source={profile} style={styles.profile}>
                                    </Image>
                                    }
                                    {this.state.userFbProfile != null &&
                                    <Image source={{uri: this.state.userFbProfile}} style={styles.profile}>
                                    </Image>
                                    }
                                </View>*/}

                            </View>
                        </ImageBackground>

                    </View>
                    {/* Ended Header View */}


                    <TabView navigationState={this.state} style={{
                        backgroundColor:
                            'transparent', marginTop: 0, marginHorizontal: 0,
                    }}
                             renderScene={SceneMap({
                                 first: this.state.offSetLoader ? this.loaderView : this.FirstRoute,
                                 second: this.state.offSetLoader ? this.loaderView : this.SecondRoute,
                             })}
                             tabStyle={{flex: 1, backgroundColor: 'red'}}
                             onIndexChange={index => this.handleIndexChange(index)}
                             renderTabBar={renderTabBar}
                             initialLayout={{width: Dimensions.get('window').width}}
                    />

                    {/* Started Tab Bar */}
                    <View style={styles.tabbar_view}>
                        {/* <View style={{flex:1,height:10,backgroundColor:'red',width:50}}>
                            </View> */}
                        <View style={styles.tabbar_inner_view}>
                            <View style={styles.tabbar_inner_view2}>
                                <View style={{flexDirection: 'column', justifyContent: 'center', marginLeft: -15}}>
                                    <TouchableOpacity style={{alignItems: 'center', marginTop: 15}}
                                                      onPress={() => this.props.navigation.navigate('DashBoard')}>
                                        <Image source={calendar} style={{width: 24, height: 24, resizeMode: 'contain'}}>
                                        </Image>

                                        <View style={{
                                            width: 35,
                                            marginLeft: -2,
                                            backgroundColor: 'white',
                                            height: 5,
                                            marginTop: 10
                                        }}>
                                        </View>
                                        <Text style={{
                                            marginBottom: 2,
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: 13,
                                            marginTop: -15
                                        }}>
                                            Today </Text>

                                    </TouchableOpacity>
                                </View>

                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 10
                                }}>
                                    <TouchableOpacity style={{alignItems: 'center', marginTop: 5}}
                                                      onPress={() => this.props.navigation.navigate('Library')}>
                                        <Image source={library} style={{width: 24, height: 24, resizeMode: 'contain'}}>
                                        </Image>
                                        <View style={{
                                            width: 35,
                                            marginLeft: -2,
                                            backgroundColor: 'white',
                                            height: 5,
                                            marginTop: 10
                                        }}>
                                        </View>
                                        <Text style={{
                                            marginBottom: 2,
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: 13,
                                            marginTop: -15
                                        }}>
                                            Library </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: -15
                                }}>
                                    <TouchableOpacity style={{alignItems: 'center', marginTop: 5}}
                                                      onPress={() => this.props.navigation.navigate('MyProgress')}>
                                        <Image source={user} style={{width: 24, height: 24, resizeMode: 'contain',}}>
                                        </Image>
                                        <View style={{
                                            width: 80,
                                            marginLeft: -2,
                                            backgroundColor: '#84d3fd',
                                            height: 5,
                                            marginTop: 12
                                        }}>
                                        </View>
                                        <Text style={{
                                            marginBottom: 2,
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: 13,
                                            marginTop: -18
                                        }}>
                                            My Progress </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </View>
                    {/* Ended Tab Bar */}

                </View>

                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>

            </SideMenu>

        )
    }

    async logOutWithToken() {

        this.setState({showloader: true})

        const url_logout = global.base_url_live+'v1/api/app-logout'

        //alert(JSON.parse(this.state.token))
        // return
        var parameters = {
            token: JSON.parse(this.state.token)
        };
        var token = `Bearer ${JSON.parse(this.state.token)}`;
        fetch(url_logout,
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

                    if (dataobject.status == 1) {
                        this.setState({email: ''})
                        this.setState({password: ''})
                        this.setState({showloader: false})
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(false));
                        this.props.navigation.navigate('Login')
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
                this.setState({email: ''})
                this.setState({password: ''})
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])


                console.log("Exception on login time is ===", error)
                // alert(error);
            })
    }

}

const styles = StyleSheet.create({

    view_container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 90,

    },
    boxtext: {
        marginTop: 7, color: 'white', fontSize: 20, fontFamily: 'PoppinsBold', shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.11,
        shadowRadius: 2.22,

        elevation: 3,
    },

    boxtext1: {
        marginTop: 4,
        color: 'white',
        fontSize: 35, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.11,
        shadowRadius: 2.22,
        elevation: 3,
        fontFamily: 'PoppinsBold'
    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: 35,
    },
    header_image: {
        flex: 1,
        height: 90
    },

    menu: {

        width: 25,
        height: 25,
        marginLeft: 15,
        //transform: [{ rotate: '180deg' }]

    },

    profile: {
        width: 55,
        height: 55, borderRadius: 55 / 2
    },

    boxc: {
        flex: 0.47, backgroundColor: '#7ac5f9', borderRadius: 20, shadowColor: "#000", alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    myprogress_view: {
        marginTop: 10,
        marginHorizontal: 17
    },

    item_view: {
        height: 130,
        width: 130, alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 18,

        marginTop: 20,
    },


    item_image: {
        alignSelf: 'center',
        margin: 1, alignItems: 'center',
        width: 128,
        elevation: 3,
        shadowColor: "gray",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 0.5,
            width: 1,
        },
        height: 128,
    },


    keys_view: {
        marginTop: 10,
        height: 70,
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 3,
        alignItems: 'center',
        justifyContent: 'space-between',

        marginHorizontal: 15,
        borderRadius: 10,
        elevation: 9,
        shadowColor: "gray",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
    },

    tabbar_view: {

        flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-around', height: 65,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
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
        height: 63
        ,
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
    }
});
