import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    ScrollView,
    Dimensions,
    Image,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    Text,
    StatusBar,
    AppState,
    TouchableOpacity,
    View
} from 'react-native';
//import NetInfo from "@react-native-community/netinfo";
import {NavigationEvents} from 'react-navigation';
import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import Features from './features/Feature';
import * as ImagePicker from "expo-image-picker";
import ModalPremium from './modals/ModalPremium';
import ActionSheet from 'react-native-actionsheet';
import Loader from './loader/Loader';
import LoaderDashboard from './loader/LoaderDashboard';
import * as Permissions from "expo-permissions";
import Leaderboard from './features/Leaderboard';
import TopStreaks from './features/TopStreaks';
import UnlockInjoy from './UnlockInjoy';
import OneSignal from "react-native-onesignal";
import NavigationService from "../NavigationService";
const headerback = require('./../images/image-8.png');
const menuImg = require('./../assets/menu.png');
const profile = require('./../images/image-9.png');
const notification = require('./../images/notitificationBell.png');
const challenge = require('./../images/image-10.png');
const checkblue = require('./../assets/checkblue.png');
const nextarrow = require('./../assets/nextarrow.png');
const block = require('./../assets/block.png');
const unlockgray = require('./../images/play-btn.png');
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
const checkgreen = require('./../images/checkgreen.png');
const commentblue = require('./../images/commentblue.png');
const docs = require('./../images/docs.png');
const orangearrow = require('./../images/orangearrow.png');
const starshinegray = require('./../images/starshinegray.png');
//const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';


const crossarrow = require('./../images/close.png');
const backg = require('./../images/bg_popup.png');
const unlock = require('./../images/unlock.png');
const star = require('./../images/star.png');

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

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};
// const getDeviceToken = async () => {
//     return await SecureStore.getItemAsync('device_token');
// };
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;

console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const getStoredDay = async () => {
    return await SecureStore.getItemAsync('storeDay');
};

export default class DashBoard extends Component {
    constructor(props) {
        super(props);

        // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
        OneSignal.registerForPushNotifications();
        OneSignal.init("9defb601-c8e9-4ea8-bd4c-5d1d063f1c68", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
        OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

        // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
        //OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);
        // this.onOpened = this.onOpened.bind(this);
        OneSignal.addEventListener('received', this.onReceived.bind(this));
        OneSignal.addEventListener('opened', this.onOpened.bind(this));
        OneSignal.addEventListener('ids', this.onIds);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
            isOpen: false,
            appState: AppState.currentState,
            selectedItem: 'DashBoard',
            userFbProfile: null,
            route: this.props.navigation.state.params.route,
            accessToken: '',
            premiumModal: false,
            dayChangeLoader: false,
            offSetLoader: false,
            paidStatus: true,
            userName: '',
            dev_token: null,
            userEmail: '',
            userProfile: '',
            basicDetails: [],
            UID: 0,
            storeDay: 0,
            notificationCount: 0,
            challangeName: '',
            leaderArray: [],
            streakArray: [],
            chlId: 0,
            challengeArray: [],
            currentDay: 0,
            currentDate:'',
            image: null,
            hasCameraPermission:null,
            type: null,
            name: null,
            connection_Status: 'Online',
            userName: '',
            imageEdit: false,

        };
        this.childLeaderBoard = React.createRef();
        this.childStreaks = React.createRef();
        this.toggle = this.toggle.bind(this);
        this.premium = this.premium.bind(this);
        this._handelePaymentUpdate = this._handelePaymentUpdate.bind(this);
        this._handeleLoaderUpdate = this._handeleLoaderUpdate.bind(this);
        this._handeleDayChange = this._handeleDayChange.bind(this);
        this.onReceived = this.onReceived.bind(this);
    }

    handleConnectivityChange = state => {
        if (state.isConnected) {
            this.setState({connection_Status: 'Online'});
        } else {
            this.setState({connection_Status: 'Offline'});
        }
    };

    componentDidMount() {

        if(this.state.route == 'onboarding' || this.state.route == 'signup') {
            this.setState({dayChangeLoader: true})
        }



        if(this.state.connection_Status == 'Online') {
            AppState.addEventListener('change', this._handleAppStateChange);
            getUserId().then(id =>
                this.setState({UID: id}),
            );

            this.getDeviceToken();
            this.getFacebookProfilePic();
            this.getAccessToken();
            this.getBasicDetails();
            this.getChallenges();
        }
        else{
            alert('Please connect to internet.');
        }

    }

    onReceived(notification) {
        this.getBasicDetails();
        console.log("Notification received: ", notification);
    }

    async onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        //alert('There Inside');
        //console.log('Array_data: ', openResult.notification.payload.additionalData);
        var payload = openResult.notification.payload.additionalData;

        const token_  =await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/view-push-notification';

        var parameters = {
            feature_id:payload.feature_id,
            notification_id: payload.notification_id
        };
        //alert(this.state.UID);
        //console.log('parameters', parameters);

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

                    var dataobject = JSON.parse(responseText)
                   // alert('success');
                    var chlObject = {
                        'challenge_id': dataobject.content.challenge.id,
                        'feature_category_id': dataobject.content.feature.category_id,
                        'day': dataobject.content.challenge.day,
                        'week': dataobject.content.challenge.week,
                        'feature_name': dataobject.content.feature.name
                    };
                    if(payload.feature_id == 2) {

                        NavigationService.navigate('AddReply', {
                            'DATA': dataobject.content.shout_out_original_object,
                            'feature_array': chlObject,
                            'basic_array': {details: {'day': dataobject.content.challenge.day, 'week':dataobject.content.challenge.week}},
                            'profile_pic': dataobject.content.shout_out_original_object.user_details.profile_pic,
                            'onGoBack': this.refresh,
                            'challengeID': dataobject.content.challenge.id
                        });
                    }
                    else if(payload.feature_id == 1) {
                        //console.log('payloadpayloadpayload', payload);
                        //NavigationService.navigate('DailyInspiration',{DATA:{points: dataobject.content.feature.points}, challenge_details:chlObject, onGoBack: this.refresh});
                    }
                    else if(payload.feature_id == 5){
                        NavigationService.navigate('ShareAWin', {
                            DATA: {points: dataobject.content.feature.points},
                            challenge_details: chlObject,
                            onGoBack: this.refresh
                        })
                    }
                    else{

                    }
                    console.log('Notifications Details', dataobject);
                }
            )
            .catch((error) => {
                alert(' Exception causes' + error)
            })

    }

    refresh = (data) => {

    }

    clearNotification = () => {
       //this.setState({notificationCount: 0});
        this.getBasicDetails();
    }



    async onIds(device) {
        //alert(device.userId);
        await SecureStore.setItemAsync('device_token', device.userId);
    }

    async getDeviceToken() {
      var tokk = await SecureStore.getItemAsync('device_token');
      this.setState({dev_token: tokk});
       // alert(this.state.dev_token);
      // fetch('https://exp.host/--/api/v2/push/send', {
      //    method: 'POST',
      //    headers: {
      //          Accept: 'application/json',
      //         'Content-Type': 'application/json',
      //         'accept-encoding': 'gzip, deflate',
      //         'host': 'exp.host'
      //     },
      //   body: JSON.stringify({
      //         to: tokk,
      //         title: 'New Notification',
      //         body: 'The notification worked!',
      //         priority: "high",
      //         sound:"default",
      //         channelId:"default",
      //             }),
      // }).then((response) => response.json())
      //          .then((responseJson) => { })
      //                 .catch((error)
        //
        //
        //
        //                 => { console.log(error) });
    }

    componentWillUnmount() {
        //NetInfo.removeEventListener(this.handleConnectivityChange);
        AppState.removeEventListener('change', this._handleAppStateChange);
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
  }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.navigation.state.params !== undefined) {
            console.log('this.state.userFbProfile', nextProps.navigation.state.params);
            console.log('this.state.userName', this.state.userName);



            if(nextProps.navigation.state.params.image_url !== this.state.userFbProfile) {
              //alert(JSON.stringify(nextProps.navigation.state.params));
                this.setState({userFbProfile: nextProps.navigation.state.params.image_url});
                this.getChallenges();
                if(nextProps.navigation.state.params.route !== 'onboarding'){
                  this.childLeaderBoard.current.getLeaderboard();
                  this.childStreaks.current.getLeaderboard();
                }

            }
            //alert(nextProps.navigation.state.params.user_name);
            if((nextProps.navigation.state.params.user_name !== this.state.userName) && (nextProps.navigation.state.params.user_name !== undefined)) {
                var nameArr = nextProps.navigation.state.params.user_name.split(' ');
                var addName = nameArr[0];

                if(addName !== this.state.userName) {
                    this.setState({userName: addName});
                    this.getChallenges();
                    this.childLeaderBoard.current.getLeaderboard();
                    this.childStreaks.current.getLeaderboard();
                }
            }

        }
        //console.log('componentDidUpdate', prevProps.navigation.state.params);
        console.log('componentDidUpdate', nextProps.navigation.state.params);
    }

    async getBasicDetails() {
    const token_  =await SecureStore.getItemAsync('token');
    const url = global.base_url_live+'v1/api/get-user-actions-and-active-challenge-basic-details';

    var parameters = {
        uid:this.state.UID,
        device_token: this.state.dev_token
    };
    //alert(this.state.UID);
    //console.log('parameters', parameters);

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
                if (dataobject.status) {
                  //console.log(')))((((((((', dataobject);
                  this.setState({basicDetails: dataobject});
                  this.setState({currentDay: dataobject.details.day});
                   this.setState({notificationCount: dataobject.details.count_non_read_records});
                   var day = await SecureStore.getItemAsync('storeDay');
                   if(day == null) {
                     await SecureStore.setItemAsync('storeDay', JSON.stringify(dataobject.details.day));
                   }
                }
                else{
                  this.setState({email: ''});
                  this.setState({password: ''});
                  this.setState({showloader: false});
                  await SecureStore.setItemAsync('loggedin', JSON.stringify(false));

                  //await SecureStore.deleteItemAsync('FACEBOOKPROFILE')
                  await AsyncStorage.removeItem('FACEBOOKPROFILE');
                  this.props.navigation.navigate('Login');
                }

            }
        )
        .catch((error) => {
            alert(' Exception causes' + error)
        })
  }

    _handelePaymentUpdate = () => {
        this.getChallenges();
    }

    _handeleLoaderUpdate = (val) => {
            //alert(this.state.route);
      if(this.state.route == 'onboarding'  || this.state.route == 'signup') {
          this.setState({dayChangeLoader: val})
      }
      else{
          this.setState({offSetLoader: false});
      }
    }

  _handleAppStateChange = async(nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.state.connection_Status == 'Online') {
      await this.getBasicDetails(this.state.UID);
      var storedDay = await SecureStore.getItemAsync('storeDay');
      var currentDay = this.state.currentDay;
      // console.log('storedDay', storedDay);
      // console.log('currentDay', currentDay);

        if(currentDay != storedDay) {
            await SecureStore.setItemAsync('storeDay', JSON.stringify(currentDay));
            this.getChallenges();
            this.childLeaderBoard.current.getLeaderboard();
            this.childStreaks.current.getLeaderboard();
        }
      }
      this.setState({appState: nextAppState});
    }

    async _handeleDayChange () {
      await this.getBasicDetails(this.state.UID);
      var storedDay = await SecureStore.getItemAsync('storeDay');
      var currentDay = this.state.currentDay;
      // console.log('storedDay', storedDay);
      // console.log('currentDay', currentDay);
        if(currentDay != storedDay) {
            await SecureStore.setItemAsync('storeDay', JSON.stringify(currentDay));
            this.getChallenges();
            this.childLeaderBoard.current.getLeaderboard();
            this.childStreaks.current.getLeaderboard();
        }
      }


    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});
        //console.log(this.state.accessToken);
        if (this.state.accessToken = !'') {
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

    async getChallenges() {
        // if(this.state.route == 'onboarding') {
        //     this.setState({dayChangeLoader: true})
        // }
        // else{
        //     this.setState({offSetLoader: true});
        // }

        var token = await SecureStore.getItemAsync('token');

        var token1 = `Bearer ${JSON.parse(token)}`;
        const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details';
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
              this.setState({offSetLoader: false});
              //this.setState({dayChangeLoader: false});
                    var dataobject = JSON.parse(responseText);
                    this.InheritedData(dataobject);
                    //alert(JSON.stringify(dataobject));
                    console.log('callllllllll', dataobject);
                    return false;

                }
            )
            .catch((error) => {
                alert(' Exception causes' + error)
                this.setState({showloader: false});
            })

    }

    async setUserName(text) {
      var nameArr = text.split(' ');
        this.setState({userName: nameArr[0]})
        try {
            //  await AsyncStorage.setItem('USERCHALLANGEID', ChallengeId);
            await SecureStore.setItemAsync('USERNAME', JSON.stringify(text));
            // await AsyncStorage.setItem('USERID', UserId);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }

    setUserEmail(text) {
        this.setState({userEmail: text})
    }

    // setNotificationCount(text) {
    //     this.setState({notificationCount: text});
    //     //alert( typeof text)
    // }

    setChallenageName(text) {
        this.setState({challangeName: text})
    }

    setChallenageArray(text) {
        this.setState({challengeArray: []})
        this.setState({challengeArray: text})
    }

    setCurrentDate(text) {
        this.setState({currentDate: text})
    }

    setTopstreakArray(text) {
      if(text.length !== 0) {

        var ArrSlide = [];
        text.map((dataholder, index) => {
          var obj = {'name': dataholder.user_details.name, 'image': dataholder.user_details.profile_pic, 'days': dataholder.days}
          ArrSlide.push(obj);
        })
        //console.log('Data Inside Get', ArrSlide);
        this.setState({streakArray: ArrSlide})
      }

    }

    async saveChallengeIdAndUserId(ChallengeId) {
         //alert(ChallengeId)
        try {
             //  await AsyncStorage.setItem('USERCHALLANGEID', ChallengeId);
             await SecureStore.setItemAsync('USERCHALLANGEIDNEW', JSON.stringify(ChallengeId));
             // await AsyncStorage.setItem('USERID', UserId);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }


    InheritedData(dataObject) {
        if (dataObject.status == true) {
            var username = dataObject.userDetails.user_details;
            var challengeDetails = dataObject.challengeDetails;
            this.setState({chlId: challengeDetails.id});
            this.saveChallengeIdAndUserId(this.state.chlId)
            var profile_pic = dataObject.userDetails.user_details.profile_pic;
            if(this.state.userFbProfile == null){
                this.setState({userFbProfile:profile_pic})
            }
            this.setState({paidStatus: dataObject.userDetails.plan_paid});
            this.setUserName(username.username);
            //this.setUserEmail(username.email);
            // this.setNotificationCount(username.push_notification);
            var challangeName = challengeDetails.name;
            this.setChallenageName(challangeName);
            var startDate_ = challengeDetails.start_date;
            var end_date_ = challengeDetails.end_date;
            var status = challengeDetails.status;
            var challengefeatures_array = challengeDetails.challengefeatures;
            var challengeleaderboard_array = challengeDetails.leaderboard;
            var challengetopstreaks_array = challengeDetails.top_streaks;
            var current_date = challengeDetails.current_date;
           // alert(current_date)
            this.setChallenageArray(challengefeatures_array);
            this.setTopstreakArray(challengetopstreaks_array);
            this.setCurrentDate(current_date)
        }
    }

    premium() {
      this.setState({premiumModal: !this.state.premiumModal})
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
            selectedItem: item == 'logout' ? this.logOutWithToken() : this.props.navigation.navigate(item, {profilePic: this.state.userFbProfile}),
        });


        renderTopStreaks(item, rowmap){
          var nums = ["#FFAE55", "#63BE45", "#4AAFE3", "#F7D100"];
          var ranNums = [],
          i = nums.length,
          j = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        ranNums.push(nums[j]);
        var bgColor = nums.splice(j,1);
    }
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
                      <Image source={{uri:item.image}}
                        style={{width: 50, height: 50, borderRadius: 50 / 2, overflow: "hidden", marginTop: 12, marginBottom: 12}}>
                     </Image>
                </View>
                     <View style={{justifyContent: 'center', alignItems: 'center'}}>
                         <Text style={{
                             fontFamily: 'PoppinsSemiBold',
                             fontSize: 10,
                             textAlign: 'center',
                             marginTop: 10
                         }} numberOfLines={2}>{item.name}</Text>
                     </View>
                     <View style={{
                         flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center',
                         marginTop: 3
                     }}>
                     <View style={{
                         flexDirection: 'row',
                         justifyContent: 'center',
                         alignItems: 'center'}}>
                         <Image source={orangearrow} style={{width: 18, height: 16}}>
                         </Image>
                         <Text style={{
                             fontFamily: 'PoppinsBold',
                             fontSize: 10,
                             marginLeft: 0
                         }}>{item.days} Days</Text>
                     </View>
                     </View>
                 </View>
             )

       }

    // Alert.alert('Are you sure you want to log out?' ,'',[{text: 'Cancel', onPress: () => onItemSelected('')}, {text: 'Yes', onPress: () => onItemSelected('Login'),style: 'destructive'}])
    _renderScrollViewContent() {
        const {navigate} = this.props.navigation;

        const basicDetails = this.state.basicDetails;
        if(basicDetails.length !== 0) {
          var challengeName = basicDetails.details.name;
          var currentDate = basicDetails.details.current_date;
        }
        else {
          var challengeName = '';
          var currentDate = '';
        }

        return (

            <View style={styles.scrollViewContent}>

                <View style={{backgroundColor: 'white', marginBottom: 15, flexDirection: 'row'}}>
                    <View style={{backgroundColor: 'transparent', flex: 0.75}}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'PoppinsBold',
                            marginLeft: 10,
                            marginTop: 15
                        }}
                        numberOfLines={1}
                        > {challengeName} </Text>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 0,
                            backgroundColor: 'white'
                        }}>
                            <Image source={calendar} style={{width: 16, height: 16, marginLeft: 15}}>
                            </Image>
                            <Text style={{fontSize: 11, fontFamily: 'PoppinsRegular', marginTop: 4}}> {currentDate}</Text>
                        </View>
                    </View>
                    <View style={{
                        backgroundColor: 'tranparent',
                        flex: 0.25,
                        paddingRight: 10,
                        paddingTop: 23,
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                    }}>
                        {!this.state.paidStatus &&
                            <TouchableOpacity onPress={this.premium}>
                                <View style={{alignItems: 'center'}}>

                                    <Image source={starshinegray}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>

                                    <Text style={{fontSize: 11, fontFamily: 'PoppinsRegular', marginTop: 4}}>InJoy
                                        Premium </Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>


                </View>


                {this.state.basicDetails.length !== 0 &&
                  this.renderUiAccorToIdTest()
                }


                {/*<View style={{flex: 1, height: 1, backgroundColor: 'lightgray'}}>
                        </View>*/}



                {(this.state.basicDetails.length !== 0 && this.state.chlId !== 0) &&
                  <Leaderboard ref={this.childLeaderBoard} basicData = {this.state.basicDetails} _handeleDayChange = {this._handeleDayChange} challengeId = {this.state.chlId} nav = {this.props.navigation}/>
                }


                {(this.state.basicDetails.length !== 0 && this.state.chlId !== 0) &&
                  <TopStreaks ref={this.childStreaks} basicData = {this.state.basicDetails} _handeleDayChange = {this._handeleDayChange} challengeId = {this.state.chlId} nav = {this.props.navigation}/>
                }

                {!this.state.paidStatus &&
                     <UnlockInjoy nav = {this.props.navigation}/>
                }



            </View>


        );
    }

    renderUiAccorToIdTest() {
      const {navigate} = this.props.navigation;

      if (this.state.challengeArray.length == 0) {

      } else {
          return this.state.challengeArray.map((dataholder, index) => {
          var dataObject = dataholder;
          var RenderData = 'Feature'+dataholder.feature_id;
          const ComponentToRender = Features[RenderData];
              return (
                <View style={{flex: 1}} key={index}>
                    <ComponentToRender
                    _handeleDayChange = {this._handeleDayChange}
                    _handelePaymentUpdate = {this._handelePaymentUpdate}
                    _handeleLoaderUpdate = {this._handeleLoaderUpdate}
                    challenge_id = {this.state.chlId}
                    dataFromParent = {dataObject}
                    basicData = {this.state.basicDetails}
                    user_pic = {this.state.userFbProfile}
                    nav = {this.props.navigation}/>
                </View>
              )
          })
    }

    }

    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };


    render() {
      const {navigate} = this.props.navigation;
      var optionArray = [
          'Open Camera',
          'Choose from Gallery',
          'Cancel',
      ];
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


        const menu = <ContentView
            onItemSelected={this.onMenuItemSelected}
            userProfile={this.state.userFbProfile}
            userName={this.state.userName}
        />;

        const basicDetails = this.state.basicDetails;
        if(basicDetails.length !== 0) {
          var points = basicDetails.details.total_points;
          var actions = basicDetails.details.total_streaks;
        }
        else {
          var points = 0;
          var actions = 0;
        }

        return (
            <View style={styles.fill}>


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
                   nav={this.props.navigation}/>
             </View>
            </ImageBackground>
           </View>
           </Modal>

                <SideMenu
                    menu={menu}
                    isOpen={this.state.isOpen}
                    onChange={isOpen => this.updateMenuState(isOpen)}>

                    <Animated.ScrollView
                        style={styles.fill}
                        scrollEventThrottle={1}
                        keyboardShouldPersistTaps={'handled'}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                            {useNativeDriver: true},
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({refreshing: true});
                                    this.getChallenges();
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
                                <Text style={{
                                    fontFamily: 'PoppinsBold',
                                    marginTop: 12,
                                    fontSize: 20
                                }}> {this.state.userName == '' ? '-' : 'Hey '+this.state.userName}
                                </Text>
                                {this.state.paidStatus &&
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 2,
                                        backgroundColor: 'transparent',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{fontFamily: 'PoppinsBold'}}> {points}
                                        </Text>
                                        <Text style={{fontFamily: 'PoppinsRegular'}}> Points
                                        </Text>
                                        <Image source={orangearrow} style={{width: 15, height: 12, marginLeft: 5}}>
                                        </Image>
                                        <Text style={{fontFamily: 'PoppinsRegular', marginLeft: 0, fontWeight: 'bold'}}>{actions}
                                        </Text>
                                    </View>
                                }

                            </View>


                            <View style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginHorizontal: 20,
                                flexDirection: 'row'
                            }}>




                                <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Account')}>
                                    <View>
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
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Notifications',{challengeId: this.state.chlId, challengeArray: this.state.challengeArray, basicArray: this.state.basicDetails, 'onGoBack': this.clearNotification})}>
                                <View style={{height: 30, width: 35, backgroundColor: 'transparent', marginTop: 18}}>

                                    <ImageBackground source={notification} style={{
                                        height: 22,
                                        width: 22,
                                        marginTop: 5,
                                        marginLeft: 16,
                                        alignItems: 'flex-end'
                                    }}>

                                        {this.state.notificationCount !== '0' &&

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
                                </TouchableOpacity>
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

                                    marginLeft: 0
                                }}>
                                    <TouchableOpacity style={{alignItems: 'center', marginTop: 15}}
                                                      onPress={() => [this.props.navigation.navigate('DashBoard'),this.getChallenges()]}>
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
                {this.state.offSetLoader &&
                <Loader loaderVal = {this.state.offSetLoader} />
                }

                {this.state.dayChangeLoader &&
                <LoaderDashboard loaderVal = {this.state.dayChangeLoader} />
                }
                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
                    //Title of the Bottom Sheet
                    title={'Which one do you like ?'}
                    //Options Array to show in bottom sheet
                    options={optionArray}
                    //Define cancel button index in the option array
                    //this will take the cancel option in bottom and will highlight it
                    cancelButtonIndex={2}
                    //If you want to highlight any specific option you can use below prop
                    destructiveButtonIndex={2}
                    onPress={index => {
                        //Clicking on the option will give you the index of the option clicked

                        if (index == 0) {
                            this._takePhoto()
                        } else if (index == 1) {
                            this._pickImage()
                        }
                        // alert(optionArray[index]);
                    }}
                />

            </View>

        );
    }


    ///Selet image from Camera
    _takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1

            });

            let filename = pickerResult.uri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let fileType = match ? `image/${match[1]}` : `image`;

            if (!pickerResult.cancelled) {
                this.setState({image: pickerResult.uri, type: fileType, name: `.${filename}`});
            }

            this.updateProfileAndName();
        }
    };
    ///Selet image from Gallery
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        console.log(result);
        let filename = result.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let fileType = match ? `image/${match[1]}` : `image`;

        if (!result.cancelled) {
            this.setState({image: result.uri, type: fileType, name: `.${filename}`});
        }

        this.updateProfileAndName();
    }

    async updateProfileAndName() {
        //this.setState({showloader: true})
        const url = global.base_url_live+'v1/api/update-user-profile'
        var data = new FormData();
        var imageData = new FormData();
        imageData.append('image',
            {
                uri: this.state.image,
                type: this.state.type,
                name: this.state.imag,
            });

        let imagefile = {
            uri: this.state.image, type: this.state.type, name: this.state.name
        }

        this.setState({userFbProfile: this.state.image});
        var token = await SecureStore.getItemAsync('token');
        var uid = await SecureStore.getItemAsync('id');
        data.append('uid', uid);

        // alert("IN METHOD  "+this.state.userName)
        if (this.state.isNameEditFor) {
            //data.append('uid', uid);
            data.append('username', this.state.userName);
            //  alert("In name condition")
        }
        if (this.state.imageEdit) {
            data.append('image', imagefile);
        }


          //alert(JSON.stringify(data));

        var token1 = `Bearer ${JSON.parse(token)}`;
        // alert(token)
        console.log(token)
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token1,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }),
            body: data
        })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    //console.log('result = = ', responseText)
                    //alert(JSON.stringify(dataobject));

                    if (dataobject.status) {
                        //alert("Profile updated.")
                    } else {
                        alert('failed.')
                    }


                }
            )
            .catch((error) => {
                //Remove textfield data
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])


                console.log("Exception on login time is ===", error)
                // alert(error);
            })

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
                    }

                    else if(dataobject.status == 401) {
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
        marginHorizontal: 15,
        // padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 15, marginTop: 15,
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
