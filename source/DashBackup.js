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
    TouchableOpacity,
    View
} from 'react-native';


import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';


const headerback = require('./../images/image-8.png');
const menuImg = require('./../assets/menu.png');
const profile = require('./../images/image-9.png');
const notification = require('./../images/notitificationBell.png');
const challenge = require('./../images/image-10.png');
const checkblue = require('./../assets/checkblue.png');
const nextarrow = require('./../assets/nextarrow.png');
const block = require('./../assets/block.png');
const unlockgray = require('./../assets/unlockgray.png');
const hands = require('./../images/handsblue.png');
const stargray = require('./../assets/startgray.png');


const image11 = require('./../images/image-11.png');
const image12 = require('./../images/image-12.png');
const image13 = require('./../images/image-13.png');
const unlockblack = require('./../assets/unlockblack.png');

const calendar = require('./../images/calendarblue.png');
const tabcalendar = require('./../assets/calendar.png');

const library = require('./../assets/gallary.png');
const user = require('./../assets/user.png');

const checkyellow = require('./../images/checkyellow.png');
const checkgray = require('./../images/checkgray.png');
const commentblue = require('./../images/commentblue.png');
const docs = require('./../images/docs.png');
const orangearrow = require('./../images/orangearrow.png');
const starshinegray = require('./../images/starshinegray.png');
const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details';

// const calendar = require('./../assets/calendar.png')
const dataArray = [
    {
        title: 'Angelina Shelton',
        date: '2/28 7:15 pm',
        desc: 'Today I met with an inspirational leader who made me feel excited!',
        image: image11
    },
    {
        title: 'Jeffrey Ludlow',
        date: '2/28 7:15 pm',
        desc: 'I Worked with a team of people who pushed each other forward',
        image: image12
    },
    {
        title: 'Angelina Shelton',
        date: '2/28 7:15 pm',
        desc: 'Today I met with an inspirational leader who made me feel excited!',
        image: image11
    },

];

console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


export default class DashBoard extends Component {
    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
            isOpen: false,
            selectedItem: 'DashBoard',
            userFbProfile: null,
            accessToken: '',
            userName:'',
            userEmail:'',
            userProfile:'',
            notificationCount:0,
            challangeName:'',


        };

        this.toggle = this.toggle.bind(this);

    }

    componentDidMount() {

        this.getFacebookProfilePic();
        this.getAccessToken();
        this.getChallenges();
    }

    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});
        //alert(this.state.accessToken);
        console.log(this.state.accessToken);
        if (this.state.accessToken =!''){
            //this.getChallenges();
        }


    }


    async getFacebookProfilePic() {
        let userId = '';
        try {
            userId = await AsyncStorage.getItem('FACEBOOKPROFILE');
            console.log("URLLLL" + userId)
        } catch (error) {
            // Error retrieving data
            console.log("URLLLL" + error.message);
        }
        this.setState({userFbProfile: JSON.parse(userId)})
    }

    async getChallenges() {

        var token = await SecureStore.getItemAsync('token');

        var token1 = `Bearer ${JSON.parse(token)}`;
        fetch(apiUrl,
            {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token1,
                }),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);

                    //alert(JSON.stringify(dataobject));


                    this.InheritedData(dataobject);

                }
            )
            .catch((error) => {
                alert(' Exception causes'+error)
            })

    }

    setUserName(text){
        this.setState({userName:text})
    }
    setUserEmail(text){
        this.setState({userEmail:text})
    }
    setNotificationCount(text){
        this.setState({notificationCount:text});
        //alert( typeof text)
    }
    setChallenageName(text){
        this.setState({challangeName:text})
    }
    InheritedData(dataObject){
        if (dataObject.status == true){
            var username   = dataObject.userDetails.user_details;
            var challengeDetails   = dataObject.challengeDetails;
            //    alert(JSON.stringify(username.username));
            this.setUserName(username.username);
            this.setUserEmail(username.email);
            this.setNotificationCount(username.push_notification);
            var challangeName = challengeDetails.name;
            this.setChallenageName(challangeName);
            var startDate_ = challengeDetails.start_date;
            var end_date_ = challengeDetails.end_date;
            var status = challengeDetails.status;
            var challengefeatures_array = challengeDetails.challengefeatures;
            // alert(challengefeatures_array)

        }


    }



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

    // Alert.alert('Are you sure you want to log out?' ,'',[{text: 'Cancel', onPress: () => onItemSelected('')}, {text: 'Yes', onPress: () => onItemSelected('Login'),style: 'destructive'}])
    _renderScrollViewContent() {
        const {navigate} = this.props.navigation;
        return (

            <View style={styles.scrollViewContent}>

                <View style={{backgroundColor: 'white', flexDirection: 'row'}}>
                    <View style={{backgroundColor: 'white', flex: 0.65}}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'PoppinsBold',
                            marginLeft: 10,
                            marginTop: 15
                        }}> {this.state.challangeName} </Text>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 0,
                            backgroundColor: 'white'
                        }}>
                            <Image source={calendar} style={{width: 16, height: 16, marginLeft: 15}}>
                            </Image>
                            <Text style={{fontSize: 11, fontFamily: 'PoppinsRegular', marginTop: 2}}> Tuesday, April
                                28th </Text>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: 'white',
                        flex: 0.35,
                        padding: 23,
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                    }}>
                        <View style={{alignItems: 'center'}}>

                            <Image source={starshinegray}
                                   style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                            </Image>

                            <Text style={{fontSize: 12, fontFamily: 'PoppinsRegular', marginTop: 5}}>InJoy
                                Premium </Text>
                        </View>

                    </View>


                </View>


                {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate('DailyInspiration')}> */}
                <View style={styles.challenge_view}>
                    <Image source={challenge} style={styles.chalenge_profile}>
                    </Image>

                    <View style={{flexDirection: 'row', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                        <View style={{height: 85, width: '100%', backgroundColor: 'transparent'}}>

                            <View>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'transparent',
                                    alignItems: 'center',
                                    height: 35
                                }}
                                                  onPress={() => navigate('DailyInspiration')}
                                >
                                    <Image source={checkgray}
                                           style={{width: 18, height: 18, marginLeft: 15, marginTop: 0}}>
                                    </Image>
                                    <Text style={{marginTop: 0, marginLeft: 5, fontSize: 13}}> DAILY
                                        INSPIRATION </Text>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'flex-end',
                                        backgroundColor: 'transparent',
                                        justifyContent: 'flex-end'
                                    }}>
                                        <Image source={nextarrow}
                                               style={{width: 10, height: 18, marginRight: 18, marginTop: 8}}>
                                        </Image>
                                    </View>
                                </TouchableOpacity>


                                <View style={{
                                    flexDirection: 'row',
                                    height: 37,
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    alignItems: 'center',
                                    marginTop: 4
                                }}>
                                    <Text style={{
                                        marginLeft: 15,
                                        color: '#19bffd',
                                        alignItems: 'center',
                                        fontFamily: 'PoppinsSemiBold',
                                        fontSize: 11
                                    }}> 5 Points </Text>

                                    <View style={{
                                        flexDirection: 'row',
                                        flex: 1, backgroundColor: 'transparent',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-end', marginRight: 25

                                    }}>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#19bffd',
                                            width: 120,
                                            height: 25,
                                            alignItems: 'center',
                                            borderRadius: 3
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 11,
                                                fontFamily: 'PoppinsSemiBold',
                                                marginTop: 3
                                            }}> Submit 10 Points </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{
                                            backgroundColor: '#19bffd',
                                            width: 65,
                                            height: 25,
                                            marginLeft: 8,
                                            alignItems: 'center',
                                            borderRadius: 3
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 11,
                                                fontFamily: 'PoppinsSemiBold',
                                                marginTop: 3
                                            }}> Share </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </View>


                    </View>
                </View>
                {/* </TouchableOpacity> */}


                {/* Started Appreciation for team member */}
                <View style={styles.appreciatio_view}>
                    <View style={{height: 100}}>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            height: 30,
                            backgroundColor: 'transparent',
                            alignItems: 'center'
                        }}
                                          onPress={() => navigate('PostComments')}
                        >
                            <Image source={starshinegray}
                                   style={{width: 18, height: 18, marginLeft: 12, alignItems: 'center'}}>
                            </Image>
                            <Text style={{
                                fontSize: 13,
                                color: 'gray',
                                marginLeft: 4,
                                marginTop: 2,
                                fontFamily: 'PoppinsBold',
                                alignItems: 'center'
                            }}> WALL
                                OF GRATITUDE </Text>
                            <View style={{flex: 1, alignItems: 'flex-end',}}>
                                <Image source={nextarrow}
                                       style={{width: 10, height: 18, marginRight: 18, marginTop: 8}}>
                                </Image>
                            </View>
                            {/* <Image source={nextarrow} style={{width: 9, height: 16, marginRight: 5,justifyContent:'flex-end'}}>
                            </Image>*/}
                        </TouchableOpacity>

                        <Text style={{
                            fontFamily: 'PoppinsBold',
                            width: '85%',
                            color: 'gray',
                            fontSize: 13,
                            marginLeft: 15,
                            marginTop: 7,
                            lineHeight: 23
                        }}>
                            Share something you are greateful for </Text>
                        <Text style={{
                            marginLeft: 15,
                            marginTop: 5,
                            color: '#19bffd',
                            fontFamily: 'PoppinsSemiBold',
                            fontSize: 11
                        }}> 30 Points </Text>
                        <View style={{height: 0.5, backgroundColor: 'lightgray', alignItems: 'flex-end', marginTop: 5}}>
                        </View>

                        <View style={{height: 32, alignItems: 'flex-end', marginTop: -15}}>
                            <Image source={unlockgray} style={{width: 30, height: 30, marginLeft: 15, marginRight: 8}}>
                            </Image>
                        </View>

                        {/* Started Appericiation List */}
                        <View style={{height: 290}}>
                            <FlatList style={{marginTop: -20}}
                                      data={dataArray}

                                      renderItem={({item, index}) =>
                                          <View style={{
                                              flexDirection: 'row',
                                              marginLeft: 0,
                                              marginTop: 12,
                                              borderBottomWidth: index == dataArray.length - 1 ? 0 : 0.2,
                                              borderColor: 'lightgray'
                                          }}>
                                              <Image source={item.image}
                                                     style={{width: 50, height: 50, marginLeft: 15}}>
                                              </Image>
                                              <View style={{flexDirection: 'column', width: '80%', marginBottom: 8}}>
                                                  <Text style={styles.appreciation_title}>{item.title}
                                                  </Text>
                                                  <Text style={styles.appreciation_desc}>{item.date}
                                                  </Text>
                                                  <Text style={styles.appreciation_desc}>{item.desc}
                                                  </Text>

                                                  <View style={{
                                                      width: '96%',
                                                      flexDirection: 'row',
                                                      justifyContent: 'flex-end',
                                                      alignItems: 'center',
                                                      marginTop: -10
                                                  }}>
                                                      <Image source={hands} style={{width: 15, height: 15}}>
                                                      </Image>
                                                      <Text style={{fontSize: 13, marginRight: 5}}> 5 </Text>

                                                      <Image source={commentblue}
                                                             style={{width: 15, height: 15, marginLeft: 5}}>
                                                      </Image>
                                                      <Text style={{fontSize: 13}}> 5 </Text>
                                                  </View>

                                              </View>

                                          </View>

                                      }/>
                        </View>
                        {/* Ended Apperication List */}

                    </View>
                </View>


                {/* Started Weekly Video List */}
                <View style={styles.weekly_view}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            marginRight: 17
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={starshinegray}
                                       style={{width: 18, height: 18, marginLeft: 12, marginTop: 10}}>
                                </Image>
                                <Text style={{marginTop: 12, fontSize: 12, color: 'gray', marginLeft: 4}}> WEEKLY VIDEO
                                </Text>
                            </View>

                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                color: 'gray',
                                fontSize: 13,
                                marginLeft: 15,
                                marginTop: 7,
                                lineHeight: 23
                            }} numberOfLines={2}
                            >
                                The happy secret to better work </Text>
                            <Text style={{
                                marginLeft: 5,
                                marginTop: 0,
                                color: '#19bffd',
                                padding: 5,
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: 11
                            }}> 40 Points </Text>

                        </View>

                        <View style={{
                            width: 120,
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5
                        }}>
                            <ImageBackground source={image13} style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center', borderRadius: 5
                            }}>
                                <Image source={unlockblack} style={{width: 30, height: 30}}>
                                </Image>
                            </ImageBackground>
                        </View>
                    </View>
                </View>
                {/* Ended Weekly Video List */}

                {/* Started Check in View*/}
                <View style={styles.weekly_view}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            marginRight: 27
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={starshinegray}
                                       style={{width: 18, height: 18, marginLeft: 12, marginTop: 10}}>
                                </Image>
                                <Image source={checkgray} style={{width: 16, height: 16, marginLeft: 5, marginTop: 12}}>
                                </Image>
                                <Image source={checkgray} style={{width: 16, height: 16, marginLeft: 7, marginTop: 12}}>
                                </Image>

                                <Text style={{marginTop: 12, marginLeft: 5, fontSize: 12, color: 'gray'}}> CHECK IN WITH
                                    YOURSELF
                                </Text>
                            </View>

                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                color: 'black',
                                fontSize: 13,
                                marginLeft: 15,
                                marginTop: 7,
                                lineHeight: 23
                            }}
                                  numberOfLines={2}
                            >What is one thing you did to go above and beyond as a leader today? </Text>
                            <Text style={{
                                marginLeft: 5,
                                marginTop: 0,
                                color: '#19bffd',
                                padding: 5,
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: 11
                            }}> 20 Points </Text>

                        </View>


                        <Image source={nextarrow}
                               style={{width: 10, height: 18, marginRight: 18, marginTop: 0, alignItems: 'flex-end'}}>
                        </Image>

                        {/*<View style={{flex:1, justifyContent: 'center', alignItems: 'flex-end',back}}>
                            <Image source={nextarrow} style={{width: 9, height: 16, marginRight: 10}}>
                            </Image>
                        </View>*/}
                    </View>
                </View>
                {/* Ended Check in View*/}


                {/* Started Daily OATH View*/}
                <View style={styles.weekly_view}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            marginRight: 17
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={starshinegray}
                                       style={{width: 18, height: 18, marginLeft: 12, marginTop: 10}}>
                                </Image>
                                <Image source={checkgray} style={{width: 16, height: 16, marginLeft: 5, marginTop: 12}}>
                                </Image>
                                <Text style={{marginTop: 12, marginLeft: 5, fontSize: 12, color: 'gray'}}> DAILY OATH
                                </Text>
                            </View>

                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                color: 'black',
                                fontSize: 13,
                                marginLeft: 15,
                                marginTop: 7,
                                lineHeight: 23
                            }}
                                  numberOfLines={2}
                            >
                                Check out the core values what it's having for you today </Text>
                            <Text style={{
                                marginLeft: 5,
                                marginTop: 0,
                                color: '#19bffd',
                                padding: 5,
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: 11
                            }}> 5 Points </Text>

                        </View>

                        <View style={{

                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <Image source={docs} style={{width: 60, height: 70, marginRight: 10}}>
                            </Image>
                            <Image source={nextarrow}
                                   style={{width: 10, height: 18, marginRight: 18, marginTop: 0}}>
                            </Image>
                        </View>
                    </View>
                </View>
                {/* Ended Daily OATH  View*/}


                {/* Started Leadership Corner View*/}
                <View style={styles.weekly_view}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            marginRight: 17
                        }}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={starshinegray}
                                       style={{width: 18, height: 18, marginLeft: 12, marginTop: 10}}>
                                </Image>
                                <Image source={checkyellow}
                                       style={{width: 16, height: 16, marginLeft: 5, marginTop: 12}}>
                                </Image>
                                <Image source={checkyellow}
                                       style={{width: 16, height: 16, marginLeft: 5, marginTop: 12}}>
                                </Image>
                                <Image source={checkgray} style={{width: 16, height: 16, marginLeft: 5, marginTop: 12}}>
                                </Image>

                                <Text style={{marginTop: 12, marginLeft: 5, fontSize: 12, color: 'gray'}}>LEADERSHIP
                                    CORNER
                                </Text>
                            </View>

                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                color: 'black',
                                fontSize: 13,
                                marginLeft: 15,
                                marginTop: 7,
                                lineHeight: 23
                            }}
                                  numberOfLines={2}>
                                What is one thing you did to go above and beyond as a leader today? </Text>
                            <Text style={{
                                marginLeft: 5,
                                marginTop: 0,
                                color: '#19bffd',
                                padding: 5,
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: 11
                            }}> 10 Points </Text>

                        </View>

                        <View style={{alignItems: 'flex-end',}}>

                            <Image source={nextarrow}
                                   style={{width: 10, height: 18, marginRight: 18, marginTop: 5, alignItems: 'center'}}>
                            </Image>
                            <Image source={profile} style={{width: 45, height: 45, marginRight: 40}}>
                            </Image>

                            <Text style={{
                                fontFamily: 'PoppinsSemiBold',
                                color: 'black',
                                fontSize: 10,
                                marginTop: 3,
                                marginRight: 25
                            }}>
                                Chris Griffin </Text>

                            <Text style={{fontFamily: 'PoppinsRegular', color: 'black', fontSize: 10, marginRight: 10}}>
                                Managing Director </Text>
                        </View>
                    </View>
                </View>
                {/* Ended Leadership Corner View*/}


                <View style={{flex: 1, height: 1, backgroundColor: 'lightgray'}}>
                </View>
                {/* Started Today's win View*/}
                <View style={styles.win_view}>
                    <View style={{flexDirection: 'row', height: 80}}>
                        <View style={{width: '90%'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={starshinegray}
                                       style={{width: 18, height: 18, marginLeft: 12, marginTop: 10}}>
                                </Image>

                                <Text style={{marginTop: 12, marginLeft: 5, fontSize: 12, color: 'gray'}}>TODAY'S WIN
                                </Text>
                            </View>

                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                color: 'black',
                                fontSize: 13,
                                marginLeft: 15,
                                marginTop: 4,
                                lineHeight: 23
                            }}>
                                Share a win you had today </Text>
                            <Text style={{
                                marginLeft: 5,
                                color: '#19bffd',
                                padding: 3,
                                fontFamily: 'PoppinsSemiBold',
                                fontSize: 11
                            }}> 10 Points </Text>

                        </View>

                        <View style={{width: '10%', height: 70, justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={nextarrow} style={{width: 10, height: 18, marginRight: 10}}>
                            </Image>
                        </View>

                    </View>


                    <View style={{
                        flexDirection: 'row',
                        height: 180,
                        marginHorizontal: 5,
                        borderRadius: 10,
                        marginTop: 10
                    }}>
                        <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                  horizontal={true}
                                  style={{height: 155}}
                                  data={[
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Anna gray',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Anna gray',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Anna gray',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                  ]}

                                  renderItem={({item}) =>
                                      <View style={styles.win_user_itemsview}>

                                          <Text style={{
                                              color: 'gray',
                                              fontSize: 10,
                                              marginTop: 10,
                                              fontFamily: 'PoppinsSemiBold',
                                              marginHorizontal: 15
                                          }}>
                                              Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor
                                              sit amet, Lorem ipsum dolor sit amet,
                                              Lorem ipsum dolor sit amet, Lorem ipsum dolor
                                          </Text>

                                          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                                              <View style={{flexDirection: 'row', alignItems: 'center', width: '70%'}}>
                                                  <Image source={item.image}
                                                         style={{width: 38, height: 38, marginTop: 12}}>
                                                  </Image>
                                                  <Text style={{
                                                      fontFamily: 'PoppinsBold',
                                                      fontSize: 10,
                                                      marginTop: 10,
                                                      marginLeft: 5
                                                  }}> {item.title}
                                                  </Text>
                                              </View>
                                              <View style={{
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  width: '25%',
                                                  height: 50
                                              }}>
                                                  <Image source={hands} style={{width: 13, height: 13, marginTop: 10}}>
                                                  </Image>
                                                  <Text style={{
                                                      fontFamily: 'PoppinsRegular',
                                                      fontSize: 10,
                                                      marginTop: 10,
                                                      marginRight: 10
                                                  }}> 5
                                                  </Text>

                                                  <Image source={commentblue}
                                                         style={{width: 12, height: 12, marginTop: 12}}>
                                                  </Image>
                                                  <Text style={{
                                                      fontFamily: 'PoppinsRegular',
                                                      fontSize: 10,
                                                      marginTop: 12
                                                  }}> 3
                                                  </Text>
                                              </View>

                                              {/* <View style={{width:'96%',flexDirection:'row',justifyContent:'flex-end',alignItems:'center',marginTop:-10}}>
                                      <Image source={hands} style={{width:13,height:13}}> 
                                        </Image>
                                      <Text style={{fontSize:12,marginRight:5}}> 5 </Text>

                                      <Image source={commentblue} style={{width:12,height:12,marginLeft:5}}> 
                                        </Image>
                                      <Text style={{fontSize:12}}> 5 </Text>
                                    </View> */}

                                          </View>

                                      </View>
                                  }/>
                    </View>
                </View>
                {/* Ended Today's win  View*/}
                <View style={{flex: 1, height: 1, backgroundColor: 'lightgray'}}>
                </View>


                {/* Started Leaderboard user List */}
                <View style={styles.leaderboard_view}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 25
                    }}>
                        <Text style={{fontSize: 20, fontFamily: 'PoppinsBold'}}> Leaderboard
                        </Text>
                        <Image source={nextarrow} style={{width: 10, height: 18, marginRight: 10}}>
                        </Image>
                    </View>


                    <View style={{
                        flexDirection: 'row',
                        height: 140,
                        marginHorizontal: 5,
                        borderRadius: 10,
                        marginTop: 10
                    }}>
                        <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                  horizontal={true}
                                  style={{height: 140}}
                                  data={[
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Anna gray',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Rold Jenson',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Terry White',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                  ]}

                                  renderItem={({item}) =>
                                      <View style={styles.topuser_itemsview}>
                                          <Image source={item.image} style={{width: 50, height: 50, marginTop: 12}}>
                                          </Image>
                                          <View style={{
                                              height: 0.5,
                                              backgroundColor: 'lightgray',
                                              width: '100%',
                                              marginTop: 12
                                          }}>
                                          </View>
                                          <Text style={{
                                              fontFamily: 'PoppinsBold',
                                              fontSize: 10,
                                              marginTop: 10
                                          }}> {item.title} </Text>
                                          <Text style={{
                                              color: '#19bffd',
                                              marginTop: 3,
                                              fontFamily: 'PoppinsSemiBold',
                                              fontSize: 10
                                          }}> 1410 Points </Text>
                                      </View>
                                  }/>
                    </View>

                </View>
                {/* Ended Leaderboard user List */}


                {/* Started Top Streaks user List */}
                <View style={styles.leaderboard_view}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 25
                    }}>
                        <Text style={{fontSize: 20, fontFamily: 'PoppinsBold'}}> Top Streaks
                        </Text>
                        <Image source={nextarrow} style={{width: 10, height: 18, marginRight: 10}}>
                        </Image>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        height: 140,
                        marginHorizontal: 5,
                        borderRadius: 10,
                        marginTop: 10
                    }}>
                        <FlatList showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                  horizontal={true}
                                  style={{height: 140}}
                                  data={[
                                      {
                                          title: 'James Smith',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Mary Deny',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                      {
                                          title: 'David Smith',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Patricia',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                      {
                                          title: 'Thomas Hegar',
                                          desc: 'Today I met with an inspirational leader who made me feel excited!',
                                          image: image11
                                      },
                                      {
                                          title: 'Anna gray',
                                          desc: 'I Worked with a team of people who pushed each other forward',
                                          image: image12
                                      },
                                  ]}

                                  renderItem={({item}) =>
                                      <View style={styles.topuser_itemsview}>
                                          <Image source={item.image} style={{width: 50, height: 50, marginTop: 12}}>
                                          </Image>
                                          <View style={{
                                              height: 0.5,
                                              backgroundColor: 'lightgray',
                                              width: '100%',
                                              marginTop: 12
                                          }}>
                                          </View>
                                          <Text style={{
                                              fontFamily: 'PoppinsBold',
                                              fontSize: 10,
                                              marginTop: 10
                                          }}> {item.title} </Text>

                                          <View style={{
                                              flexDirection: 'row',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              marginTop: 3
                                          }}>
                                              <Image source={orangearrow} style={{width: 18, height: 16}}>
                                              </Image>
                                              <Text style={{
                                                  fontFamily: 'PoppinsSemiBold',
                                                  fontSize: 10,
                                                  marginLeft: -3
                                              }}> 10 Days</Text>
                                          </View>
                                      </View>
                                  }/>
                    </View>

                </View>
                {/* Ended Top Streaks user List */}


            </View>


        );
    }

    render() {
        // Because of content inset the scroll value will be negative on iOS so bring
        // it back to 0.
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });

        const imageOpacity = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        const titleScale = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0.8],
            extrapolate: 'clamp',
        });
        const titleTranslate = scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 0, -8],
            extrapolate: 'clamp',
        });

        const menu = <ContentView onItemSelected={this.onMenuItemSelected}/>;

        return (
            <View style={styles.fill}>

                <SideMenu
                    menu={menu}
                    isOpen={this.state.isOpen}
                    onChange={isOpen => this.updateMenuState(isOpen)}>

                    {/* <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="rgba(0, 0, 0, 0.251)"
                      /> */}
                    <Animated.ScrollView
                        style={styles.fill}
                        scrollEventThrottle={1}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                            {useNativeDriver: true},
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({refreshing: true});
                                    setTimeout(() => this.setState({refreshing: false}), 1000);
                                }}
                                // Android offset for RefreshControl
                                progressViewOffset={HEADER_MAX_HEIGHT}
                            />
                        }
                        // iOS offset for RefreshControl
                        contentInset={{
                            top: HEADER_MAX_HEIGHT,
                        }}
                        contentOffset={{
                            y: -HEADER_MAX_HEIGHT,
                        }}
                    >
                        {this._renderScrollViewContent()}
                    </Animated.ScrollView>

                    <Animated.View
                        // pointerEvents="none"
                        style={[
                            styles.header,
                            {transform: [{translateY: headerTranslate}]},
                        ]}
                    >


                        {/* <Animated.View
                          style={[
                            styles.backgroundImage,
                            {
                              opacity: imageOpacity,
                              transform: [{ translateY: imageTranslate }],
                            },
                          ]}
                          // source={profile}
                        >  */}
                        <ImageBackground source={headerback} style={styles.header_image}>
                        </ImageBackground>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={this.toggle}>
                                <Image source={menuImg} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>

                            <View style={{flexDirection: 'column', marginLeft: 10, backgroundColor: 'transparent'}}>
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 20}}> {this.state.userName == ''?'-':this.state.userName}
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: -5,
                                    backgroundColor: 'transparent',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{fontFamily: 'PoppinsBold'}}> 4210
                                    </Text>
                                    <Text style={{fontFamily: 'PoppinsRegular'}}> Points
                                    </Text>
                                    <Image source={orangearrow} style={{width: 15, height: 12, marginLeft: 5}}>
                                    </Image>
                                    <Text style={{fontFamily: 'PoppinsRegular', marginLeft: 0, fontWeight: 'bold'}}>10
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                flexDirection: 'row'
                            }}>
                                {this.state.userFbProfile == null &&
                                <Image
                                    source={profile}
                                    style={styles.profile}>
                                </Image>
                                }
                                {this.state.userFbProfile != null &&
                                <Image
                                    source={{uri: this.state.userFbProfile}}
                                    style={styles.profile}>
                                </Image>
                                }
                                <View style={{height: 30, width: 35, backgroundColor: 'transparent', marginTop: 18}}>

                                    <ImageBackground source={notification} style={{
                                        height: 22,
                                        width: 22,
                                        marginTop: 5,
                                        marginLeft: 16,
                                        alignItems: 'flex-end'
                                    }}>
                                        {this.state.notificationCount !=0 &&
                                        <View style={{
                                            backgroundColor: '#ffbe00',
                                            height: 13,
                                            width: 13,
                                            borderRadius: 13 / 2,
                                            marginRight: -3,
                                            marginTop: -8,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>

                                            <Text style={{
                                                fontSize: 10,
                                                color: 'white',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                fontWeight: 'bold'
                                            }}>{this.state.notificationCount}</Text>
                                        </View>
                                        }

                                    </ImageBackground>
                                </View>

                            </View>

                        </View>

                    </Animated.View>
                    {/* </Animated.View> */}

                    {/* Started Tab Bar */}
                    <View style={styles.tabbar_view}>
                        {/* <View style={{flex:1,height:10,backgroundColor:'red',width:50}}>
                            </View> */}
                        <View style={styles.tabbar_inner_view}>
                            <View style={styles.tabbar_inner_view2}>
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',

                                    marginLeft: -15
                                }}>
                                    <TouchableOpacity style={{alignItems: 'center', marginTop: 15}}
                                                      onPress={() => this.props.navigation.navigate('DashBoard')}>
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
                    {/* <Animated.View
                        style={[
                          styles.bar,
                          {
                            transform: [
                              { sc`ale: titleScale },
                              { translateY: titleTranslate },
                            ],
                          },
                        ]}
                      >
                        <Text style={styles.title}>Title</Text>
                      </Animated.View> */}
                </SideMenu>

                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>

            </View>

        );
    }


    async logOutWithToken() {

        this.setState({showloader: true});

        const url_logout = global.base_url_live+'v1/api/app-logout';

        //alert(JSON.parse(this.state.token))
        // return
        var token = await SecureStore.getItemAsync('token');

        var parameters = {
            token: JSON.parse(token)
        };

        var token1 = `Bearer ${JSON.parse(token)}`;
        fetch(url_logout,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token1,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);

                    if (dataobject.status == 1) {
                        this.setState({email: ''});
                        this.setState({password: ''});
                        this.setState({showloader: false});
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(false));
                        //await SecureStore.deleteItemAsync('FACEBOOKPROFILE')
                        await AsyncStorage.removeItem('FACEBOOKPROFILE');
                        this.props.navigation.navigate('Login');
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
                this.setState({email: ''});
                this.setState({password: ''});
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}]);


                console.log("Exception on login time is ===", error)
                // alert(error);
            })
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
        backgroundColor: 'red',

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
        height: 400,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 15,

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
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 15,

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
        marginBottom: 15,
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
