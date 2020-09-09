import React, { Component } from 'react';
import { AppLoading} from 'expo';

import 'expo-asset';
import * as Font from 'expo-font';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import OfflineNotice from './OfflineNotice';
import Router from './source/Root';
import {Audio} from 'expo-av';
import { MenuProvider } from 'react-native-popup-menu';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from "expo-secure-store";
import NavigationService from './NavigationService.js';
import NetInfo from "@react-native-community/netinfo";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
var appId = '97509bcd-1f21-4a3f-ba6f-916e9bdacd4b';
var requiresPrivacyConsent = true;
console.disableYellowBox = true;
const experience_id = "@saurabh_brihaspati/injoy";
// Prevent native splash screen from autohiding before App component declaration\
setJSExceptionHandler(async(error, isFatal) => {

  let err = error.toString();
   var token = await SecureStore.getItemAsync('token');
  let id = await SecureStore.getItemAsync('id');
    console.log('caught global error',error);
  if(token != undefined && token != null){
       var token1 = `Bearer ${JSON.parse(token)}`;
       var parameters = {
            "uid" : id,
            "error_message" : err,
            "title" : "Caught global error"
          }
          console.log('parameters', parameters)
    fetch(global.base_url_live+"v1/api/send-crash-report",
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token1,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
        console.log(responseText)
      })
  }
}, true);

setNativeExceptionHandler(async(errorString) => {
  let isFatal = true;
//handleError(errorString, isFatal);
 var token = await SecureStore.getItemAsync('token');
  let id = await SecureStore.getItemAsync('id');
    console.log('caught global error',error);
  if(token != undefined && token != null){
       var token1 = `Bearer ${JSON.parse(token)}`;
       var parameters = {
            "uid" : id,
            "error_message" : errorString,
            "title" : "Caught global error"
          }
          console.log(parameters)
    fetch(global.base_url_live+"v1/api/send-crash-report",
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token1,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
        console.log(responseText)
      })
  }

});


SplashScreen.preventAutoHideAsync()
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn); // it's good to explicitly catch and inspect any error



    export default class App extends React.Component {
      constructor(props) {
       super(props)



       this.state = {
         fontLoaded: false,
         appIsReady: false,
           connection_Status: 'Online',
       }
     }

        handleConnectivityChange = state => {
            if (state.isConnected) {
                this.setState({connection_Status: 'Online'});
            } else {
                this.setState({connection_Status: 'Offline'});
            }
        };


        //componentWillUnmount() {
            //NetInfo.removeEventListener(this.handleConnectivityChange);
        //}




     async componentDidMount() {
         NetInfo.addEventListener(this.handleConnectivityChange);

          await Audio.setAudioModeAsync({
               playsInSilentModeIOS: true,
               allowsRecordingIOS: false,
               interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
               shouldDuckAndroid: false,
               interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
               playThroughEarpieceAndroid: true
           })


          try {
            await SplashScreen.preventAutoHideAsync();
          } catch (e) {
            console.warn(e);
          }
         //
          this.prepareResources();
          }


          prepareResources = async () => {

             await this.doFontLoad();
            this.setState({ appIsReady: true }, async () => {
              await SplashScreen.hideAsync();
                //this.registerForPushNotificationsAsync();
            });
  }

        //Notifications

       // registerForPushNotificationsAsync = async () => {
            // if (Constants.isDevice) {
                // const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                // let finalStatus = existingStatus;
                //
                // if (existingStatus !== 'granted') {
                //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                //     finalStatus = status;
                // }
                //
                // if (finalStatus !== 'granted') {
                //     alert('Failed to get push token for push notification!');
                //     return;
                // }
                //
                // let experienceId = undefined;
                //
                // if (!Constants.manifest) {
                //     // Absence of the manifest means we're in bare workflow
                //     experienceId = experience_id;
                // }
                // const expoPushToken = await Notifications.getExpoPushTokenAsync({
                //     experienceId,
                // });
                // console.log('expoPushToken', expoPushToken.data);
                //alert(expoPushToken.data);
                //alert(expoPushToken.data);
                // this.setState({ expoPushToken: expoPushToken.data });
                // await SecureStore.setItemAsync('device_token', this.state.expoPushToken);
            // } else {
            //     alert('Must use physical device for Push Notifications');
            // }

       // };


      /**
   * Method that serves to load resources and make API calls
   */

     async doFontLoad() {
          try {
              await Font.loadAsync({
                  'PoppinsBold': require('./assets/fonts/Poppins-Bold.ttf'),
                  'PoppinsLight': require('./assets/fonts/Poppins-Light.ttf'),
                  'PoppinsMedium': require('./assets/fonts/Poppins-Medium.ttf'),
                  'PoppinsRegular': require('./assets/fonts/Poppins-Regular.ttf'),
                  'PoppinsSemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),

                  'calibriBold': require('./assets/fonts/calibri-bold.ttf'),
                  'calibriLight': require('./assets/fonts/calibri-light.ttf'),
                  'calibriMedium': require('./assets/fonts/calibri-regular.ttf'),
                  'calibriRegular': require('./assets/fonts/calibri-regular.ttf'),
                  'calibriSemiBold': require('./assets/fonts/calibri-bold.ttf'),
              });
            //  alert(              Font.isLoaded( 'Poppins-Regular')

          }
          catch (e) {

              //alert('IN catch Block'+e);
              //console.log(e)
          }



         this.setState({fontLoaded: true});

     }

        render() {
          if (!this.state.appIsReady) {
            return null;
          }

              return  (<View style={{flex:1, backgroundColor: 'transparent'}}>

                   <MenuProvider>
                       {this.state.connection_Status == 'Offline' &&
                               <OfflineNotice />
                       }
                       <Router ref={navigationRef =>
                       {NavigationService.setTopLevelNavigator(navigationRef);}}/>
                   </MenuProvider>

              </View>)

    }
    }
