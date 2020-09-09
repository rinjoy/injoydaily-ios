import React from 'react'
import {Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import * as SecureStore from "expo-secure-store";
import Spinner from 'react-native-loading-spinner-overlay';
import SideMenu from "react-native-side-menu";
const tabcalendar = require('../../assets/calendar.png');
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const one = require('../../assets/1.png');
const two = require('../../assets/2.png');
const three = require('../../assets/3.png');
const four = require('../../assets/4.png');
const five = require('../../assets/5.png');

const camera = require('../../assets/camerablue.png');

const bronze = require('../../assets/bronze.png');
const silver = require('../../assets/silver.png');
const gold = require('../../assets/gold.png');

const profile = require('../../images/image-9.png');
const calendar = require('../../assets/calendar.png');
const library = require('../../assets/gallary.png');
const user = require('../../assets/user.png');
const backarrow = require('../../assets/backarrow.png');
const image11 = require('../../images/image-11.png');
const orangearrow = require('../../images/orangearrow.png');
const defaultLogo = require('../../images/defaultLogo.png');
const image12 = require('../../images/image-12.png');
const image13 = require('../../images/image-13.png');
const hands = require('../../images/handsblue.png');
const commentblue = require('../../images/commentblue.png');
const cellimage = require('../../images/image-19.png');
const challenge = require('../../images/image-10.png');
const checkblue = require('../../assets/checkblue.png');
const checkgray = require('../../images/checkgray.png');
const nextarrow = require('../../assets/nextarrow.png');


const renderTabBar = props => (
    <TabBar
        {...props}

        activeColor='#19bffd'
        inactiveColor='#000000'
        indicatorStyle={{backgroundColor: '#19bffd'}}
        labelStyle={{color: 'black', fontFamily: 'PoppinsSemiBold'}}
        getLabelText={({route}) => route.title}
        style={{
            marginHorizontal: 18,
            backgroundColor: 'white', height: 45, borderRadius: 5,
            elevation: 8, borderColor: 'rgba(211,211,211,0.58)', borderWidth: 0.5,
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


const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
export default class LeaderShipSecond extends React.Component {


    constructor(props) {
        super(props);

        //alert(JSON.stringify(this.props.navigation.state.params))
        this.state = {
            index: this.props.navigation.state.params.index,
            routes: [
                {key: 'first', title: 'Points'},
                {key: 'second', title: 'Streaks'},

            ],
            offSetLoader: false,
            data_list: [],
            streaks_list: [],
            uid: this.props.navigation.state.params.uId,
            day: this.props.navigation.state.params.day,
            challenge_id: this.props.navigation.state.params.cId,
            week: this.props.navigation.state.params.week,
            firstThreeFR: [],
            FirstThreeSR: [],
        }
    }




    componentDidMount() {
        //  alert(this.state.week)
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );
        if(this.state.index == 0) {
          this.getLeaderBoardData();
        }
        else {
          this.getStreakBoardData();
        }

        // setTimeout(() => {
        //     this.getLeaderBoardData();
        // }, 100);

    }


    async getLeaderBoardData(){

        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-top-leaderboard-users-points-all';

        var parameters = {
            uid: this.state.uid,
            challenge_id: this.state.challenge_id,
            day: this.state.day,
            week: this.state.week,
            page_size: 100,
            data_offset: 0
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
//                    alert(JSON.stringify(dataobject))
                    this.inheritedData(dataobject);
                }
            )
            .catch((error) => {
                alert(' Exception causes' + error)
            })

    }


    async getStreakBoardData(){

        this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-top-leaderboard-users-streaks-all';

        var parameters = {
            uid: this.state.uid,
            challenge_id: this.state.challenge_id,
            day: this.state.day,
            week: this.state.week,
            page_size: 100,
            data_offset: 0
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
                    // console.log('Streaks', dataobject);
                    this.inheritedDataStreaks(dataobject);
                }
            )
            .catch((error) => {
                alert(' Exception causes' + error)
            })

    }

    shiftBack() {
        var obj={};
        this.props.navigation.state.params.onGoBack(obj);
        this.props.navigation.goBack();
    }


    inheritedDataStreaks(dataObject) {
        // console.log('sdasdasd', dataObject);
        if (dataObject.status) {
          var i;
          var arr = [];
          for (i = 0; i < dataObject.leaderboard_top_three.length; i++) {
              if(dataObject.leaderboard_top_three.length == 3) {
                  arr[0] = dataObject.leaderboard_top_three[1];
                  arr[1] = dataObject.leaderboard_top_three[0];
                  arr[2] = dataObject.leaderboard_top_three[2];
              }
              if(dataObject.leaderboard_top_three.length == 2) {
                  arr[0] = dataObject.leaderboard_top_three[1];
                  arr[1] = dataObject.leaderboard_top_three[0];
              }
              if(dataObject.leaderboard_top_three.length == 1) {
                  arr[1] = dataObject.leaderboard_top_three[0];
              }

          }

            this.setState({FirstThreeSR: arr, streaks_list: dataObject.leaderboard_listing})
            this.setState({offSetLoader: false});

        } else {

        }
    }

    inheritedData(dataObject) {
        if (dataObject.status) {

          var i;
          var arr = [];
          for (i = 0; i < dataObject.leaderboard_top_three.length; i++) {

              if(dataObject.leaderboard_top_three.length == 3) {
                  arr[0] = dataObject.leaderboard_top_three[1];
                  arr[1] = dataObject.leaderboard_top_three[0];
                  arr[2] = dataObject.leaderboard_top_three[2];
              }
              if(dataObject.leaderboard_top_three.length == 2) {
                  arr[0] = dataObject.leaderboard_top_three[1];
                  arr[1] = dataObject.leaderboard_top_three[0];
              }
              if(dataObject.leaderboard_top_three.length == 1) {
                  arr[1] = dataObject.leaderboard_top_three[0];
              }
          }
            this.setState({firstThreeFR: arr, data_list: dataObject.leaderboard_listing})
            this.setState({offSetLoader: false});

        } else {

        }

    }

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
    }



    FirstRoute = () => {
        return (
            <ScrollView style={{height: '95%', backgroundColor: "transparent", marginTop: 0}}>
                <View style={{
                    marginHorizontal: 18,
                    height: 230, backgroundColor: 'white', borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
                    elevation: 8, borderColor: 'rgba(211,211,211,0.01)', borderWidth: 1,
                    shadowColor: "gray",
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    shadowOffset: {
                        height: 0.5,
                        width: 1,
                    }
                }}>


                    <ScrollView
                        contentContainerStyle={{justifyContent: 'space-between', flex: 1}}
                        //   style={{justifyContent:'space-between'}}
                        horizontal={true}>
                        {
                            this.renderFirstThreeFR()
                        }

                    </ScrollView>


                    <View style={{
                        height: 40,
                        backgroundColor: 'transparent',
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{flex: 0.55}}></View>
                        <View style={{
                            flex: 0.45,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{marginLeft: 10, fontFamily: 'PoppinsSemiBold', fontSize: 15}}>Points</Text>
                            <Text style={{marginRight: 15, fontFamily: 'PoppinsSemiBold', fontSize: 15}}>Tickets</Text>
                        </View>
                    </View>
                </View>
                <View>

                    <ScrollView
                        contentContainerStyle={{
                            marginHorizontal: 18, marginBottom: 10,
                            backgroundColor: 'white', borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
                            elevation: 3, borderColor: 'rgba(211,211,211,0.01)', borderWidth: 1,
                            shadowColor: "gray",
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            shadowOffset: {
                                height: 0.5,
                                width: 1,
                            }
                        }}
                        automaticallyAdjustContentInsets={"auto"}
                    >
                        {this.renderRow()}
                        <View style={{height: 100, backgroundColor: 'transparent'}}></View>
                    </ScrollView>


                </View>


            </ScrollView>
        )
    }

    renderFirstThreeFR() {
        return this.state.firstThreeFR.map((item, rowMap) => {
            //  console.log("DATA IN RENDERFIRST is ==>"+JSON.stringify(item))
            return (
                <View style={{
                    backgroundColor: 'white',
                    flex: rowMap == 1 ? 1.3 : 1, paddingHorizontal: 0, marginTop: 25
                }}>
                    <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                    {rowMap == 0 &&
                        <Image source={silver} style={{position: 'absolute', top: rowMap == 1 ? -25 : 4, zIndex: 99, height: 30, width: 30}}></Image>
                    }
                    {rowMap == 1 &&
                        <Image source={gold} style={{position: 'absolute', top: rowMap == 1 ? -25 : -2, zIndex: 99, height: 30, width: 30}}></Image>
                    }
                    {rowMap == 2 &&
                        <Image source={bronze} style={{position: 'absolute', top: rowMap == 1 ? -25 : 4, zIndex: 99, height: 30, width: 30}}></Image>
                    }


                        <ImageBackground source={{uri: item.user_details.profile_pic}} style={{
                            height: rowMap == 1 ? 95 : 70,
                            width: rowMap == 1 ? 95 : 70,
                            marginTop: rowMap == 1 ? -5 : 25,
                            shadowColor: 'gray',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                        }} borderRadius={rowMap == 1 ? 95 / 2 : 70 / 2}/>
                        <View style={{alignItems: 'center', marginTop: 0, backgroundColor: 'transparent'}}>
                            <Text style={{
                                marginTop: 10,
                                fontFamily: 'PoppinsRegular',
                                fontSize: 14,
                                marginLeft: 2,
                                marginRight: 2
                            }}
                                  numberOfLines={1}>{item.user_details.name}</Text>
                            <Text style={{marginTop: 5, fontSize: 15, fontFamily: 'PoppinsRegular'}}
                                  numberOfLines={1}>{item.points + ` Points`}</Text>
                        </View>

                    </View>
                </View>
            )

        })


    }

    renderRow() {
        return (
            this.state.data_list.map((data, index) => {
                return (
                    <View style={{
                        marginHorizontal: 0,
                        margin: 0, borderWidth: 1, borderColor: 'white',
                        flexDirection: 'row', marginTop: 0,
                        backgroundColor: 'rgba(211,211,211,0.13)', padding: 0, height: 65, alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 0.10,
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'PoppinsSemiBold',
                                color: 'lightgray',
                                fontSize: 18,
                                marginLeft: 8
                            }}>{(index +3)+1 }</Text>
                        </View>
                        <View style={{
                            flex: 0.50, flexDirection: 'row', backgroundColor: 'transparent',
                            alignItems: 'center', height: 65, borderBottomWidth: 1, borderBottomColor: 'lightgray'
                        }}>
                            <ImageBackground source={{uri: data.user_details.profile_pic}}
                                             style={{height: 45, width: 45, marginLeft: 0}}
                                             borderRadius={45 / 2}></ImageBackground>
                            <View style={{flex: 1, backgroundColor: 'transparent'}}>
                                <Text style={{
                                    marginLeft: 14,
                                    marginRight: 10,
                                    marginTop: 0,
                                    fontSize: 14,
                                    fontFamily: 'PoppinsRegular'
                                }}
                                      numberOfLines={1}>{data.user_details.name}</Text>
                            </View>
                        </View>


                        <View style={{
                            flex: 0.40, height: 65, borderBottomWidth: 1, borderBottomColor: 'lightgray',
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                        }}>



                            <Text style={{marginLeft: 0, fontSize: 15, fontFamily: 'PoppinsRegular'}}>{data.points}</Text>
                            <View style={{
                                flexDirection: 'row',
                                marginRight: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    marginRight: 10,
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: 14, color: '#414141',
                                    marginTop: 4
                                }}>{data.raffle_tickets}</Text>
                                <Image source={four} style={{height: 17, width: 25}}></Image>
                            </View>

                        </View>


                    </View>
                )
            })
        )
    }

    SecondRoute = () => {
        return (
            <ScrollView style={{height: '95%', backgroundColor: "transparent", marginTop: 0}}>
                <View style={{
                    marginHorizontal: 18,
                    height: 230, backgroundColor: 'white', borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
                    elevation: 8, borderColor: 'rgba(211,211,211,0.01)', borderWidth: 1,
                    shadowColor: "gray",
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    shadowOffset: {
                        height: 0.5,
                        width: 1,
                    }
                }}>
                    <ScrollView
                        contentContainerStyle={{justifyContent: 'space-between', flex: 1}}
                        //   style={{justifyContent:'space-between'}}
                        horizontal={true}>
                        {
                            this.renderFirstThreeSR()
                        }

                    </ScrollView>


                    <View style={{
                        height: 35, justifyContent: 'center', marginHorizontal: 0,
                        width: '100%', alignItems: 'flex-end', backgroundColor: 'white'
                    }}>
                        <Text style={{marginRight: 20, fontFamily: 'PoppinsBold', fontSize: 14, marginTop: -12}}>Days in
                            a row</Text>
                    </View>
                </View>
                <View>

                    <ScrollView
                        contentContainerStyle={{
                            marginHorizontal: 18, marginBottom: 10,
                            backgroundColor: 'white', borderBottomRightRadius: 5, borderBottomLeftRadius: 5,
                            elevation: 3, borderColor: 'rgba(211,211,211,0.01)', borderWidth: 1,
                            shadowColor: "gray",
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            shadowOffset: {
                                height: 0.5,
                                width: 1,
                            }
                        }}
                        automaticallyAdjustContentInsets={"auto"}
                    >

                        {this.renderRowSecondRoute()}
                        <View style={{height: 30, backgroundColor: 'transparent'}}></View>
                    </ScrollView>


                </View>


            </ScrollView>
        )
    }


    renderFirstThreeSR() {
        return this.state.FirstThreeSR.map((item, rowMap) => {
            return (
                <View style={{
                    backgroundColor: 'white',
                    flex: rowMap == 1 ? 1.3 : 1, paddingHorizontal: 0, marginTop: 25
                }}>
                    <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                    {rowMap == 0 &&
                        <Image source={silver} style={{position: 'absolute', top: rowMap == 1 ? -25 : 4, zIndex: 99, height: 30, width: 30}}></Image>
                    }
                    {rowMap == 1 &&
                        <Image source={gold} style={{position: 'absolute', top: rowMap == 1 ? -25 : -2, zIndex: 99, height: 30, width: 30}}></Image>
                    }
                    {rowMap == 2 &&
                        <Image source={bronze} style={{position: 'absolute', top: rowMap == 1 ? -25 : 4, zIndex: 99, height: 30, width: 30}}></Image>
                    }


                        <ImageBackground source={{uri: item.user_details.profile_pic}} style={{
                            height: rowMap == 1 ? 95 : 70,
                            width: rowMap == 1 ? 95 : 70,
                            marginTop: rowMap == 1 ? -5 : 25,
                            shadowColor: 'gray',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                        }} borderRadius={rowMap == 1 ? 95 / 2 : 70 / 2}/>
                        <View style={{alignItems: 'center', marginTop: 0, backgroundColor: 'transparent'}}>
                            <Text style={{
                                marginTop: 10,
                                fontFamily: 'PoppinsRegular',
                                fontSize: 14,
                                marginLeft: 2,
                                marginRight: 2
                            }}
                                  numberOfLines={1}>{item.user_details.name}</Text>

                                  <View style={{
                                      flexDirection: 'row',
                                      marginLeft: 10,
                                      alignItems: 'center',
                                      backgroundColor: 'transparent',
                                      height: 35,
                                      padding: 5,
                                      borderRadius: 3,
                                      justifyContent: 'center'
                                  }}>
                                      <Image source={orangearrow} style={{height: 17, width: 14}}></Image>

                                      <Text style={{
                                          marginLeft: -2,
                                          fontFamily: 'PoppinsRegular',
                                          fontSize: 15,
                                          marginTop: 0
                                      }}>{item.streaks}</Text>
                                  </View>
                        </View>

                    </View>
                </View>
            )

        })


    }

    renderRowSecondRoute() {
        return (
            this.state.streaks_list.map((data, index) => {
                return (
                    <View style={{
                        marginHorizontal: 0,
                        marginTop: -2, borderWidth: 1, borderColor: 'white',
                        flexDirection: 'row',
                        backgroundColor: 'rgba(211,211,211,0.13)', padding: 0, height: 65, alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 0.10,
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontFamily: 'PoppinsSemiBold',
                                color: 'lightgray',
                                fontSize: 18,
                                marginLeft: 8
                            }}>{(index +3)+1 }</Text>
                        </View>
                        <View style={{
                            flex: 0.53, flexDirection: 'row', backgroundColor: 'transparent',
                            alignItems: 'center', height: 65, borderBottomWidth: 1, borderBottomColor: 'lightgray'
                        }}>
                            <Image source={{uri: data.user_details.profile_pic}} style={{height: 45, width: 45, marginLeft: 0, borderRadius: 45/2}}></Image>
                            <View style={{flex: 1, backgroundColor: 'transparent'}}>
                                <Text style={{
                                    marginLeft: 14,
                                    marginRight: 10,
                                    marginTop: 0,
                                    fontSize: 14,
                                    fontFamily: 'PoppinsRegular'
                                }}
                                      numberOfLines={1}>{data.user_details.name}</Text>
                            </View>
                        </View>


                        <View style={{
                            flex: 0.37,
                            height: 65,
                            borderBottomWidth: 1,
                            borderBottomColor: 'lightgray',
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                            {/*<Text style={{marginLeft: 0, fontSize: 19, fontFamily: 'calibriBold'}}>{data.tickets}</Text>*/}
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 15,
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                                height: 35,
                                padding: 5,
                                borderRadius: 3,
                                justifyContent: 'center'
                            }}>
                                <Image source={orangearrow} style={{height: 17, width: 14}}></Image>

                                <Text style={{
                                    marginLeft: -2,
                                    fontFamily: 'PoppinsRegular',
                                    fontSize: 15,
                                    marginTop: 0
                                }}>{data.streaks}</Text>
                            </View>

                        </View>


                    </View>
                )
            })
        )
    }

    handleIndexChange = index => {
      this.setState({index});
      if(index==1){
        this.getStreakBoardData();
      }
      else{
        this.getLeaderBoardData();
      }
    //console.log('index', index);
  };

    render() {
        // const {navigate , goback} = this.props.navigation;

        // const renderScene = SceneMap({
        //     first: FirstRoute,
        //     second: SecondRoute,
        // });
        return (
            <View style={styles.view_container}>
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

                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}>Leaderboard
                                </Text>

                            </View>

                            <View style={styles.menu}>
                            </View>
                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}
                <TabView navigationState={this.state} style={{
                    backgroundColor:
                        'white', marginTop: 10, marginHorizontal: 0,
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
                {/* started Tab Bar */}
                <View style={styles.tabbar_view}>
                    {/* <View style={{flex:1,height:10,backgroundColor:'red',width:50}}>
                            </View> */}
                    <View style={styles.tabbar_inner_view}>
                        <View style={styles.tabbar_inner_view2}>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',

                                marginLeft: 0
                            }}>
                                <TouchableOpacity style={{alignItems: 'center', marginTop: 15}}
                                                  onPress={() => [this.props.navigation.navigate('DashBoard')]}>
                                    <Image source={tabcalendar}
                                           style={{width: 24, height: 24, resizeMode: 'contain'}}>
                                    </Image>

                                    <View style={{
                                        width: 35,
                                        marginLeft: -3,
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
                                    <Text style={{marginBottom: 2, fontFamily: 'PoppinsRegular', fontSize: 13}}>
                                        Library </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                flexDirection: 'column',
                                alignItems: 'center', backgroundColor: 'transparent',
                                justifyContent: 'center',

                                marginRight: -15
                            }}>
                                <TouchableOpacity style={{alignItems: 'center', marginTop: 5}}
                                                  onPress={() => this.props.navigation.navigate('MyProgress')}>
                                    <Image source={user} style={{width: 24, height: 24, resizeMode: 'contain',}}>
                                    </Image>
                                    <Text style={{marginBottom: 2, fontFamily: 'PoppinsRegular', fontSize: 13}}>
                                        My Progress </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Ended Tab Bar */}

            </View>

        )
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

    tabbar_view: {

        flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-around', height: 65,
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

    grid_itemsview: {
        width: '44%',
        borderRadius: 10,
        marginLeft: 15,
        marginVertical: 13,
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

    chalenge_profile: {
        flex: 1,
        height: 200,
        width: '100%',
        // resizeMode:'cover' ,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },

    challenge_view: {
        // flex:1,
        height: 200,
        marginTop: 8,
        marginBottom: 8,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,
    },
    header_image: {
        flex: 1,
        height: 90
    },
    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: 35,
    },
});
