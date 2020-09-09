import React from 'react';
import {
    Alert,
    AsyncStorage,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    Keyboard,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View, Animated, AppState
} from 'react-native';

import SignUp from '../source/SignUp'
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import * as SecureStore from 'expo-secure-store';
import * as AppleAuthentication from 'expo-apple-authentication';
import Spinner from 'react-native-loading-spinner-overlay';
// import NetInfo from "@react-native-community/netinfo";
import OneSignal from "react-native-onesignal";

const background = require('./../assets/background.png');
const user = require('./../assets/userborder.png');
const password = require('./../assets/lockdarkgray.png');
const passwordshow = require('./../assets/paswordshow.png');
const paswordhide = require('./../assets/paswordhide.png');
const facebooklogo = require('./../images/fb_logo.png');
const googlelogo = require('./../assets/googlelogo.png');



const getIsLoggedIn = async () => {
    return await SecureStore.getItemAsync('loggedin');
};

export default class Login extends React.Component {

    componentDidMount() {
        //NetInfo.addEventListener(this.handleConnectivityChange);
        // NetInfo.fetch().then(state => {
        //     console.log('Connection type', state.type);
        //     console.log('Is connected?', state.isConnected);
        //     if(!state.isConnected) {
        //         alert('Please check internet connectivity.');
        //         return false;
        //     }
        // });

        // getIsLoggedIn().then(bool => {
        //         // alert(bool)
        //         bool == "true" &&
        //         this.props.navigation.navigate('DashBoard');
        //         //this.props.navigation.navigate('WalkThrough');
        //     }
        // );
    }

    handleConnectivityChange = state => {
        if (state.isConnected) {
            this.setState({connection_Status: 'Online'});
        } else {
            this.setState({connection_Status: 'Offline'});
        }
    };

    componentWillUnmount() {
        //NetInfo.removeEventListener(this.handleConnectivityChange);
    }


    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            fullname: '',
            connection_Status: 'Online',
            secureTextEntry: true,
            email_warning: '',
            password_waring: '',
        };
    }

    async onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user is authenticated
        if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
            // user is authenticated
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.view_container}>


                {/* <SafeAreaView style={styles.safearea}> */}
                <ImageBackground source={background} style={styles.backgroundimage_container} resizeMode='stretch'>
                    {/* <KeyboardAwareScrollView style={{flex:1}} enableOnAndroid={true}> */}
                    <View style={styles.contentview_container}>
                        <Text style={{marginLeft: 10, fontSize: 27, fontFamily: 'PoppinsSemiBold'}}> Sign In </Text>
                        <Text style={{

                            fontFamily: 'PoppinsRegular',
                            marginTop: 5,
                            marginLeft: 15,
                            fontSize: 14,
                            color: 'gray',

                        }}> Enter your details to get started </Text>

                        {/* Email Container */}
                        <View style={styles.emailtextinput_container}>
                            <Image style={styles.image_continer} source={user}>
                            </Image>
                            <TextInput style={styles.email_container} keyboardType='email-address' placeholder='Email address'
                                       value={this.state.email}
                                       onChangeText={(text) => this.setState({email: text})}>
                            </TextInput>
                        </View>

                        {this.state.email_warning != '' &&
                        <Text style={{color: 'red', fontSize: 13, marginLeft: 20, marginTop: 5}}>
                            {this.state.email_warning}</Text>
                        }


                        {/* Password Container */}
                        <View style={styles.passwordtextinput_container}>
                            <Image style={styles.image_continer} source={password}>
                            </Image>

                            <TextInput style={styles.password_container} secureTextEntry={this.state.secureTextEntry}
                                     placeholder='Password' value={this.state.password}
                                       onChangeText={(text) => this.setState({password: text})}>

                            </TextInput>

                            <TouchableOpacity style={{
                                marginRight: 10,
                                height: 45,
                                width: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} onPress={() => this.setState({secureTextEntry: !this.state.secureTextEntry})}>
                                <Image style={styles.passwordimage_continer}
                                       source={this.state.secureTextEntry ? passwordshow : paswordhide}>
                                </Image>
                            </TouchableOpacity>
                        </View>

                        {this.state.password_waring != '' &&
                        <Text style={{color: 'red', fontSize: 13, marginLeft: 20, marginTop: 5}}>
                            {this.state.password_waring}</Text>
                        }
                        {/* Login Buttons Container */}
                        <View style={styles.buttons_continer}>
                            {/* Login Button */}
                            <TouchableOpacity style={styles.login_button} onPress={() => this.validations()}>
                                <Text
                                    style={{fontSize: 16, color: 'white', fontFamily: 'PoppinsSemiBold'}}> LOGIN </Text>
                            </TouchableOpacity>



                            {/* Google Button
                            <TouchableOpacity style={styles.google_button} onPress={() => this.handleGoogleLogin()}>
                                <Image style={styles.socialImg_continer} source={googlelogo}>
                                </Image>
                            </TouchableOpacity>
                            */}
                        </View>


                    </View>

                    <View style={{backgroundColor: 'transparent', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <AppleAuthentication.AppleAuthenticationButton
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            style={{ width: 250, height: 45}}
                            cornerRadius={30}
                            onPress={async () => {
                                try {
                                    const credential = await AppleAuthentication.signInAsync({
                                        requestedScopes: [
                                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                        ],
                                    });
                                    //console.log('credential', credential);

                                         this.handleSignInWithApple(credential, 'a');


                                } catch (e) {
                                    if (e.code === 'ERR_CANCELED') {
                                        alert('cancel');
                                    } else {
                                        // handle other errors
                                    }
                                }
                            }}
                        />
                    </View>


                    {/* Forgot Password */}


                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 6}}>
                        {/*<TouchableOpacity style={styles.forgotpassword}>
                            <Text style={{fontSize: 15, color: 'gray'}}> Forgot your
                                password? </Text>
                        </TouchableOpacity>*/}

                        <TouchableOpacity style={styles.facebook_button} onPress={() => this.handleFacebookLogin()}>
                            <Image style={styles.socialImg_continer} source={facebooklogo}>
                            </Image>
                            <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 16, color: '#fff'}}>Connect with Facebook</Text>
                        </TouchableOpacity>

                        {/* Create Account */}
                        <View style={styles.create_container}>
                            <Text style={{fontSize: 13, color: 'gray',}}> Don't have an
                                account?
                            </Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                                <Text style={{
                                    fontSize: 13,
                                    color: 'black',
                                    textDecorationLine: 'underline',
                                    marginLeft: 2,

                                }}> Create </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* </KeyboardAwareScrollView> */}
                </ImageBackground>
                {/* </SafeAreaView> */}

                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>


            </View>
            </TouchableWithoutFeedback>
        )


    }


    validations() {
        this.setState({password_waring: '', email_warning: ''});

        const {email, password} = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (email == '') {
            this.setState({email_warning: 'Please enter email address.'})
        } else if (reg.test(email) == false) {
            this.setState({email_warning: 'Please enter valid email address.'})
        } else if (password == '') {
            this.setState({password_waring: 'Please enter password.', email_warning: ''})
        } else {
            this.setState({password_waring: '', email_warning: ''});

            this.setState({showloader: true});

            this.loginUserWitheEmailPassword(email, password)

        }
    }

    async loginUserWitheEmailPassword(email, password) {
        Keyboard.dismiss();
        var parameters = {
            "email": email,
            "password_hash": password,
            "token": '',
            "source": 'd'
        };
        const url_login = global.base_url_live+'v1/api/app-login';
         // console.log(url_login);
          //console.log(parameters);

        fetch(url_login,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {

                    var dataobject = JSON.parse(responseText);
                console.log('datageeeeeet', dataobject);

                if (dataobject.status == 1) {
                        Keyboard.dismiss();
                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));

                        this.setState({email: ''});
                        this.setState({password: ''});
                        this.setState({showloader: false});
                         if(dataobject.ifShowOnboarding) {
                            this.props.navigation.navigate('WalkThrough');
                          }
                      else{
                             //this.props.navigation.navigate('WalkThrough');
                             this.props.navigation.navigate('DashBoard', {route: 'login'});
                         }

                    } else {
                        Alert.alert('injoy', dataobject.message, [{
                            text: 'Ok',
                            onPress: () => this.setState({showloader: false})
                        }])

                    }


                }
            )
            .catch((error) => {
                //console.log('check_error', error);
                //Remove textfield data
                // this.setState({email:''})
                // this.setState({password:''})
                Alert.alert('injoy', JSON.stringify(error), [{text: 'Ok', onPress: () => this.setState({showloader: false})}]);


                //console.log("Exception on login time is ===", error)
                // alert(error);
            })
    }

    // Facebook Call
    // Facebook Call
    async handleFacebookLogin() {

        //Remove textfield data
        this.setState({email: ''});
        this.setState({password: ''});
        this.setState({fullname: ''});
        this.setState({password_waring: '', email_warning: ''});



        try {
            await Facebook.initializeAsync('326540275214163');
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });

            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?fields=id,name,picture,email,birthday&access_token=${token}`);
                const result = await response.json();

                 //   alert(JSON.stringify(result));
                this.saveUserProfileToLocalStorage(JSON.stringify(result.picture.data.url));
                this.handleSignInWithFB(JSON.stringify(result), 'f')

            }
        } catch ({message}) {
            alert(`Facebook Login Error in catch block: ${message}`);
        }
    };


    //   Sign Up Call
    async handleSignInWithApple(result, source) {

        //this.setState({showloader: true});

        var data = result;
         console.log('Data', data.user);

        var parameters = {
            "email": data.email,
            "password_hash": '',
            "token": data.user,
            "source": source,
            "username": data.fullName.givenName,
        };
        //console.log('parameters', parameters);
        const url_login = global.base_url_live+'v1/api/app-login';
        fetch(url_login,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);

                      console.log(dataobject);
                      //alert(JSON.stringify(dataobject))
                    //  return

                    if (dataobject.status == 1) {
                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));

                        this.setState({showloader: false});
                        if(dataobject.ifShowOnboarding) {
                            this.props.navigation.navigate('WalkThrough');
                        }
                        else{
                            this.props.navigation.navigate('DashBoard', {route: 'login'});
                        }
                    } else {
                        Alert.alert('injoy', JSON.stringify(dataobject.message), [{
                            text: 'Ok',
                            onPress: () => this.setState({showloader: false})
                        }])
                    }

                }
            )
            .catch((error) => {

                console.log("Exception on login time is ===", error);
                // alert(error);
                Alert.alert('injoy', JSON.stringify(error), [{text: 'Ok', onPress: () => this.setState({showloader: false})}])
            })
    }

    //   Sign Up Call
    async handleSignInWithFB(result, source) {

        this.setState({showloader: true});

        var data = JSON.parse(result);
        //console.log(data);
        var parameters = {
            "email": data.email,
            "password_hash": '',
            "token": data.id,
            "source": 'f',
            "username": data.name,
        };
        const url_login = global.base_url_live+'v1/api/app-login';
        fetch(url_login,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    console.log('dataobject', dataobject);
                    if (dataobject.status == 1) {
                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));

                        this.setState({showloader: false});
                        if(dataobject.ifShowOnboarding) {
                            this.props.navigation.navigate('WalkThrough');
                        }
                        else{
                            this.props.navigation.navigate('DashBoard', {route: 'login'});
                        }
                    } else {
                         Alert.alert('injoy', JSON.stringify(dataobject.message), [{
                            text: 'Ok',
                             onPress: () => this.setState({showloader: false})
                        }])
                    }

                }
            )
            .catch((error) => {

                console.log("Exception on login time is ===", error);
                // alert(error);
                Alert.alert('injoy', JSON.stringify(error), [{text: 'Ok', onPress: () => this.setState({showloader: false})}])
            })
    }


//Goole login
    handleGoogleLogin = async () => {


        try {
            const { type, accessToken, user } = await Google.logInAsync({
                behavior:'web',
                iosClientId: `283971303975-o8j1m5abjujcrqnbel1dbd55m49t1pei.apps.googleusercontent.com`,
                iosStandaloneAppClientId: `283971303975-g82qihhqfovdd8b9jr0t51a639s3169u.apps.googleusercontent.com`,
                scopes: ['profile', 'email'],
            });

            // const result = await Google.logInAsync({
            //     behavior:'web',
            //     iosClientId: '283971303975-o8j1m5abjujcrqnbel1dbd55m49t1pei.apps.googleusercontent.com',
            //     //androidClientId: '283971303975-p8eig98f9ujc4i1troiie75t5b207frg.apps.googleusercontent.com',
            //     iosStandaloneAppClientId: '283971303975-g82qihhqfovdd8b9jr0t51a639s3169u.apps.googleusercontent.com',
            //     //androidStandaloneAppClientId: '7867111723-2ttfp223u4mf4an7kiq4gfns3n5ma80v.apps.googleusercontent.com',
            //     scopes: ['profile', 'email'],
            // });

            if (type === 'success') {
                /* console.log("GMAIL INFO====>>>"+JSON.stringify(result));*/

                this.handleSignInWithGoogle(result, 'g');
            } else {
                alert('cancelled');

            }
        } catch (e) {
            return {error: true};
        }

    };

    async saveUserProfileToLocalStorage(data) {
        try {
            await AsyncStorage.setItem('FACEBOOKPROFILE', data);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }

    //   Sign Up Call
    async handleSignInWithGoogle(result, source) {

        this.setState({showloader: true});
        // console.log(JSON.stringify(result.user.photoUrl));
        this.saveUserProfileToLocalStorage(JSON.stringify(result.user.photoUrl));
        var parameters = {
            "email": result.user.email,
            "password_hash": '',
            "token": result.user.id,
            "source": source,
            "username": result.user.name,
        };
        const url_login = global.base_url_live+'v1/api/app-login';
        fetch(url_login,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);

                    if (dataobject.status == 1) {

                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));

                        this.setState({showloader: false});

                        if(dataobject.ifShowOnboarding) {
                            this.props.navigation.navigate('WalkThrough');
                        }
                        else{
                            this.props.navigation.navigate('DashBoard', {route: 'login'});
                        }
                    } else {
                        Alert.alert('injoy', JSON.stringify(dataobject.message), [{
                            text: 'Ok',
                            onPress: () => this.setState({showloader: false})
                        }])
                    }

                }
            )
            .catch((error) => {

                console.log("Exception on login time is ===", error);
                Alert.alert('injoy', JSON.stringify(error), [{text: 'Ok', onPress: () => this.setState({showloader: false})}])
            })
    }


}

const styles = StyleSheet.create({

    view_container: {
        flex: 1,
    },

    scrollView: {
        flex: 1,
    },

    contentview_container: {
        height: '70%',
        justifyContent: 'flex-end',
    },

    emailtextinput_container: {
        flexDirection: 'row',
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        borderColor: 'lightgray',
        borderWidth: 1.5,
        fontFamily: 'PoppinsRegular',
    },

    passwordtextinput_container: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        borderColor: 'lightgray',
        borderWidth: 1.5,
        fontFamily: 'PoppinsRegular',
    },

    email_container: {
        fontSize: 15,
        height: 45,
        marginLeft: 15,
        flex: 1,

    },

    password_container: {
        fontSize: 15,
        height: 45,
        marginLeft: 20,
        flex: 1, fontFamily: 'PoppinsRegular',

    },

    backgroundimage_container: {
        flex: 1,
    },

    image_continer: {
        marginLeft: 12,
        width: 16,
        height: 16
    },
    passwordimage_continer: {
        marginLeft: 12,
        width: 18,
        height: 13
    },
    buttons_continer: {
        //flexDirection: 'row',
        alignItems:'center',
        justifyContent:'flex-start',
        marginLeft:0,
        marginRight:0,
        backgroundColor: 'transparent',
        height: 45,
        marginTop:15,
    },

    login_button: {
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      width: 250, height: 45,
      backgroundColor: '#4AAFE3',
      borderRadius:30
    },

    facebook_button: {
        width: 250, height: 45,
        flexDirection: 'row',
        backgroundColor: 'rgb(60,94,244)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30
    },
    google_button: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        marginRight: 8,
        borderRadius: 3
    },
    socialImg_continer: {
        marginRight:8,
        width:8,
        height:18
    },

    forgotpassword: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,
    },

    create_container: {
        flexDirection: 'row',
        marginHorizontal: 40,
        height: 30,
        marginTop: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },


});
