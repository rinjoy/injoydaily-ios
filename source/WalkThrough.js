/*This is an example of React Native App Intro Slider */
import React from 'react';
//import react in project
import {Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
//import all the required component

//import { ImageManipulator } from 'expo-image-crop'
//import * as ImageManipulator from 'expo-image-manipulator';
import ImageManipulator from './manipulator/ImageManipulator'
import AppIntroSlider from 'react-native-app-intro-slider';
import * as SecureStore from 'expo-secure-store';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-easy-toast";
import Emoji from "react-native-emoji";
import HTML from "react-native-render-html";
import LoaderDashboard from "./loader/LoaderDashboard";

const background1 = require('./../images/background1.png')
const background2 = require('./../images/background2.png')
const background3 = require('./../images/background3.png')
const image1 = require('./../images/image1.png')
const userDupl = require('./../images/user-1.png')
const image2 = require('./../images/image-5.png')
const image3 = require('./../images/image-3.png')
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const crossarrow = require('./../images/close.png');
const play_btn = require('./../images/play-btn.png')

// const getAccessToken = async () => {
//   return await SecureStore.getItemAsync('token');
// };

// const getUserId = async () => {
//   return await SecureStore.getItemAsync('id');
// };

// const slides = [
//   {
//     key: 's1',
//     text: 'This online program will give you the ability to imcorporate the challenge theme into your life and career through some fun, simple actions.',
//     title: 'Welcome to the \n Challenge!',
//     image:image1,
//     background: background1,
//     // backgroundColor: '#20d2bb',
//   },
//   {
//     key: 's2',
//     text: 'This Challenge is designed to be very user friendly, and we will be walking you through every single step over the next couple if months',
//     title: 'How to use \n the App',
//     image: image3,
//     background: background2,
//     // backgroundColor: '#febe29',
//   },
//   {
//     key: 's3',
//     text: 'Before we dive into this terrific Challenge there are a couple things that we have designed to really set you up for success',
//     title: 'Getting started',
//     image: image2,
//     background: background3,

//    // backgroundColor: '#22bcb5',
//   }
// ];


//import AppIntroSlider to use it
export default class WalkThrough extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRealApp: false,
            isVisible: false,
            token: '',
            showloader: false,
            data_arr: [],
            image: null,
            hasCameraPermission: null,
            type: null,
            name: null,
            finaluri: null,
            imageUri: null,
            //asas :"https://i.pinimg.com/originals/39/42/a1/3942a180299d5b9587c2aa8e09d91ecf.jpg"
            // uri: 'https://i.pinimg.com/originals/39/42/a1/3942a180299d5b9587c2aa8e09d91ecf.jpg',
            //To show the main page of the app
        };
    }


    async componentDidMount() {
        this.getOnBoardItems();
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const hasCameraPermission = (camera.status === 'granted');
        this.setState({hasCameraPermission: hasCameraPermission});
    }


    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    }
    _onDone = async() => {
        this.setState({showloader: true})
        const url = global.base_url_live+'v1/api/update-user-onboarding-status'

        var token = await SecureStore.getItemAsync('token');
        var uid = await SecureStore.getItemAsync('id');

        var parameters = {
            "uid": uid,
        };

        //  alert(JSON.stringify(data));
        var token1 = `Bearer ${JSON.parse(token)}`;
        // alert(token)
        //   console.log(token)
        fetch(url, {
            method: 'POST',
            headers: new Headers({
                'Authorization': token1,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(parameters)
        })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);
                    var that = this;

                    if (dataobject.status) {
                      this.setState({showloader: false})
                          that.props.navigation.navigate('DashBoard',{route: 'onboarding'});

                    }
                }
            )
            .catch((error) => {
                //Remove textfield data
                this.setState({showloader: false})
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                console.log("Exception on login time is ===", error)
                // alert(error);
            })


    };
     setImageOn(){
         if(this.state.imageUri == null){
             alert('if')
             return userDupl;
         }else{
             alert('else')
             return this.state.imageUri;
         }


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
                this.setState({imageUri: pickerResult.uri, type: fileType, name: `.${filename}`}, () => {
                    this.updateProfile()
                });
            }
        }
    };
    ///Selet image from Gallery
    _pickImage = async () => {
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //    // allowsEditing: true,
        //    // aspect: [4, 3],
        //    // quality: 1
        // });
        //
        // //console.log(result);
        // let filename = result.uri.split('/').pop();
        // let match = /\.(\w+)$/.exec(filename);
        // let fileType = match ? `image/${match[1]}` : `image`;
        //
        // if (!result.cancelled) {
        //     this.setState({uri: result.uri, type: fileType, name: `.${filename}`});
        //
        //     //this.setState({uri: result.uri,}, () => this.setState({ isVisible: true }))
        //     //console.log("IMAGEURI" + result.uri);
        //     //this.setState({isVisible:true})
        //     setTimeout(()=>{
        //         if (this.state.image!= null){
        //             this.setState({isVisible:true})
        //         }
        //
        //     },2000);
        // }
        const { status } = await Permissions.askAsync(Permissions.CAMERA)

       // const { cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status === 'granted') {
           // const result = await ImagePicker.launchImageLibraryAsync()
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });


            if (!result.cancelled) {

                   let filename = result.uri.split('/').pop();
                 let match = /\.(\w+)$/.exec(filename);
                let fileType = match ? `image/${match[1]}` : `image`;
                this.setState({imageUri: result.uri, type: fileType, name: `.${filename}`},()=>{
                    this.updateProfile()
                })
              // alert(this.state.imageUri)

            }
        }

        //this.updateProfile();
    }


    async updateProfile() {
        const  { imageUri,type ,name  } = this.state;


        this.setState({showloader: true})
        const url = global.base_url_live+'v1/api/update-user-profile'
        var data = new FormData();
        var imageData = new FormData();
        imageData.append('image',
            {
                uri: imageUri,
                type: 'image/png',
                name: 'image.jpg',
            });
             console.log("UIR IN API CALLBACK===>>"+imageUri);
        let imagefile = {
            uri: imageUri, type: type, name: name
        }
        console.log("IMAGEFILE IN API CALLBACK===>>"+imageUri);

        var token = await SecureStore.getItemAsync('token');
        var uid = await SecureStore.getItemAsync('id');
        data.append('uid', uid);
        data.append('image', imagefile);
        //  alert(JSON.stringify(data));
        var token1 = `Bearer ${JSON.parse(token)}`;
        // alert(token)
     //   console.log(token)
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
                    console.log('result = = ', responseText)
                    //alert(JSON.stringify(dataobject));
                    if (dataobject.status) {
                        this.setState({showloader: false})
                        //alert(dataobject.user_message);
                        this.refs.toast.show(dataobject.user_message)
                    } else {
                        this.setState({showloader: false})
                        setTimeout(()=>{
                            alert(dataobject.user_message);

                        },1000)
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

    _renderItem = ({item, index}) => {
        console.log(item);
        return (
            <View
                style={{flex: 1, backgroundColor: 'white'}}>
                <ImageBackground source={{uri: item.background_image}} style={styles.backgroundimage_container}>

                    <View style={{alignItems: 'flex-end', marginTop: 20}}>
                        {/* <TouchableOpacity style={{
                  width:100,justifyContent:'center',alignItems:'center'}}>  */}
                        <TouchableOpacity style={{marginRight: 15, marginTop: 5}}
                                          onPress={() => this._onDone()}>

                            <Text style={{fontSize: 17, fontFamily: 'PoppinsSemiBold'}}> SKIP
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: '72%', alignItems: 'center', backgroundColor:'transparent', justifyContent: 'flex-end'}}>
                        {/* {index == 2 &&
                                // <TouchableOpacity onPress={() => playVideo()}>
                    <Video source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                          rate={1.0} volume={1.0} isMuted={false} resizeMode="cover"shouldPlay style={{ width: '80%', height: '40%' }}/>
                        // </TouchableOpacity>
                  } */}
                        {/* {index<2 && */}
                        {index == 2 &&
                        <TouchableOpacity style={{width: '70%', height: '40%', backgroundColor:'transparent', marginBottom: 0}}
                                          onPress={() => this.props.navigation.navigate('VideoPlayer', {'video_url': item.file_name})}>
                            <Image style={{
                                width: '100%', height: '100%', resizeMode: 'contain'
                                , borderRadius: 5
                            }} source={{uri: item.image_name}}/>
                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,justifyContent: 'center', alignItems: 'center'}}>
                                <Image style={{
                                    width: 50, height: 50, resizeMode: 'contain',
                                }} source={play_btn}/>
                            </View>

                        </TouchableOpacity>
                        }
                        {index < 2 &&
                        <Image style={{backgroundColor:'transparent',
                            width: index == 0 ? '70%' : '50%', height: index == 0 ? '50%' : '39%', resizeMode: 'contain',
                            marginTop: index == 2 ? 80 : 30, borderRadius: index == 2 ? 5 : 0
                        }} source={{uri: item.image_name}}/>
                        }
                        {index == 3 &&
                        <TouchableOpacity style={{
                            width: '50%', height: '39%',
                            justifyContent: 'center', alignSelf: 'center',
                            marginTop: index == 3 ? 80 : 30, borderRadius: index == 3 ? 5 : 0
                        }} onPress={() => this.showActionSheet()}>

                            {this.state.imageUri == null &&
                            <Image style={{
                                width: '100%', height: '100%', resizeMode: 'contain',
                                marginTop: index == 3 ? 0 : 30, borderRadius: index == 3 ? 5 : 0
                            }} source={userDupl}/>
                            }

                            {this.state.imageUri != null &&
                                <ImageBackground style={{
                                    width: '100%', height: '100%', resizeMode: 'contain',
                                    marginTop: index == 3 ? 80 : 30, borderRadius: index == 3 ? 5 : 0
                                }}  borderRadius={200/2} source={{uri:this.state.imageUri}}/>

                            }


                        </TouchableOpacity>
                        }


                        {/* } */}
                        <View style={{
                            height: '43%',
                            justifyContent: 'center',
                            backgroundColor: 'transparent',
                            alignItems: 'center',
                            marginHorizontal: 50,
                            marginBottom: Platform.OS === 'ios' ? index < 2 ? 40 : 20 : 0
                        }}>
                            <Text style={{
                                fontSize: 25,
                                width: 250,
                                fontFamily: 'PoppinsSemiBold',
                                textAlign: 'center',
                                marginTop: 30,
                                marginBottom: 18,
                                lineHeight: 32
                            }}>{item.title}</Text>
                            {/*<Text style={{*/}
                            {/*    color: 'black', fontFamily: 'PoppinsRegular', marginTop: 20, fontSize: 14,*/}
                            {/*    textAlign: 'center', lineHeight: 22, marginBottom: index == 2 ? 20 : 0*/}
                            {/*}}>{item.description}</Text>*/}
                            {/*<HTML*/}
                            {/*    html={item.title}*/}
                            {/*    allowFontScaling={false}*/}
                            {/*    containerStyle={{marginTop: 0, marginHorizontal: 0, backgroundColor: 'transparent'}}*/}
                            {/*/>*/}
                            <HTML
                                html={item.description}
                                allowFontScaling={false}
                                containerStyle={{marginTop: 0, marginHorizontal: 0, backgroundColor: 'transparent'}}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>
            </View>


        );
    };

    async getOnBoardItems() {
        //this.setState({showloader: true})
        const url_onboarding = global.base_url_live+'v1/api/app-onboarding-content'
        var token = await SecureStore.getItemAsync('token');
        // alert(token)
        // return
        var parameters = {
            token: JSON.parse(token)
        };
        var token1 = `Bearer ${JSON.parse(token)}`;
        fetch(url_onboarding,
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
                    //  console.log(dataobject)
                    //  Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                    //alert(JSON.stringify(responseText))
                    if (dataobject.length > 0) {
                        this.setState({showloader: false})
                        this.setState({data_arr: dataobject})
                        //alert(this.state.data_arr)
                    } else {
                        Alert.alert('injoy', JSON.stringify(dataobject), [{
                            text: 'Ok',
                            onPress: () => this.setState({showloader: false})
                        }])
                    }
                }
            )
            .catch((error) => {
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                console.log("Exception on login time is ===", error)
                // alert(error);
            })
    }

    onToggleModal = () => {
        const {isVisible, uri} = this.state
        this.setState({isVisible: !isVisible})
        let filename = uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let fileType = match ? `image/${match[1]}` : `image`;
        this.setState({type: fileType, name: `.${filename}`});
        this.updateProfile();
        console.log("IN TOGGLEMODE============>>>",uri)

    }

    render() {
        var optionArray = [
            'Open Camera',
            'Choose from Gallery',
            'Remove Image',
            'Cancel',
        ];
        const {uri, isVisible} = this.state;
        const {width, height} = Dimensions.get('window')

        return (
            <View style={{flex: 1}}>

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='bottom'
                    positionValue={deviceHeight/2}
                    fadeInDuration={1000}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <AppIntroSlider
                    slides={this.state.data_arr}
                    renderItem={this._renderItem}
                    onDone={this._onDone}
                    extraData={this.state}
                    //showDoneButton={false}
                    showSkipButton={false}
                    // showNextButton={true}
                    buttonStyle={{
                        backgroundColor: '#a6dcfe',
                        height: 50,
                        marginHorizontal: 65,
                        marginBottom: 40,
                        borderRadius: 45
                    }}
                    // onSkip={this._onSkip}
                    buttonTextStyle={{color: '#000', fontFamily: 'PoppinsSemiBold', fontSize: 19}}
                    nextLabel='Next'
                    doneLabel='Next'
                    dotStyle={{backgroundColor: 'white', borderColor: '#aebbc0', borderWidth: 1, marginBottom: 50}}
                    activeDotStyle={{backgroundColor: '#002d3e', marginBottom: 50}}
                    bottomButton
                />

                {/*{this.state.showloader &&
                (
                    <LoaderDashboard loaderVal = {this.state.showloader} />
                )
                }*/}



                <ActionSheet
                    ref={refrence => (this.ActionSheet = refrence)}
                    //Title of the Bottom Sheet
                    title={'Which one do you like ?'}
                    //Options Array to show in bottom sheet
                    options={optionArray}
                    //Define cancel button index in the option array
                    //this will take the cancel option in bottom and will highlight it
                    cancelButtonIndex={3}
                    //If you want to highlight any specific option you can use below prop
                    destructiveButtonIndex={3}
                    onPress={index => {
                        //Clicking on the option will give you the index of the option clicked

                        if (index == 0) {
                            this._takePhoto()
                        } else if (index == 1) {
                            this._pickImage()
                        }else  if(index == 2){
                            this.setState({imageUri:null})
                        }

                    }}
                />

                {/*{*/}
                {/*    (isVisible && uri != null) &&*/}
                {/*    (*/}
                {/*        <ImageManipulator*/}
                {/*            photo = {{uri}}*/}
                {/*            isVisible={isVisible}*/}
                {/*            onPictureChoosed={(data) => {*/}
                {/*                //console.log("AFTER CROPPING", data.uri)*/}
                {/*                this.setState({uri: data.uri})*/}
                {/*            }}*/}
                {/*            // fixedMask={{ width: 200, height: 200 }}*/}
                {/*            onToggleModal={this.onToggleModal}*/}
                {/*            btnTexts={{*/}
                {/*                done: 'Ok',*/}
                {/*                crop: 'Crop',*/}
                {/*                processing: 'Processing...',*/}
                {/*            }}*/}
                {/*            // saveOptions={{*/}
                {/*            //    // compress: 1,*/}
                {/*            //   //  format: 'jpg',*/}
                {/*            //     base64: false,*/}
                {/*            // }}*/}
                {/*        />*/}
                {/*    )*/}
                {/*}*/}


            </View>

        );


    }

}


const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 25,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    backgroundimage_container: {
        flex: 1,
        resizeMode: 'contain',
        //  justifyContent:'center'
    },

});
