import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Picker,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {AccordionList} from "accordion-collapse-react-native";
import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import ActionSheet from 'react-native-actionsheet';
const profile = require('./../images/image-9.png');
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const tabcalendar = require('../assets/calendar.png');
const library = require('./../assets/gallary.png');
const user = require('./../assets/user.png');
const headerback = require('./../images/image-8.png')
const email = require('./../images/fillEmail.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/downarrow.png')
const downarrow = require('./../assets/downarrow.png')
//const gallaryblack = require('./../assets/gallaryblack.png')
const nextgray = require('./../assets/nextgray.png')
const gallaryblack = require('./../images/cameraclick.png');

const getUserName = async () => {
    return await SecureStore.getItemAsync('USERNAME');
};
export default class TechSupport extends Component {

    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };


    constructor(props) {
        super(props)
        this.state = {
            image: null,
            type: null,
            name: null,
            list_warning: false,
            list_warningPriotiry: false,
            message_warning: false,
            image_warning: false,
            messageText: '',
            list_arr: [],
            profilePic: this.props.navigation.state.params.profilePic,
            PickerSelectedVal: 'Select',
            PickerSelectedValPriority: 'Select',
            openPicker: false,
            email: '',
            openPickerPriority: false,
            selectedPickerId: '',
            question_arr: [],
            userFbProfile: null,
            userName: '',
            isOpen: false,
            priorityArray: [],
            hasCameraPermission: null,
            selectedItem: 'DashBoard',
            token: '',
            id: '',
            PickerSelectedPosition: '',
            PickerSelectedPositionPriority: '',
        };

        this.toggle = this.toggle.bind(this);

    }


    async componentDidMount() {
        getUserName().then((name) =>
            this.setState({userName: JSON.parse(name)})
        )
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const hasCameraPermission = (camera.status === 'granted');
        this.setState({hasCameraPermission: hasCameraPermission});
        this.getFacebookProfilePic()
        //this.getPermissionAsync();
        this.getApiData()
    }


    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
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
            selectedItem: item == 'logout' ? this.logOutWithToken() : this.props.navigation.navigate(item, {profilePic: this.state.profilePic}),
        });

    getSelectedPickerValue = () => {
        Alert.alert("Selected country is : " + this.state.PickerSelectedVal);
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

            // this.uploadImageAsync(pickerResult.uri);
        }
    };


    ///Selet image from Gallery
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });
        console.log(result);
        let filename = result.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let fileType = match ? `image/${match[1]}` : `image`;

        if (!result.cancelled) {
            this.setState({image: result.uri, type: fileType, name: `.${filename}`});
        }
    }

    async saveTechSupport() {

        // alert(this.state.PickerSelectedPositionPriority)
        this.setState({
            list_warning: '',
            message_warning: '',
            image_warning: '',
            list_warningPriotiry: '',
            email_warning: ''
        })
        const {email} = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (email == '') {
            this.setState({email_warning: 'Please enter email address.'})
        } else if (reg.test(email) == false) {
            this.setState({email_warning: 'Please enter valid email address.'})
        } else if (this.state.PickerSelectedVal == 'Select') {
            this.setState({list_warning: 'Please select an option'})
        } else if (this.state.messageText == '') {
            this.setState({message_warning: 'Please write your message here'})
        } else if (this.state.PickerSelectedValPriority == 'Select') {
            this.setState({list_warningPriotiry: 'Please select an option'})
        } else if (this.state.image == null) {
            this.setState({image_warning: 'Please upload an image'})
        } else {
            this.setState({showloader: true})
            const url = global.base_url_live+'v1/api/save-tech-support'
            // var imageData = new FormData();
            // imageData.append('image',
            //     {
            //         uri: this.state.image,
            //         type: 'image/png',
            //         name: 'image.jpg',
            //     });

            let imagefile = {
                uri: this.state.image, type: this.state.type, name: this.state.name
            }


            var token = await SecureStore.getItemAsync('token');
            var uid = await SecureStore.getItemAsync('id');
            var data = new FormData();

            data.append('uid', uid);
            data.append('email',email);
            data.append('label_id', this.state.PickerSelectedPosition);
            data.append('priority_level', this.state.PickerSelectedPositionPriority);
            data.append('message', this.state.messageText);
            data.append('imageFile', imagefile);

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
                        console.log('result = = ', responseText)
                        // if(dataobject.status==1) {
                        this.setState({
                            PickerSelectedVal: 'Select',
                            PickerSelectedValPriority: 'Select',
                            image: null,
                            messageText: '',
                            email:''
                        })
                        // this.props.navigation.navigate('Login')
                        // }else {
                        Alert.alert('injoy', JSON.stringify(dataobject.message), [{
                            text: 'Ok',
                            onPress: () => this.setState({showloader: false})
                        }])
                        // }


                    }
                )
                .catch((error) => {
                    //Remove textfield data
                    Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])


                    console.log("Exception on login time is ===", error)
                    // alert(error);
                })
        }
    }


    async getApiData() {

        this.setState({showloader: true})

        const url = global.base_url_live+'v1/api/get-tech-support-content'

        var token = await SecureStore.getItemAsync('token');
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

                    if (dataobject.labels.length > 0) {
                        this.setState({showloader: false})
                        this.setState({list_arr: dataobject.labels})
                        this.setState({priorityArray: dataobject.priority_levels})
                        this.setState({question_arr: dataobject.questions})

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

    async logOutWithToken() {

        this.setState({showloader: true})

        const url_logout = global.base_url_live+'v1/api/app-logout'


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
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])


                console.log("Exception on login time is ===", error)
                // alert(error);
            })
    }

    _head(item) {
        return (

            <View style={{
                flexDirection: 'row',
                width: deviceWidth - 40, padding: 15,
                backgroundColor: 'white', alignItems: 'center',
                margin: 0, marginHorizontal: 10,
                marginTop: 10, justifyContent: 'space-between',
                borderRadius: 3
            }}>
                <Text style={{
                    justifyContent: 'center',
                    marginLeft: 15, width: '85%', backgroundColor: 'transparent',
                    fontFamily: 'PoppinsSemiBold',
                    fontSize: 13
                }}>{item.question}
                </Text>
                <Image source={nextgray} style={{height: 18, width: 10,}}>
                </Image>
            </View>

        );
    }

    _body(item) {
        return (
            <View style={{
                flexDirection: 'row',
                width: deviceWidth - 40, padding: 15,
                backgroundColor: 'white', alignItems: 'center',
                marginHorizontal: 10,
                marginTop: 1,
                borderRadius: 3,
                borderWidth: 0.5, borderTopColor: 'white', borderColor: 'white', borderRightColor: 'lightgray'
                , borderLeftColor: 'lightgray', borderBottomColor: 'lightgray'
            }}>
                <Text style={{
                    justifyContent: 'center',
                    marginLeft: 20, width: '95%',
                    fontFamily: 'PoppinsRegular',
                    fontSize: 11
                }}>{item.answer}
                </Text>
                {/*<Image source={nextgray} style={{height: 18, width: 10, marginLeft: 10, justifyContent: 'flex-end'}}>*/}
                {/*</Image>*/}
            </View>
        );
    }

    render() {

        const menu = <ContentView
            onItemSelected={this.onMenuItemSelected}
            userProfile={this.state.profilePic}
            userName={this.state.userName}
        />;

        let {image, question_arr} = this.state;
        var optionArray = [
            'Open Camera',
            'Choose from Gallery',
            'Remove Image',
            'Cancel',
        ];

        return (

            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}>

                <View style={styles.container}>
                    {/* Header View */}
                    <View style={styles.header_view}>
                        <ImageBackground source={headerback} style={styles.header_image}>
                            {/* Header items View */}
                            <View style={styles.header_items}>
                                <View style={{width: '18%', backgroundColor: 'transparent'}}>
                                    <TouchableOpacity onPress={this.toggle}>
                                        <Image source={menuImg} style={styles.menu}>
                                        </Image>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    marginLeft: 0,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'transparent',
                                    width: '64%'
                                }}>
                                    <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}> Tech support
                                    </Text>
                                </View>
                                <View style={{width: '18%', backgroundColor: 'transparent'}}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Account')}>
                                        <View>
                                            {this.state.profilePic == null &&
                                            <Image
                                                source={profile}
                                                style={styles.profile}>
                                            </Image>
                                            }
                                            {this.state.profilePic != null &&
                                            <Image
                                                source={{uri: this.state.profilePic}}
                                                style={styles.profile}>
                                            </Image>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>

                    </View>
                    {/* Ended Header View */}
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}
                                          behavior="padding" enabled keyboardVerticalOffset={0}>
                        <ScrollView contentContainerStyle={{paddingVertical: 10}}>
                            <View style={{marginHorizontal: 20, marginVertical: 20}}>
                                <Text style={{fontFamily: 'PoppinsRegular', fontSize: 15}}> How can we help you? </Text>


                                {/* Email Container */}
                                <View style={styles.emailtextinput_container}>
                                    <Image style={styles.image_continer} source={email}>
                                    </Image>
                                    <TextInput style={styles.email_container} placeholder='Email address'
                                               value={this.state.email}
                                               keyboardType={'email-address'}
                                               onChangeText={(text) => this.setState({email: text})}>
                                    </TextInput>
                                </View>

                                {this.state.email_warning != '' &&
                                <Text style={{color: 'red', fontSize: 13, marginLeft: 20, marginTop: 5}}>
                                    {this.state.email_warning}</Text>
                                }


                                {Platform.OS === 'ios' &&
                                <TouchableOpacity onPress={() => this.setState({openPicker: !this.state.openPicker})}>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderRadius: 2,
                                        borderColor: 'lightgray',
                                        borderWidth: 1,
                                        height: 40,
                                        marginTop: 10,
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{
                                            marginLeft: 8,
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: 13
                                        }}> {this.state.PickerSelectedVal}</Text>
                                        <Image source={downarrow} style={{height: 6, width: 10, marginRight: 10}}>
                                        </Image>
                                    </View>
                                </TouchableOpacity>
                                }

                                {this.state.list_warning != '' &&
                                <Text style={{
                                    color: 'red',
                                    fontSize: 13,
                                    marginTop: 5
                                }}> {this.state.list_warning} </Text>
                                }


                                {/* Show picker */}
                                {this.state.openPicker == true && Platform.OS === 'ios' &&
                                <Picker
                                    style={styles.picker_view}
                                    selectedValue={this.state.PickerSelectedVal}
                                    onValueChange={(itemValue, itemPosition) => [this.setState({
                                        PickerSelectedVal: itemValue,
                                        PickerSelectedPosition: (itemPosition + 1)
                                    })]}>
                                    {this.state.list_arr.map((label, i) => {
                                        return <Picker.Item key={i} value={label.label_text} label={label.label_text}/>
                                    })}
                                </Picker>
                                }

                                {Platform.OS === 'android' &&
                                <Picker
                                    style={styles.picker_viewAndroid}
                                    selectedValue={this.state.PickerSelectedVal}
                                    onValueChange={(itemValue, itemPosition) => this.setState({
                                        PickerSelectedVal: itemValue,
                                        PickerSelectedPosition: (itemPosition + 1)
                                    })}>
                                    {this.state.list_arr.map((label, i) => {
                                        return <Picker.Item key={i} value={label.label_text} label={label.label_text}/>
                                    })}
                                </Picker>
                                }


                                <View style={{
                                    borderColor: 'lightgray',
                                    borderWidth: 1,
                                    height: 140,
                                    marginTop: 10,
                                    borderRadius: 2
                                }}>
                                    <TextInput flex={1}
                                               keyboardType="default" returnKeyType="done" multiline={true}
                                               blurOnSubmit={true} onSubmitEditing={() => {
                                        Keyboard.dismiss()
                                    }}
                                               multiline={true} placeholder='Write your message here...' style={{
                                        marginTop: 0,
                                        marginHorizontal: 8,
                                        fontFamily: 'PoppinsRegular',
                                        fontSize: 13
                                    }}
                                               onChangeText={(text) => this.setState({messageText: text})}
                                               value={this.state.messageText}>
                                    </TextInput>
                                </View>

                                {this.state.message_warning != '' &&
                                <Text
                                    style={{
                                        color: 'red',
                                        fontSize: 13,
                                        marginTop: 5
                                    }}> {this.state.message_warning} </Text>
                                }


                                <Text
                                    style={{fontFamily: 'PoppinsRegular', fontSize: 15, marginTop: 10}}> Priority</Text>

                                {/*adding priority lable*/}
                                {Platform.OS === 'ios' &&
                                <TouchableOpacity
                                    onPress={() => this.setState({openPickerPriority: !this.state.openPickerPriority})}>
                                    <View style={{
                                        flexDirection: 'row',
                                        borderRadius: 2,
                                        borderColor: 'lightgray',
                                        borderWidth: 1,
                                        height: 40,
                                        marginTop: 10,
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={{
                                            marginLeft: 8,
                                            fontFamily: 'PoppinsRegular',
                                            fontSize: 13
                                        }}> {this.state.PickerSelectedValPriority}</Text>
                                        <Image source={downarrow} style={{height: 6, width: 10, marginRight: 10}}>
                                        </Image>
                                    </View>
                                </TouchableOpacity>
                                }

                                {this.state.list_warningPriotiry != '' &&
                                <Text style={{
                                    color: 'red',
                                    fontSize: 13,
                                    marginTop: 5
                                }}> {this.state.list_warningPriotiry} </Text>
                                }


                                {/* Show picker */}
                                {this.state.openPickerPriority == true && Platform.OS === 'ios' &&
                                <Picker
                                    style={styles.picker_view}
                                    selectedValue={this.state.PickerSelectedValPriority}
                                    onValueChange={(itemValue, itemPosition) => this.setState({
                                        PickerSelectedValPriority: itemValue,
                                        PickerSelectedPositionPriority: (itemPosition + 1)
                                    })}>

                                    {this.state.priorityArray.map((label, i) => {
                                        return <Picker.Item key={i} value={label.text} label={label.text}/>
                                    })}
                                </Picker>
                                }

                                {Platform.OS === 'android' &&
                                <Picker
                                    style={styles.picker_viewAndroid}
                                    selectedValue={this.state.PickerSelectedValPriority}
                                    onValueChange={(itemValue, itemPosition) => this.setState({
                                        PickerSelectedValPriority: itemValue,
                                        PickerSelectedPositionPriority: (itemPosition + 1)
                                    })}>
                                    {this.state.priorityArray.map((label, i) => {
                                        return <Picker.Item key={i} value={label.text} label={label.text}/>
                                    })}
                                </Picker>
                                }


                                {/*ending priority lable*/}

                                <View style={{
                                    borderRadius: 2,
                                    marginTop: 20, padding: 5, marginHorizontal: 70,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row'
                                }}>

                                    <TouchableOpacity style={{backgroundColor: 'transparent'}}
                                                      onPress={() => this.state.image == null ? this.showActionSheet() : this.showActionSheet()}>
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'row',
                                        }}>
                                            <Image source={image != null ? {uri: image} : gallaryblack} style={{
                                                width: 45,
                                                height: 45,
                                                marginLeft: 0
                                            }}>
                                            </Image>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => this.saveTechSupport()}
                                                      style={{
                                                          marginLeft: 20,
                                                          backgroundColor: '#4AAFE3',
                                                          height: 45, flex: 1,
                                                          marginTop: 0,
                                                          alignItems: 'center',
                                                          justifyContent: 'center',
                                                          borderRadius: 25
                                                      }}>
                                        <Text style={{
                                            marginLeft: 0,
                                            fontFamily: 'PoppinsSemiBold',
                                            fontSize: 13,
                                            color: 'white'
                                        }}> SUBMIT </Text>
                                    </TouchableOpacity>


                                </View>

                                {this.state.image_warning != '' &&
                                <Text style={{
                                    color: 'red',
                                    fontSize: 13,
                                    marginTop: 5
                                }}> {this.state.image_warning} </Text>
                                }


                            </View>

                            <View style={{
                                backgroundColor: '#f0f0f0',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontFamily: 'PoppinsSemiBold',
                                    fontSize: 18,
                                    marginTop: 25,
                                    textAlign: 'center'
                                }}> Frequently asked question </Text>

                                {/*<FlatList style={{marginTop: 20}}*/}
                                {/*          data={this.state.question_arr}*/}

                                {/*          renderItem={({item}) =>*/}
                                {/*              <View style={{*/}
                                {/*                  flexDirection: 'row',*/}
                                {/*                  height: 52,*/}
                                {/*                  backgroundColor: 'white',*/}
                                {/*                  marginHorizontal: 15,*/}
                                {/*                  marginTop: 5,*/}
                                {/*                  alignItems: 'center',*/}
                                {/*                  borderRadius: 3*/}
                                {/*              }}>*/}
                                {/*                  <Text style={{*/}
                                {/*                      justifyContent: 'center',*/}
                                {/*                      marginLeft: 15,*/}
                                {/*                      flex: 1,*/}
                                {/*                      fontFamily: 'PoppinsRegular',*/}
                                {/*                      fontSize: 13*/}
                                {/*                  }}>{item.question}*/}
                                {/*                  </Text>*/}
                                {/*                  <Image source={nextgray} style={{height: 18, width: 10, marginRight: 10}}>*/}
                                {/*                  </Image>*/}
                                {/*              </View>*/}
                                {/*          }/>*/}

                                {question_arr.length > 0 ?
                                    <AccordionList
                                        list={question_arr}
                                        header={this._head}
                                        body={this._body}
                                        style={{marginTop: 20, marginBottom: 50}}
                                        keyExtractor={item => `${item.faq_id}`}

                                    />
                                    :
                                    <View style={{
                                        backgroundColor: 'transparent',
                                        alignItems: 'center',
                                        marginTop: 0,
                                        padding: 50
                                    }}>
                                        <Text style={{fontFamily: 'PoppinsRegular', fontSize: 11}}>No Question
                                            yet.</Text>
                                    </View>
                                }


                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
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
                                                      onPress={() => [this.props.navigation.navigate('DashBoard')]}>
                                        <Image source={tabcalendar}
                                               style={{width: 24, height: 24, resizeMode: 'contain'}}>
                                        </Image>

                                        <View style={{
                                            width: 35,
                                            marginLeft: -3,
                                            // backgroundColor: '#84d3fd',
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

                <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>


                <ActionSheet
                    ref={o => (this.ActionSheet = o)}
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
                        } else if (index == 2) {
                            this.setState({image: null})
                        }
                        // alert(optionArray[index]);
                    }}
                />
            </SideMenu>
        );


    }


}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 100,

    },

    profile: {
        width: 55,
        height: 55, marginRight: 15, marginTop: 0,
        borderRadius: 55 / 2
    },

    header_items: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 35,
    },
    header_image: {
        flex: 1,
        height: 100
    },

    menu: {
        width: 38,
        height: 28,
        marginLeft: 20,

    },

    picker_view: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'black'
    },

    picker_viewAndroid: {
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: 'lightgray',
        color: 'red',
        height: 38
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
    }, tabbar_inner_view: {

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

    email_container: {
        fontSize: 15,
        height: 45,
        marginLeft: 15,
        flex: 1,

    },
    image_continer: {
        marginLeft: 12,
        width: 18,
        height: 18
    },
    emailtextinput_container: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 40,
        borderColor: 'lightgray',
        borderWidth: 1.5,
        fontFamily: 'PoppinsRegular',
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
})
