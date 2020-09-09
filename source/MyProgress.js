import React from 'react'
import {
    Alert,
    AsyncStorage,
    FlatList,
    Image,
    ImageBackground,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import Loader from "./loader/Loader";

const headerback = require('./../images/image-8.png')
const trophyGray = require('./../images/trophy.png')
const orangearrow = require('./../images/orangearrow.png')
const menuImg = require('./../assets/menu.png')
const profile = require('./../images/image-9.png')
const calendar = require('./../assets/calendar.png')
const library = require('./../assets/gallary.png')
const user = require('./../assets/user.png')
const arrowfor = require('./../images/arrowfor.png');
const shoulderyellow = require('./../assets/share_win.png')
const documentsgreen = require('./../assets/checkIn.png')
const volume_back = require('./../assets/gratitude.png')
const volume = require('./../assets/gallery.png')
const trophy = require('./../assets/trophy.png')
const trophylightyellow = require('./../images/trophylightyellow.png')
const trophydarkgray = require('./../images/trophydarkgray.png')
const trophylightgray = require('./../images/trophylightgray.png')
const trophydarkyellow = require('./../images/trophydarkyellow.png')

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

export default class MyProgress extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            selectedItem: 'DashBoard',
            token: '',
            challangeId: '',
            userId: '',
            totalStreaks: 0,
            data_list: [],
            offSetLoader: true,
            imageArray: [shoulderyellow, documentsgreen, volume_back, trophy, volume],
            imageProfile: '',
            userProfilePic: '',
            userTrophy: 'Bronze',
            userTrophyOverAll: 'Bronze',
            userName: '',
            userPoints: 0,
            day: 0,
            week: 0,
            userFbProfile: null,
            overAllActions: 0,
            monthlyActions: 0,
            checkInCount: 0
        };


        this.toggle = this.toggle.bind(this);
        this.setImage = this.setImage.bind(this);
        this.renderRow = this.renderRow.bind(this);

    }

    componentDidMount() {
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

        setTimeout(() => {
            //  alert(this.state.userId)
            this.getApiDataOverAll();
            this.getApiData();

        }, 1000)
        this.getFacebookProfilePic();
    }

    async getApiDataOverAll() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-my-progress-content';
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
                    this.InheritedDataOverAll(dataobject);
                }
            )
            .catch((error) => {
            })

    }

    InheritedDataOverAll(dataObject) {
        if (dataObject.status) {
          this.setState({userTrophyOverAll: dataObject.content.user_accomplishments.overall.trophy.user});
          this.setState({overAllActions: dataObject.content.user_accomplishments.overall.actions.total_actions});
        }
    }


    async getApiData() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-my-progress-content';
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
                    console.log('dataobject', dataobject);
                    //  a lert(JSON.stringify(dataobject));
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })

    }

    InheritedData(dataObject) {
        if (dataObject.status) {
            var data = dataObject.content.challenge_features
            this.setState({data_list: data});
            if (this.state.userFbProfile == null) {
                this.setState({userFbProfile: dataObject.content.user_profile.profile_pic});
            }
            this.setState({monthlyActions: dataObject.content.user_accomplishments.overall.actions.month_actions});
            //alert(dataObject.content.user_profile.profile_pic)
            this.setState({userProfilePic: dataObject.content.user_profile.profile_pic});
            this.setState({day: dataObject.content.challenge_details.challenge_day});
            this.setState({week: dataObject.content.challenge_details.challenge_week});
            this.setState({totalStreaks: dataObject.content.user_accomplishments.overall.actions.streak_actions});
            this.setState({userTrophy: dataObject.content.user_accomplishments.overall.trophy.user});
            this.setState({userName: dataObject.content.user_profile.username});
            this.setState({userPoints: dataObject.content.user_accomplishments.overall.actions.total_points});
            this.setState({overAllActions: dataObject.content.user_accomplishments.overall.actions.total_actions});
            this.setState({checkInCount: dataObject.content.user_accomplishments.checkins.total_count});
            this.setState({offSetLoader: false});
        } else {

        }
    }


    toggle() {
        this.setState({

            isOpen: !this.state.isOpen,
        });
    }

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

    updateMenuState(isOpen) {
        this.setState({isOpen});
    }

    refresh=(data)=> {
   }

    onMenuItemSelected = item =>
        this.setState({
            isOpen: false,
            selectedItem: item == 'logout' ? this.logOutWithToken() : this.props.navigation.navigate(item),
        });

        navigateSeeAll(item) {
          var feature_id = item.item.feature_id;
          var dataholder={'feature_name': item.item.feature_name, 'points': item.item.points, 'challenge_id': this.state.challangeId, 'feature_id':feature_id};

          var basicArray = {"details":{'day':this.state.day,'week':this.state.week}};
          if(feature_id == 1) {
            var chlObject = {'feature_name': item.item.feature_name, 'challenge_id':this.state.challangeId, 'feature_category_id':item.item.category_id, 'day': this.state.day, 'week': this.state.week};
            this.props.navigation.navigate('DailyInspiration',  {DATA:dataholder, challenge_details:chlObject, onGoBack: this.refresh});
          }
          else if(feature_id == 2){
            var chlObject = {'feature_name': item.item.feature_name, 'challenge_id':this.state.challangeId, 'feature_category_id':item.item.category_id, 'day': this.state.day, 'week': this.state.week};
            this.props.navigation.navigate('MyPostComments',{DATA:dataholder, challenge_details:chlObject, profile_pic: this.state.userProfilePic, basic_array: basicArray, onGoBack: this.refresh});
          }
          else if(feature_id == 6){
            var parameters = {
                challenge_id: this.state.challangeId,
                category_id: item.item.category_id,
                feature_id: feature_id,
                week: this.state.week,
                uid: this.state.userId
            };
            this.props.navigation.navigate('WeekelyVideoSeeAll', {DATA: parameters});
          }
          else if(feature_id == 7){
            var parameters = {
                challenge_id: this.state.challangeId,
                category_id: item.item.category_id,
                feature_id: feature_id,
                week: this.state.week,
                day: this.state.day,
                uid: this.state.userId
            };
            this.props.navigation.navigate('CheckItSeeAll', {DATA: parameters});
          }
          else if(feature_id == 4){
            var parameters = {
                challenge_id: this.state.challangeId,
                category_id: item.item.category_id,
                feature_id: feature_id,
                week: this.state.week,
                uid: this.state.userId,
            };
            this.props.navigation.navigate('CoachCornerSeeAll', {DATA: parameters});
          }
          else if(feature_id == 5){
            var parameters = {
                challenge_id: this.state.challangeId,
                category_id: item.item.category_id,
                feature_id: feature_id,
                week: this.state.week,
                uid: this.state.userId,
                day:this.state.day
            };
            this.props.navigation.navigate('MyShareAWinSeeAll', {DATA: parameters});
          }
          else if(feature_id == 14){
              this.props.navigation.navigate('MyGallery');
          }
          //console.log('item', item);
        }

    renderRow(item, index) {
        return (
            <TouchableOpacity onPress={()=>this.navigateSeeAll(item)}
              style={{flex:1, backgroundColor: 'transparent'}} key={item.index}>
                <View style={styles.item_view}>
                    <ImageBackground
                        source={this.setImage(item.index, item.item.feature_id)}
                        style={styles.item_image}>




                        <View style={{flex: 1}}>
                        {/*<Text style={{*/}
                        {/*    backgroundColor: 'transparent',*/}
                        {/*    paddingHorizontal: 10,*/}
                        {/*    textAlign: 'center',*/}
                        {/*    height: 35,*/}
                        {/*    marginTop: 102,*/}
                        {/*    fontFamily: 'PoppinsSemiBold',*/}
                        {/*    fontSize: 10*/}
                        {/*}}numberOfLines={2}>{item.item.feature_name}</Text>*/}
                        </View>

                    </ImageBackground>

                </View>
            </TouchableOpacity>
        )

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
          {/*<Loader loaderVal={this.state.offSetLoader}/>*/}
    };


    setImage(index, id) {
        if (id == 1)
            return this.state.imageArray[0]
        else if (id == 2) {
            return this.state.imageArray[2]
        } else if (id == 6) {
            return this.state.imageArray[0]
        } else if (id == 7) {
            return this.state.imageArray[1]
        } else if (id == 4) {
            return this.state.imageArray[3]
        } else if (id == 5) {
            return this.state.imageArray[0]
        } else if (id == 8) {
            return this.state.imageArray[1]
        } else if (id == 9) {
            return this.state.imageArray[1]
        } else if (id == 14) {
            return this.state.imageArray[4]
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

    render() {
        console.log(this.state.userTrophyOverAll);
        const {overAllActions, userPoints} = this.state;
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
                                <TouchableOpacity style={{flex: 0.20,}} onPress={this.toggle}>
                                    <Image source={menuImg} style={styles.menu}>
                                    </Image>
                                </TouchableOpacity>

                                <View style={{
                                    flexDirection: 'column',
                                    marginLeft: 0,
                                    backgroundColor: 'tranaparent',
                                    flex: 0.65,
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 20, alignSelf: 'center'}}>My
                                        Progress</Text>
                                    {/*<View style={{flexDirection: 'row', marginTop: -5}}>*/}
                                    {/*    <Text style={{fontFamily: 'PoppinsBold'}}>120</Text>*/}
                                    {/*    <Text style={{fontFamily: 'PoppinsRegular'}}> Points*/}
                                    {/*    </Text>*/}
                                    {/*</View>*/}
                                </View>

                                <View style={{
                                    flex: 0.15,
                                    alignItems: 'flex-end',
                                    marginRight: 20,
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
                                </View>

                            </View>
                        </ImageBackground>

                    </View>
                    {/* Ended Header View */}


                    {/*Started My Progress View */}
                    <ScrollView style={{flex: 1}}>


                        {/*<View style={styles.myprogress_view}>*/}
                        {/*    <Text style={{fontFamily: 'PoppinsBold', fontSize: 20, marginLeft: 8}}> My Journals </Text>*/}
                        {/*</View>*/}

                        {/* Show progreess items */}
                        {/*<View style={{*/}
                        {/*    flexDirection: 'row', height: 135, alignItems: 'center', justifyContent: 'space-between'*/}
                        {/*    , backgroundColor: 'transparent', marginLeft: 10, marginTop: -10*/}
                        {/*}}>*/}

                        {/*    <ScrollView style={{flex: 1, padding: 2}}*/}
                        {/*                horizontal={true} showsHorizontalScrollIndicator={false}*/}
                        {/*    >*/}
                        {/*        {this.renderRow()}*/}
                        {/*    </ScrollView>*/}
                        {/*</View>*/}
                        {/*Ended My Progress View */}

                        {/*<Text style={{fontFamily: 'PoppinsBold', fontSize: 20, marginLeft: 8, marginTop: 5}}> Total Key*/}
                        {/*    accomplishments </Text>*/}

                        {/* Started Total key View */}
                        {/*<View style={styles.keys_view}>*/}
                        {/*    <Text style={{marginLeft: 10, fontFamily: 'PoppinsBold', fontSize: 14}}> Overall Points*/}
                        {/*    </Text>*/}
                        {/*    <View style={{*/}
                        {/*        backgroundColor: '#f2cc8b', height: 40, width: 65, marginRight: 15,*/}
                        {/*        borderTopRightRadius: 18, borderTopLeftRadius: 18, borderBottomLeftRadius: 18,*/}
                        {/*        borderBottomRightRadius: 18, alignItems: 'center', justifyContent: 'center'*/}
                        {/*    }}>*/}
                        {/*        <Text style={{*/}
                        {/*            fontFamily: 'PoppinsBold',*/}
                        {/*            marginRight: 3,*/}
                        {/*            fontSize: 17*/}
                        {/*        }}> {this.state.userPoints}*/}
                        {/*        </Text>*/}
                        {/*    </View>*/}
                        {/*</View>*/}


                        {/*<View style={styles.keys_view}>*/}
                        {/*    <Text style={{marginLeft: 10, fontFamily: 'PoppinsBold', fontSize: 14}}> Overall Actions*/}
                        {/*    </Text>*/}

                        {/*    <View style={{*/}
                        {/*        backgroundColor: '#97ddd3', height: 40, width: 65, marginRight: 15,*/}
                        {/*        borderTopRightRadius: 18, borderTopLeftRadius: 18, borderBottomLeftRadius: 18,*/}
                        {/*        borderBottomRightRadius: 18, alignItems: 'center', justifyContent: 'center'*/}
                        {/*    }}>*/}
                        {/*        <Text style={{*/}
                        {/*            fontFamily: 'PoppinsBold',*/}
                        {/*            fontSize: 17,*/}
                        {/*            textAlign: 'center',*/}
                        {/*            marginRight: 3*/}
                        {/*        }}> {this.state.overAllActions}*/}
                        {/*        </Text>*/}
                        {/*    </View>*/}
                        {/*</View>*/}

                        {/*<View style={styles.keys_view}>*/}
                        {/*    <Text style={{marginLeft: 10, fontFamily: 'PoppinsBold', fontSize: 14}}> Overall Check Ins*/}
                        {/*    </Text>*/}

                        {/*    <View style={{*/}
                        {/*        backgroundColor: '#97ddd3', height: 40, width: 65, marginRight: 15,*/}
                        {/*        borderTopRightRadius: 18, borderTopLeftRadius: 18, borderBottomLeftRadius: 18,*/}
                        {/*        borderBottomRightRadius: 18, alignItems: 'center', justifyContent: 'center'*/}
                        {/*    }}>*/}
                        {/*        <Text style={{*/}
                        {/*            fontFamily: 'PoppinsBold',*/}
                        {/*            marginRight: 3,*/}
                        {/*            fontSize: 17*/}
                        {/*        }}> {this.state.checkInCount}*/}
                        {/*        </Text>*/}
                        {/*    </View>*/}
                        {/*</View>*/}

                        {/* Ended Total key View */}

                        {/*start new layout*/}

                        <View style={{
                            height: 120, backgroundColor: 'white',
                            justifyContent: 'space-between', marginTop: 12,
                            flexDirection: 'row', flex: 1, paddingHorizontal: 23
                        }}>
                            <View style={styles.boxc}>
                                <Text style={styles.boxtext}>Total
                                    Points</Text>
                                <Text style={styles.boxtext1}>{userPoints}</Text>

                            </View>
                            <View style={styles.boxc}>
                                <Text style={styles.boxtext}>Total
                                    Actions</Text>
                                <Text style={styles.boxtext1}>{overAllActions}</Text>
                            </View>

                        </View>

                        <View style={{
                            height: 75,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            justifyContent: 'space-between',
                            padding: 0,
                            flexDirection: 'row',
                            elevation: 3,
                            backgroundColor: '#d0eafb',
                            marginTop: 25,
                            marginHorizontal: 17,
                            borderRadius: 6
                        }}>

                            <View style={{
                                backgroundColor: 'transparent',
                                marginLeft: 13,
                                height: 75,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    marginTop: 0, color: 'black',
                                    fontSize: 18, fontFamily: 'PoppinsSemiBold',
                                }}>Longest Streak
                                </Text>
                            </View>


                            <View style={{
                                backgroundColor: 'transpanrent', marginRight: 10, justifyContent: 'center'
                                , alignSelf: 'flex-end', height: 75, width: 120, flexDirection: 'row'
                            }}>
                                <ImageBackground source={orangearrow}
                                                 style={{width: 30, height: 25, alignSelf: 'center'}}></ImageBackground>
                                <Text
                                    style={{fontSize: 28, fontFamily: 'PoppinsSemiBold', alignSelf: 'center'}}>{this.state.totalStreaks}</Text>
                                <Text style={{
                                    fontSize: 15,
                                    fontFamily: 'PoppinsMedium',
                                    alignSelf: 'center',
                                    marginLeft: 8
                                }}>Days</Text>
                            </View>

                        </View>
                        {this.state.offSetLoader &&
                            this.loaderView()
                        }

                        <View style={{ shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            paddingVertical: 10,
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            justifyContent: 'space-between', padding: 0,
                            elevation: 3, backgroundColor: 'white', marginTop: 25, marginHorizontal: 17, borderRadius: 6
                        }}>
                        <TouchableOpacity style={{flexDirection: 'row', flexDirection: 'row', flex: 1}} onPress={()=>this.props.navigation.navigate('MyProgressSeeAll', {index: 0, total_action_overAll: this.state.overAllActions, total_action_monthly: this.state.monthlyActions})}>
                            <View style={{
                                backgroundColor: 'transparent',
                                marginLeft: 13,
                                flex: 0.75,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    marginTop: 0, color: 'black',
                                    fontSize: 18, fontFamily: 'PoppinsSemiBold',
                                }}>Monthly Trophy Status
                                </Text>
                            </View>


                            <View style={{flex: 0.25,
                                backgroundColor: 'transparent', marginRight: 10, justifyContent: 'center'
                                , alignSelf: 'flex-end', flexDirection: 'row'
                            }}>
                                              <ImageBackground source={this.selectedTrophy(this.state.userTrophy)}
                                                 style={{width: 50, height: 50, alignSelf: 'center', marginRight: 10,margin:2}}
                                                ></ImageBackground>
                                <Image source={arrowfor}
                                       style={{height: 20, width: 20, alignSelf: 'center', marginTop: 0}}></Image>

                            </View>
                          </TouchableOpacity>
                        </View>


                        <View style={{ shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            paddingVertical: 10,
                            shadowOpacity: 0.22,
                            shadowRadius: 2.22,
                            justifyContent: 'space-between', padding: 0,
                            elevation: 3, backgroundColor: 'white', marginTop: 25, marginHorizontal: 17, borderRadius: 6
                        }}>
                        <TouchableOpacity style={{flexDirection: 'row', flexDirection: 'row', flex: 1}} onPress={()=>this.props.navigation.navigate('MyProgressSeeAll', {index: 1, total_action_monthly: this.state.monthlyActions, total_action_overAll: this.state.overAllActions})}>
                            <View style={{
                                backgroundColor: 'transparent',
                                marginLeft: 13,
                                flex: 0.75,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    marginTop: 0, color: 'black',
                                    fontSize: 18, fontFamily: 'PoppinsSemiBold',
                                }}>Overall Trophy Status
                                </Text>
                            </View>


                            <View style={{flex: 0.25,
                                backgroundColor: 'transparent', marginRight: 10, justifyContent: 'center'
                                , alignSelf: 'flex-end', flexDirection: 'row'
                            }}>
                                <ImageBackground source={this.selectedTrophy(this.state.userTrophyOverAll)}
                                                 style={{width: 50, height: 50, alignSelf: 'center', marginRight: 10,margin:2}}
                                                ></ImageBackground>
                                <Image source={arrowfor}
                                       style={{height: 20, width: 20, alignSelf: 'center', marginTop: 0}}></Image>

                            </View>
                          </TouchableOpacity>
                        </View>


                        <View style={styles.myprogress_view}>
                            <Text style={{fontFamily: 'PoppinsBold', fontSize: 20}}> My Journals </Text>
                        </View>


                        <FlatList
                            contentContainerStyle={{paddingHorizontal:30,paddingVertical:5}}
                            style={{flex: 1, marginTop: 0,marginBottom: 23, backgroundColor:'white'}}
                            data={this.state.data_list}
                            renderItem={this.renderRow}
                            numColumns={2}
                            keyExtractor={this._keyExtractor}
                            //onEndReached={this.handeLoadMoreItem}
                            //onEndReachedThreshold={0.5}
                            //  ListHeaderComponent={this.headerComponent}
                            //ListFooterComponent={this.footerComponent}
                        >

                        </FlatList>



                        {/*end new layout*/}


                    </ScrollView>
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
        height: 125,

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
        marginTop: 55,
    },

    header_image: {
        flex: 1,
        height: 125
    },

    menu: {

        width: 38,
        height: 28,
        marginLeft: 20,

    },

    profile: {
        width: 55,
        height: 55, borderRadius: 55 / 2
    },

    boxc: {
        flex: 0.47, backgroundColor: '#7ac5f9', justifyContent: 'center', alignItems: 'center', borderRadius: 20, shadowColor: "#000", alignItems: 'center',
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
        //height: 150,
        width: 150,
        backgroundColor: 'transparent',
        flex: 1,
        borderRadius: 18,
        marginTop:20,
    },


    item_image: {
        alignSelf:'center',
        margin: 1,alignItems:'center',
        width:128,
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
    },
    loader: {
        marginTop: 5, alignItems: 'center', height: 60, backgroundColor: "transparent"
    }
});
