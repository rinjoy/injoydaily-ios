import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    Image,
    ImageBackground,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    TouchableOpacity,
    View, StatusBar, Dimensions
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import ActionSheet from 'react-native-actionsheet';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import ModalPremium from "./modals/ModalPremium";
import Modal from "react-native-modal";
import Emoji from 'react-native-emoji';
import Toast, {DURATION} from 'react-native-easy-toast';
import Spinner from "react-native-loading-spinner-overlay";
const headerback = require('./../images/image-8.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/downarrow.png')
const downarrow = require('./../assets/downarrow.png')
const gallaryblack = require('./../assets/gallaryblack.png')
const nextgray = require('./../assets/nextgray.png')
const backarrow = require('./../assets/backarrow.png')
const profile = require('./../images/image-9.png')
const cameraclick = require('./../images/cameraclick.png')
const pencilName = require('./../images/pencilName.png')
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;
const tabcalendar = require('../assets/calendar.png');
const library = require('./../assets/gallary.png');
const user = require('./../assets/user.png');
const crossarrow = require('./../images/close.png');
const backg = require('./../images/bg_popup.png');
const unlock = require('./../images/unlock.png');
const star = require('./../images/star.png');

const getUserName = async () => {
    return await SecureStore.getItemAsync('USERNAME');
};

export default class Account extends Component {

    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };

    constructor(props) {
        super(props)

        this.state = {
            user_details: '',
            notification_details: '',
            updated_date: '',
            daily_inspiration_notification: false,
            shout_out_notification: false,
            weekly_video_notificaton: false,
            checkin_notification: false,
            image: null,
            paymentStatus: true,
            showloader: false,
            hasCameraPermission:null,
            type: null,
            name: null,
            userName: '',
            userFbProfile: null,
            isNameEdit: false,
            isNameEditFor: false,
            imageEdit: false,
            editedUserName: '',
            premiumModal: false,
        }
        this.goBackDashboard = this.goBackDashboard.bind(this);
        this.premium = this.premium.bind(this);
    }

    async componentDidMount() {
        //take permissions from camera
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const hasCameraPermission = (camera.status === 'granted');
        this.setState({hasCameraPermission: hasCameraPermission});
        this.getFacebookProfilePic()
        this.getAccountScreenData();
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

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    premium() {
        this.setState({premiumModal: !this.state.premiumModal})
        //alert('Here');
    }


    async getAccountScreenData() {


        this.setState({showloader: true})


        const url = global.base_url_live+'v1/api/get-my-account-details'

        var token = await SecureStore.getItemAsync('token');

        // alert(token)
        // return
        var parameters = {
            token: JSON.parse(token)
        };


        var token1 = `Bearer ${JSON.parse(token)}`;
        fetch(url,
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
                this.setState({showloader: false})
                    console.log(dataobject)
                    // return

                    if (dataobject.user_details) {
                        this.setState({user_details: dataobject.user_details})
                        this.setState({paymentStatus: dataobject.plan_paid})

                        this.setState({image: dataobject.user_details.profile_pic})
                        this.setState({userName: dataobject.user_details.username})
                        this.setState({notification_details: dataobject.notification_details})
                        this.setState({updated_date: dataobject.updated_date})
                       // alert(JSON.stringify(dataobject.notification_details.daily_inspiration_notification))
                        this.setState({daily_inspiration_notification: dataobject.notification_details.daily_inspiration_notification})
                       // this.setState({weekly_video_notificaton: dataobject.notification_details.weekly_video_notificaton})
                        this.setState({shout_out_notification: dataobject.notification_details.shout_out_notification})
                       // this.setState({checkin_notification: dataobject.notification_details.checkin_notification})

                        //   Alert.alert('injoy' ,JSON.stringify(dataobject.notification_details.weekly_video_notificaton),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                        // alert(this.state.image)
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

            this.updateProfileAndName('PROFILEEDITING');
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

        this.updateProfileAndName('PROFILEEDITING');
    }

    async updateProfileAndName(type) {
        this.setState({showloader: true})
        console.log("FIRST ", this.state.daily_inspiration_notification)
        if(type == 'GETNOTIFYDAILYINSPIRATION'){
            await  this.setState({daily_inspiration_notification: !this.state.daily_inspiration_notification})
            console.log("SECOND ", this.state.daily_inspiration_notification)
        }else if(type == 'GETNOTIFYSHOTOUT'){
            await  this.setState({shout_out_notification: !this.state.shout_out_notification})

        }

        const url = global.base_url_live+'v1/api/update-user-profile'
        var data = new FormData();
        var imageData = new FormData();
        imageData.append('image',
            {
                uri: this.state.image,
                type: 'image/png',
                name: 'image.jpg',
            });

        let imagefile = {
            uri: this.state.image, type: this.state.type, name: this.state.name
        }


        var token = await SecureStore.getItemAsync('token');
        var uid = await SecureStore.getItemAsync('id');
        //  alert(uid)
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

        data.append('notifications[daily_inspiration]' ,this.state.daily_inspiration_notification)
        data.append('notifications[shout_out]' ,this.state.shout_out_notification)

        ////alert(JSON.stringify(data));
        // return
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
                this.setState({showloader: false})
                    console.log('result = = ', responseText)
                    //alert(JSON.stringify(dataobject));
                    if (dataobject.status) {
                        if(type == 'GETNOTIFYDAILYINSPIRATION'){
                            //alert("Hey Congrates , you'll get DailyInspiration notification.")
                        }else if(type == 'GETNOTIFYSHOTOUT'){
                            //alert("Hey Congrates , you'll get ShoutOut notification.")
                        } else if(type == 'PROFILEEDITING'){
                            this.refs.toast.show(
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'white',fontSize:12}}>Account Updated </Text>
                                    <Emoji name="+1" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}

                                    />
                                </View>
                            )
                        }
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

    goBackDashboard() {
        //console.log(this.props.navigation);
        this.props.navigation.navigate('DashBoard',{image_url: this.state.image, user_name: this.state.userName});
        //this.props.navigation.goBack();
    }

    render() {

        var optionArray = [
            'Open Camera',
            'Choose from Gallery',
            'Cancel',
        ];


        return (
            <View style={styles.container}>
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.goBackDashboard()}>
                                <Image source={backarrow} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                marginLeft: 10,
                                alignContent: 'center',
                                justifyContent: 'center',
                                width: '70%'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18,color:'white'}}> My Account
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/*<Modal style={{marginLeft: 10, marginRight: 10,*/}
                {/*    marginBottom: 0, marginTop: StatusBar.currentHeight}}*/}
                {/*       transparent={true} deviceWidth={deviceWidth}*/}
                {/*       deviceHeight={deviceHeight} coverScreen={true} hasBackdrop = {false} isVisible={this.state.premiumModal} >*/}
                {/*    <View style={{flex: 1, height:'100%' , width: '100%', backgroundColor: '#fff', padding: 0, margin: 0}}>*/}
                {/*        <ImageBackground resizeMode= 'contain' source={backg} style={{flex: 1, height: '100%', width: '100%'}}>*/}
                {/*            <View style={{padding: 0}}>*/}
                {/*                <TouchableOpacity onPress={this.premium}>*/}
                {/*                    <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>*/}
                {/*                        <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>*/}
                {/*                    </View>*/}
                {/*                </TouchableOpacity>*/}

                {/*                <ModalPremium/>*/}
                {/*            </View>*/}
                {/*        </ImageBackground>*/}
                {/*    </View>*/}
                {/*</Modal>*/}

                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>

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


                                <ModalPremium/>
                            </View>
                        </ImageBackground>
                    </View>
                </Modal>

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={700}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />

                {/* Ended Header View */}
                <View style={{marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                    <TouchableOpacity
                        onPress={() => [this.showActionSheet(), this.setState({imageEdit: true})]}>
                        { this.state.image == null &&
                        <ImageBackground
                            source={ profile}
                            imageStyle={{ borderRadius: 60/2 }}
                            style={styles.profile}>
                            <Image
                                style={{
                                    height: 18, width: 18,
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    marginLeft: 45, marginTop: 2
                                }}
                                source={cameraclick}>

                            </Image>
                        </ImageBackground>

                        }

                        { this.state.image != null &&
                        <ImageBackground
                            imageStyle={{ borderRadius:60/2 }}
                            source={{uri: this.state.image}}
                            style={styles.profile}>
                            <Image
                                style={{
                                    height: 18, width: 18,
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    marginLeft: 45, marginTop: 2
                                }}
                                source={cameraclick}>

                            </Image>
                        </ImageBackground>
                        }

                    </TouchableOpacity>

                    <View style={{flexDirection: 'column', marginLeft: 20}}>
                        {!this.state.isNameEdit &&
                        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent',}}>
                            <Text style={{
                                fontFamily: 'PoppinsBold',
                                fontSize: 18, marginRight: 0
                            }}>
                                {this.state.isNameEditFor ? this.state.userName : this.state.userName}
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({isNameEdit: true})}>
                                <Image source={pencilName} style={{height: 15, width: 15, marginLeft: 8}}></Image>
                            </TouchableOpacity>
                        </View>
                        }
                        {this.state.isNameEdit &&
                        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent'}}>
                            <TextInput style={{
                                height: 35, paddingHorizontal: 5, width: '80%', marginBottom: 5,
                                borderColor: 'white', borderWidth: 1, elevation: 8,
                                shadowColor: "gray",
                                shadowOpacity: 0.5,
                                shadowRadius: 2,
                                shadowOffset: {
                                    height: 0.5,
                                    width: 1,
                                }

                            }} placeholder={this.state.userName}
                                       value={this.state.userName}
                                       returnKeyType={'done'}
                                       autoFocus
                                       onChangeText={(text) => this.setState({userName: text})}>
                            </TextInput>
                        </View>
                        }

                        {this.state.isNameEdit &&

                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                            {/*<Text style={{*/}
                            {/*    fontFamily: 'PoppinsRegular',*/}
                            {/*    color: 'gray',*/}
                            {/*    fontSize: 11,*/}
                            {/*    marginLeft: 0*/}
                            {/*}}>{this.state.updated_date}*/}
                            {/*</Text>*/}
                            <TouchableOpacity
                                onPress={() => [this.setState({isNameEdit: false, isNameEditFor: true}),
                                    this.updateProfileAndName('PROFILEEDITING')]}
                                style={{
                                    height: 28, width: 65,
                                    backgroundColor: '#f2cc8b', alignItems: 'center',
                                    justifyContent: 'center', borderRadius: 5, elevation: 8,
                                    shadowColor: "gray",
                                    shadowOpacity: 0.5,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                        height: 0.5,
                                        width: 1,
                                    }, borderColor: 'white', borderWidth: 1
                                }}>
                                <Text style={{color: 'black', fontFamily: 'PoppinsSemiBold'}}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>this.setState({isNameEdit:false})}
                                style={{
                                    height: 28, width: 65, marginLeft: 15,
                                    backgroundColor: '#97ddd3', alignItems: 'center',
                                    elevation: 8,
                                    shadowColor: "gray",
                                    shadowOpacity: 0.5,
                                    shadowRadius: 2,
                                    shadowOffset: {
                                        height: 0.5,
                                        width: 1,
                                    }, justifyContent: 'center', borderRadius: 5, borderColor: 'white', borderWidth: 1
                                }}>
                                <Text style={{color: 'black', fontFamily: 'PoppinsSemiBold'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        }


                    </View>
                </View>

                <View style={{
                    backgroundColor: 'lightgray',
                    height: 1,
                    width: '91%',
                    marginHorizontal: 15,
                    marginTop: 12
                }}>
                </View>
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={0}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingVertical:20}}>
                        <View>
                            <Text style={{fontFamily: 'PoppinsBold', fontSize: 16, padding: 16}}>Account
                            </Text>

                            <View style={{
                                backgroundColor: 'white',
                                height: 110,
                                width: '91%',
                                marginLeft: 15,
                                borderRadius: 5,
                                marginTop: -5
                            }}>
                                <Text style={{fontFamily: 'PoppinsRegular', fontSize: 15, marginLeft: 8, marginTop: 8}}> Email
                                </Text>
                                <Text style={{
                                    fontFamily: 'PoppinsRegular',
                                    color: 'gray',
                                    fontSize: 11,
                                    marginLeft: 8,
                                    marginTop: -3
                                }}> {this.state.user_details.email}
                                </Text>
                                <View style={{backgroundColor: 'lightgray', height: 1, width: '100%', marginTop: 12}}>
                                </View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}
                                                  style={{
                                                      flexDirection: 'row',
                                                      alignItems: 'center',
                                                      justifyContent: 'space-between',
                                                      height: 48
                                                  }}>
                                    <Text style={{fontFamily: 'PoppinsRegular', fontSize: 15, marginLeft: 8}}> Change password
                                    </Text>
                                    <Image source={nextgray} style={{height: 18, width: 10, marginRight: 10}}>
                                    </Image>
                                </TouchableOpacity>
                            </View>

                            {/* Notifications */}
                            <Text style={{fontFamily: 'PoppinsBold', fontSize: 16, padding: 16}}>Notifications
                            </Text>

                            <View style={{
                                flexDirection: 'column',
                                marginTop: -10,
                                width: '91%',
                                height: 100,
                                backgroundColor: 'white',
                                marginHorizontal: 15,
                                borderRadius: 5
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: 48,
                                    borderRadius: 5
                                }}>
                                    <Text style={{fontFamily: 'PoppinsRegular', fontSize: 15, marginLeft: 8}}> Daily inspiration
                                    </Text>

                                    <Switch value={this.state.daily_inspiration_notification} onValueChange={(switchValue) =>
                                        this.updateProfileAndName('GETNOTIFYDAILYINSPIRATION')
                                    }
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: 48
                                }}>
                                    <Text style={{fontFamily: 'PoppinsRegular', fontSize: 15, marginLeft: 8}}> Shout outs
                                    </Text>
                                    <Switch value={this.state.shout_out_notification} onValueChange={(switchValue) =>
                                        this.updateProfileAndName('GETNOTIFYSHOTOUT')
                                    }
                                    />
                                </View>
                            </View>

                          {!this.state.paymentStatus &&
                            <View>
                            <Text style={{fontFamily: 'PoppinsBold', fontSize: 16, padding: 16}}>Subcription
                            </Text>

                            <TouchableOpacity onPress={() => this.premium()}
                                              style={{
                                                  flexDirection: 'row', borderRadius: 5,
                                                  alignItems: 'center', width: '91%',
                                                  marginLeft: 15,
                                                  backgroundColor:'white',
                                                  justifyContent: 'space-between',
                                                  height: 48
                                              }}>
                                <Text style={{fontFamily: 'PoppinsRegular', fontSize: 15, marginLeft: 8}}> Upgrade to InJoy premium
                                </Text>
                                <Image source={nextgray} style={{height: 18, width: 10, marginRight: 10}}>
                                </Image>
                            </TouchableOpacity>
                            </View>
                          }  


                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {/* Notifications */}


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


}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    header_view: {
        height: 90,

    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 40,
    },
    header_image: {
        flex: 1,
        height: 90
    },

    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,


    },

    profile: {
        width: 60,
        height: 60,

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

})
