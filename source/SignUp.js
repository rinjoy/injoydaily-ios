import React,{Component} from 'react'
import {View,Text,StyleSheet, AsyncStorage, Dimensions,StatusBar, Image,ImageBackground,TextInput,TouchableOpacity,ScrollView,SafeAreaView,Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import * as Facebook from 'expo-facebook';
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-google-app-auth';
import LoaderDashboard from './loader/LoaderDashboard';
const background = require('./../assets/background.png')
const user = require('./../assets/userborder.png')
const password = require('./../assets/lockdarkgray.png')
const passwordshow = require('./../assets/paswordshow.png')
const paswordhide = require('./../assets/paswordhide.png')

const check = require('./../assets/checkblack.png')
const uncheck = require('./../assets/uncheck.png')

const facebooklogo = require('./../images/fb_logo.png')
const googlelogo = require('./../assets/googlelogo.png')



import Constants from 'expo-constants';
import Spinner from 'react-native-loading-spinner-overlay';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import * as AppleAuthentication from "expo-apple-authentication";

const scrollenable = Platform.OS === 'ios' ? true : true
const getIsLoggedIn = async () => {
    return await SecureStore.getItemAsync('loggedin');
};
export default class SignUp extends React.Component {

        constructor(props) {
            super(props)

            this.state = {
            fullname: '',
            email:'',
            password:'',
            secureTextEntry:true,
            deviceId: Constants.deviceId,
            imagename:uncheck,
            dayChangeLoader: false,
            ischeckd:false,
            showloader:false,
            fullname_waring:'',
            renderpage: true,
                loggedStatus: false,
            email_warning:'',
            password_waring:'',
            terms_waring:'',
            };
        }

    async componentDidMount() {
      //await Facebook.setAutoInitEnabledAsync(true);
        var st = await SecureStore.getItemAsync('loggedin');
        this.setState({loggedStatus: st});
        var that = this;
        //console.log('stststststststststs', st);
        if(st == 'true'){
            //this.setState({dayChangeLoader: true});
            that.props.navigation.navigate('DashBoard', {route: 'signup'});
            that.setState({dayChangeLoader: false});
            setTimeout(() => {
          that.setState({renderpage: false});
        }, 200);
        }
        else {
          that.setState({renderpage: false});

        }
    }


    // handleFacebookLoginSDK() {
    //     LoginManager.logInWithPermissions(['public_profile']).then(
    //         function (result) {
    //             if (result.isCancelled) {
    //                 console.log('Login cancelled')
    //             } else {
    //                 console.log('Login success with permissions: ' + result.grantedPermissions.toString())
    //             }
    //         },
    //         function (error) {
    //             console.log('Login fail with error: ' + error)
    //         }
    //     )
    // }





        render(){
          if(!this.state.renderpage) {
            return(

            <View style = {styles.view_container}>
                {this.state.dayChangeLoader &&
                <LoaderDashboard loaderVal = {this.state.dayChangeLoader} />
                }

                    <ImageBackground source={background} style={styles.backgroundimage_container} resizeMode='stretch'>


                    {/* <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}> */}
                    <View style={styles.contentview_container}>
                      <KeyboardAwareScrollView contentContainerStyle={{ marginBottom: 30}} scrollEnabled={scrollenable} enableOnAndroid={true} >
                      <View>
                    <Text style={{marginLeft:10,fontFamily:'PoppinsSemiBold',fontSize:27}}> Create account </Text>
                    <Text style={{marginTop:5,marginLeft:15,fontSize:14,color:'gray',fontFamily:'PoppinsRegular'}}> Enter your details to get started </Text>

                    {/* Full Name Container */}
                    <View style={styles.emailtextinput_container}>
                    <Image style={styles.image_continer} source={user}>
                    </Image>

                    <TextInput style={styles.textinput_container}  placeholder='Full name' value={this.state.fullname}
                    onChangeText={(text)=>this.setState({fullname:text})} />
                    </View>

                    {this.state.fullname_waring != '' &&
                    <Text style={{color:'red',fontSize:13,marginLeft:20,marginTop:5}}>
                        {this.state.fullname_waring}</Text>
                    }

                    {/* Email Address Container */}
                    <View style={styles.emailtextinput_container}>
                    <Image style={styles.image_continer} source={user}>
                    </Image>

                    <TextInput style={styles.textinput_container} placeholder='Email address' value={this.state.email}
                    onChangeText={(text)=> this.setState({email:text})}>

                    </TextInput>
                    </View>

                    {this.state.email_warning != '' &&
                    <Text style={{color:'red',fontSize:13,marginLeft:20,marginTop:5}}>
                        {this.state.email_warning}</Text>
                    }

                    {/* Password Container */}
                    <View style={styles.passwordtextinput_container}>
                    <Image style={styles.image_continer} source = {password}>
                    </Image>

                    <TextInput style={styles.textinput_container} secureTextEntry={this.state.secureTextEntry} placeholder='Password' value={this.state.password}
                    onChangeText={(text)=>this.setState({password:text}) }>

                    </TextInput>

                    <TouchableOpacity style={{marginRight:10,height:45,width:40,alignItems:'center',justifyContent:'center'}} onPress={()=> this.setState({secureTextEntry: !this.state.secureTextEntry})}>
                    <Image style={styles.passwordimage_continer} source={this.state.secureTextEntry ? passwordshow:paswordhide}>
                    </Image>
                    </TouchableOpacity>
                    </View>

                    {this.state.password_waring != '' &&
                    <Text style={{color:'red',fontSize:13,marginLeft:20,marginTop:5}}>
                        {this.state.password_waring}</Text>
                    }
                    {/* Agree Term Conditions View */}
                    <View style={styles.agreeterms_container}>
                    <TouchableOpacity style={styles.check_button} onPress={() => this.setState({ischeckd: !this.state.ischeckd})}>

                    <Image style={styles.checkimage_continer} source={ this.state.ischeckd ? check:uncheck}>

                    </Image>
                    </TouchableOpacity>


                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('TermsConditions',{profilePic: '', route: 'signup'})}>
                    <Text style={{marginLeft:-3,marginTop:3,fontSize:13,fontFamily:'PoppinsRegular'}}> I agree to all terms and conditions || </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('PrivacyPolicy',{profilePic: '', route: 'signup'})}>
                    <Text style={{marginLeft:-3,marginTop:3,fontSize:13,fontFamily:'PoppinsRegular'}}>Privacy Policy</Text>
                    </TouchableOpacity>
                    </View>

                    </View>

                    {this.state.terms_waring != '' &&
                    <Text style={{color:'red',fontSize:13,marginLeft:20,marginTop:5}}>
                        {this.state.terms_waring}</Text>
                    }

                    {/* Login Buttons Container */}
                    <View style={styles.buttons_continer}>
                    {/* Login Button */}
                    <TouchableOpacity style={styles.login_button} onPress={() => this.validations()}>
                    <Text style={{fontSize:18,fontFamily:'PoppinsSemiBold',color:'white'}}>Create Account </Text>
                    </TouchableOpacity>

                    </View>


                    </View>



                    {/*<View style={{alignItems: "center", marginTop: 20, marginBottom: 20, paddingVertical: 15,*/}
                    {/*    justifyContent: "center",*/}
                    {/*    backgroundColor: 'red',}} >*/}
                    {/*    <TouchableOpacity onPress={() => this.handleFacebookLoginSDK()}>*/}
                    {/*        <Text>Facebook Login</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}

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
                        console.log('credential', credential);

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

                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 6}}>
                        {/*Facebook Button*/}
                        <TouchableOpacity style={styles.facebook_button} onPress={()=> this.handleFacebookLogin()}>
                        <Image style={styles.socialImg_continer} source={facebooklogo}>
                        </Image>
                        <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 16, color: '#fff'}}>Connect with Facebook</Text>
                        </TouchableOpacity>

                        <View style={styles.create_container}>
                        <Text style={{fontSize:13,color:'gray',fontFamily:'PoppinsRegular'}}> Already have an account?
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={{fontSize:13,color:'black',textDecorationLine:'underline',fontFamily:'PoppinsSemiBold',marginLeft:2}}> Sign In </Text>
                        </TouchableOpacity>
                        </View>

                        </View>
                        {/* </ScrollView> */}
                        </KeyboardAwareScrollView>

                    </View>





                    </ImageBackground>

                    <Spinner visible={this.state.showloader} textContent={''} color={'black'} />
                    </View>
            )
          }
          else{
            return (
              <View></View>
            )
          }

        }


        validations() {
            this.setState({password_waring:'',email_warning:'',terms_waring:'',fullname_waring:''})

            const {fullname,email, password} = this.state;
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

            if (fullname == '') {
               this.setState({fullname_waring:'Please enter full name.'})
            }
            else if (email == '') {
                this.setState({email_warning:'Please enter email address.',fullname_waring:''})
            }
            else if(reg.test(email)==false) {
                this.setState({email_warning:'Please enter valid email address.'})
            }
            else if(password == '') {
                this.setState({password_waring:'Please enter password.',email_warning:''})

            } else if(this.state.ischeckd == false) {
                this.setState({terms_waring:'Please check all terms and conditions.',password_waring:''})
            }
            else {
                this.setState({showloader: true})

                this.registerUser(email,password,this.state.deviceId,fullname,'d')

            }
        }

        async registerUser(email,password,deviceId,fullname,source) {

            var parameters = {
                "email" : email,
                "password_hash" : password,
                "mobile_id" :this.state.deviceId,
                "source" : source,
                "username" : fullname,
                "token": '',

            };

            const register_url = global.base_url_live+'v1/api/app-register'
            fetch(register_url,
                {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                    }), body: JSON.stringify(parameters),
                })
                .then(async (response) => response.text())
                .then(async (responseText) => {
                     var dataobject  =  JSON.parse(responseText);

                     //Remove textfield data


                      if(dataobject.status==1) {
                        this.setState({email:''})
                        this.setState({password:''})
                        this.setState({fullname:''})
                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));

                        this.setState({showloader: false})
                        this.props.navigation.navigate('WalkThrough')
                      }else {
                        Alert.alert('injoy' ,dataobject.message,[{text: 'Ok', onPress: () => this.setState({showloader: false})}])

                      }


                    }
                )
                .catch((error) => {
                    //Remove textfield data
                    // this.setState({email:''})
                    // this.setState({password:''})
                    // this.setState({fullname:''})
                    Alert.alert('injoy' , JSON.stringify(error),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])


                    console.log("Exception on login time is ===", error)
                    // alert(error);
                })
        }

    // // Facebook Call
    // async handleFacebookLogin(){
    //
    //     //Remove textfield data
    //     this.setState({email:''})
    //     this.setState({password:''})
    //     this.setState({fullname:''})
    //     this.setState({password_waring:'',email_warning:'',terms_waring:'',fullname_waring:''})
    //
    //     try {
    //         await Facebook.initializeAsync('786186658788447');
    //         const {
    //           type,
    //           token,
    //           expires,
    //           permissions,
    //           declinedPermissions,
    //         } = await Facebook.logInWithReadPermissionsAsync({
    //             permissions: ['public_profile','email'],
    //         });
    //         if (type === 'success') {
    //           // Get the user's name using Facebook's Graph API
    //           const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,birthday&access_token=${token}`);
    //           const result = await response.json();
    //
    //           this.handleSignUpApi(JSON.stringify(result),'f')
    //
    //          }
    //       } catch ({ message }) {
    //         alert(`Facebook Login Error: ${message}`);
    //       }
    //   };

    // Facebook Call
    // Facebook Call
    async handleFacebookLogin() {

        //Remove textfield data
        this.setState({email: ''});
        this.setState({password: ''});
        this.setState({fullname: ''});
        this.setState({password_waring: '', email_warning: '',terms_waring:'',fullname_waring:''});



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
                this.saveUserProfileToLocalStorage(JSON.stringify(result.picture.data.url));

                this.handleSignUpApi(JSON.stringify(result),'f')

            }
        } catch ({message}) {
            alert(`Facebook Login Error in catch block: ${message}`);
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
    async handleSignInWithApple(result, source) {

        //Remove textfield data
        this.setState({email: ''});
        this.setState({password: ''});
        this.setState({fullname: ''});
        this.setState({password_waring: '', email_warning: '',terms_waring:'',fullname_waring:''});

        var data = result;


        var parameters = {
            "email": data.email,
            "password_hash": '',
            "mobile_id" :this.state.deviceId,
            "token": data.user,
            "source": source,
            "username": data.fullName.givenName,
        };
        //console.log('parameters', parameters);
        const register_url = global.base_url_live+'v1/api/app-register'
        fetch(register_url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject  =  JSON.parse(responseText);
                    //console.log('dataobject', dataobject);

                    if(dataobject.status==1) {

                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));
                        this.setState({showloader: false})
                        if(dataobject.ifShowOnboarding) {
                            this.props.navigation.navigate('WalkThrough');
                        }
                        else{
                            this.props.navigation.navigate('DashBoard', {route: 'signup'});
                        }
                    }else {
                        Alert.alert('injoy' ,dataobject.message,[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                    }

                }
            )
            .catch((error) => {

                console.log("Exception on login time is ===", error)
                // alert(error);
                Alert.alert('injoy' , JSON.stringify(error),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
            })
    }


          //   Sign Up Call
          async handleSignUpApi(result,source) {

            this.setState({showloader: true})

            var data = JSON.parse(result);

                var parameters = {
                    "email" : data.email,
                    "password_hash" : "",
                    "mobile_id" :this.state.deviceId,
                    "source" : source,
                    "username" : data.name,
                    "token": data.id,
                };
              const register_url = global.base_url_live+'v1/api/app-register'
              fetch(register_url,
                {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                    }), body: JSON.stringify(parameters),
                })
                .then(async (response) => response.text())
                .then(async (responseText) => {
                     var dataobject  =  JSON.parse(responseText);


                      if(dataobject.status==1) {

                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));
                        await SecureStore.setItemAsync('loggedin', JSON.stringify(true));

                        this.setState({showloader: false})
                        if(dataobject.ifShowOnboarding) {
                            this.props.navigation.navigate('WalkThrough');
                        }
                        else{
                            this.props.navigation.navigate('DashBoard', {route: 'signup'});
                        }
                      }else {
                        Alert.alert('injoy' ,dataobject.message,[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                      }

                    }
                )
                .catch((error) => {

                    console.log("Exception on login time is ===", error)
                    // alert(error);
                    Alert.alert('injoy' , JSON.stringify(error),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                })
          }



      //Goole login
    handleGoogleLogin = async() => {
        try {
            const result = await Google.logInAsync({
                androidClientId: '7867111723-2ttfp223u4mf4an7kiq4gfns3n5ma80v.apps.googleusercontent.com',
                iosClientId: '7867111723-8fi134vckr33007v9r8i9mvuerhjvvda.apps.googleusercontent.com',
                androidStandaloneAppClientId: '7867111723-2ttfp223u4mf4an7kiq4gfns3n5ma80v.apps.googleusercontent.com',
                iosStandaloneAppClientId: '7867111723-8fi134vckr33007v9r8i9mvuerhjvvda.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
              });

            if (result.type === 'success') {
              this.handleSignUpWithGoogle(result,'g')
            } else {
             alert('cancelled')

            }
          } catch (e) {
            return { error: true };
          }

    }



        //   Sign Up Call
        async handleSignUpWithGoogle(result,source) {

            this.setState({showloader: true})

            var parameters = {
                "email" : result.user.email,
                "password_hash" : '',
                "token" :result.user.id,
                "source": source,
                "username" : result.user.name,
            };

            const register_url = global.base_url_live+'v1/api/app-register'
              fetch(register_url,
                {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                    }), body: JSON.stringify(parameters),
                })
                .then(async (response) => response.text())
                .then(async (responseText) => {
                     var dataobject  =  JSON.parse(responseText);


                      if(dataobject.status==1) {

                        await SecureStore.setItemAsync('id', JSON.stringify(dataobject.user_details.id));
                        await SecureStore.setItemAsync('token', JSON.stringify(dataobject.user_details.access_token));

                        this.setState({showloader: false})
                        this.props.navigation.navigate('WalkThrough')
                      }else {
                        Alert.alert('injoy' ,dataobject.message,[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                      }

                    }
                )
                .catch((error) => {

                    console.log("Exception on login time is ===", error)
                    // alert(error);
                    Alert.alert('injoy' , JSON.stringify(error),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                })
          }



    }

    const styles = StyleSheet.create( {

        spinnerTextStyle: {
            color: 'green'
          },
        view_container: {
            flex:1,

        },

        safearea: {
            flex: 1,
          },

        scrollView: {
            flex:1,
        },

        contentview_container: {
            height: '80%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99,
            justifyContent:'flex-end',
            backgroundColor: 'transparent',
        },

        emailtextinput_container: {
            flexDirection:'row',
            marginTop:15,
            marginLeft:20,
            marginRight:20,
            justifyContent:'flex-start',
            alignItems:'center',
            height:50,
            borderColor:'lightgray',
            borderWidth:1.5,

        },

        passwordtextinput_container: {
            flexDirection:'row',
            marginTop:15,
            marginLeft:20,
            marginRight:20,
            justifyContent:'flex-start',
            alignItems:'center',
            height:50,
            borderColor:'lightgray',
            borderWidth:1.5,

        },

        textinput_container: {
            fontSize:15,
            height:45,
            marginLeft:15,
            flex:1,
            fontFamily:'PoppinsRegular',

        },

           password_container: {
            fontSize:15,
            height:45,
            marginLeft:20,
            flex:1,
            fontFamily:'PoppinsRegular'

        },

        backgroundimage_container: {
            //flex:1,
            height: '100%'
        },

        image_continer: {
            marginLeft:12,
            width:16,
            height:16
        },

        passwordimage_continer: {
            marginLeft:12,
            width:18,
            height:13
        },

        agreeterms_container: {
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'flex-start',
            marginTop:20,
            marginHorizontal:20,
            height:40,
        },

        checkimage_continer: {
            width:18,
            height:18
        },

        buttons_continer: {
            //flexDirection:'row',
            //flex: 1,
            alignItems:'center',
            justifyContent:'flex-start',
            marginLeft:0,
            marginRight:0,
            backgroundColor: 'transparent',
            height: 45,
            marginTop:8,
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
            width:55,
            height:55,
            alignItems:'center',
            justifyContent:'center',
            marginLeft:7,
            marginRight:8,
            borderRadius:3
        },
        socialImg_continer: {
            marginRight:8,
            width:8,
            height:18
        },

        check_button: {
            width:40,
            height:40,
            alignItems:'center',
            justifyContent:'center',
            marginLeft:-10,
        },

        create_container: {
            flexDirection:'row',
            //flex:1,
            //height:'14%',
            justifyContent:'center',
            alignItems:'flex-start',
            marginBottom: 20,
            marginTop: 30
        },

    });
