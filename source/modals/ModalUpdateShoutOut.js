import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import Modal from "react-native-modal";
import Loader from './../loader/Loader';
import ActionSheet from 'react-native-actionsheet';
import Toast from "react-native-easy-toast";
import Emoji from "react-native-emoji";

const headerback = require('./../../images/image-8.png');
const menuImg = require('./../../assets/menu.png');
const tickets = require('./../../assets/downarrow.png');
const downarrow = require('./../../assets/downarrow.png');
//const gallaryblack = require('./../../assets/gallaryblack.png');
const gallaryblack = require('../../images/cameraclick.png');
const nextgray = require('./../../assets/nextgray.png');
const backarrow = require('./../../assets/backarrow.png');
const profile = require('./../../images/image-9.png');
const messageopenblack = require('./../../assets/messageopenblack.png');


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


const timeArray = [
    {

        value: 'User',
    }, {

        value: 'Admin',
    }, {

        value: 'Teacher'
    },
];

export default class ModalUpdateShoutOut extends Component {
  showActionSheet = () => {
      //To show the Bottom ActionSheet
      this.ActionSheet.show();
  };

    constructor(props) {
        super(props);

        this.state = {
            type: Camera.Constants.Type.back,
            data: true,
            loader: false,
            image: null,
            offSetLoader: false,
            hasCameraPermission: null,
            accessToken: '',
            challengeId: this.props.challengeId,
            featureId: 2,
            day: '',
            data_list: [],
            hederTitle: '',
            question: '',
            UID: '',
            editObject: this.props.updateContent,
            linked_feature_id: this.props.updateContent.shout_out.id,
            textInoutHint: '',
            buttonHint: '',
            buttonDisable: false,
            commentText: this.props.updateContent.shout_out.comment,
            imageUrl: null,
            AllData: '',
            isDialogVisible: false,
            openCamera: false,
            imagetype:null,
            name:null,

        }
        this.updatePrevious = this.updatePrevious.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
        //this.pickFromCamera = this.pickFromCamera.bind(this);
    }


    async componentDidMount() {
        //alert('hi')
        if(this.props.updateContent.shout_out.shout_image !== '') {
          this.setState({imageUrl: this.props.updateContent.shout_out.shout_image});
        }
        // this.getPermissionAsync()
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const hasCameraPermission = (camera.status === 'granted');
        this.setState({hasCameraPermission: hasCameraPermission});

        // const value = await AsyncStorage.getItem('TASKS');


        // alert(JSON.stringify(this.props.navigation.state.params.DATA.feature_id));
        const props = this.props.navigation.state.params.DATA;
        this.setState({AllData: props});

        const uid = this.state.id;
        this.setState({UID: uid});
    }

    componentWillReceiveProps(nextProps, nextContext) {

    }


    notDo() {

    }

    async doComment() {
//alert('in')
        this.setState({offSetLoader:true});
        if (this.state.commentText != '') {

            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/app-edit-high-five';
            const formData = new FormData();


            formData.append('token', JSON.parse(token_));
            formData.append('challenge_id', this.state.challengeId);
            formData.append('feature_id', this.state.featureId);
            formData.append('linked_comment_id', this.state.linked_feature_id);
            formData.append('type', 'c');
            formData.append('feature_value', this.state.commentText);
            formData.append('uid', this.state.id);

            if (this.state.imageUrl !== null) {
                let photo = {uri: this.state.imageUrl};
                let filename = photo.uri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let fileType = match ? `image/${match[1]}` : `image`;
                formData.append('image', {uri: photo.uri, name: `${filename}`, type: fileType})
            }

            var token = `Bearer ${JSON.parse(token_)}`;

            var object = {
                method: 'POST',
                body: formData,
                headers: new Headers({
                         //'Content-Type': 'application/json'
                         'Authorization': token,
                     })
            };
            fetch(url, object)
                .then(async (response) => response.text())
                .then(async (responseText) => {
                        var dataobject = JSON.parse(responseText);
                        console.log('dataobject=====', dataobject);
                        this.setState({offSetLoader:false});
                       this.inheritedData(dataobject);
                    }
                )
                .catch((error) => {
                })


        } else {
            this.setState({offSetLoader:false});
            alert('Please add Comment.')
        }


    }


    inheritedData(dataObject){
        if (dataObject.status) {

            this.setState({buttonDisable: true});
            this.setState({commentText: ''});
            this.setState({imageUrl: null});
            this.updatePrevious(dataObject);
            // this.refs.toast.show(
            //     <View style={{flexDirection:'row',alignItems:'center'}}>
            //         <Text style={{color:'white',fontSize:12}}>Woohoooo  </Text>
            //         <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
            //         />
            //
            //     </View>)
        }

    }

    updatePrevious(obj) {
      this.props.onGoBack(obj.updated_comment_obj);
      this.closePopUp();
        // this.refs.toast.show(
        //     <View style={{flexDirection:'row',alignItems:'center'}}>
        //         <Text style={{color:'white',fontSize:12}}>Woohoooo  </Text>
        //         <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
        //         />
        //
        //     </View>)
    }

    closePopUp() {
        this.props.onPopUp();
    }

    setDialogVisibility(text) {
        this.setState({isDialogVisible: text});
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
                this.setState({imageUrl: pickerResult.uri, imagetype: fileType, name: `.${filename}`});
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
          this.setState({imageUrl:result.uri , imagetype: fileType, name:`.${filename}`});
        }
    }


    render() {

      let {imageUrl} = this.state;

      var optionArray = [
          'Open Camera',
          'Choose from Gallery',
          'Remove Image',
          'Cancel',
      ];

        return (
            <View style={styles.container}>
            {this.state.offSetLoader &&
              <Loader loaderVal = {this.state.offSetLoader} />
            }

                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={240}
                    fadeInDuration={500}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <View style={{flex: 1, paddingHorizontal: 15}}>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: 0,
                        marginTop: 20,
                        backgroundColor: 'transparent'
                    }}>
                        {/* <Image style={{width:15,height:14}} source = {messageopenblack}>
                         </Image> */}
                        <Text style={{fontFamily: 'PoppinsSemiBold', marginLeft: 0}} numberOfLines={2}>Please click in the box below to edit.</Text>

                    </View>

                    <View style={styles.email_view}>
                        <TextInput
                            multiline={true}
                            placeholder="Write your comment here..."
                            numberOfLines={8}
                            value={this.state.commentText}
                            onChangeText={(text) => this.setState({commentText: text})}
                            style={{width: '100%', height: 120, textAlignVertical: "top", paddingHorizontal: 10, marginTop: 12}}
                        >

                        </TextInput>
                    </View>


                    {/*<View style={styles.upload_imageView}>*/}

                    {/*    <View style={{*/}
                    {/*        //borderColor: 'lightgray',*/}
                    {/*        //borderWidth: 1,*/}
                    {/*        //borderRadius: 2,*/}
                    {/*        //height: 70,*/}
                    {/*        //marginTop: 10,*/}
                    {/*        alignItems: 'center',*/}
                    {/*        justifyContent: 'center',*/}
                    {/*        flexDirection: 'row'*/}
                    {/*    }}>*/}
                    {/*        <Image source={imageUrl != null ? {uri: imageUrl} : gallaryblack} style={styles.menu}>*/}
                    {/*        </Image>*/}
                    {/*        <TouchableOpacity*/}
                    {/*            onPress={() => this.state.imageUrl == null ? this.showActionSheet() : this.setState({imageUrl: null})}*/}
                    {/*            style={{*/}
                    {/*                borderWidth: 1.5,*/}
                    {/*                borderColor: 'gray',*/}
                    {/*                height: 32,*/}
                    {/*                width: 110,*/}
                    {/*                marginLeft: 20,*/}
                    {/*                alignItems: 'center',*/}
                    {/*                justifyContent: 'center'*/}
                    {/*            }}>*/}
                    {/*            /!*<Text style={{*!/*/}
                    {/*            /!*    fontFamily: 'PoppinsSemiBold',*!/*/}
                    {/*            /!*    fontSize: 9*!/*/}
                    {/*            /!*}}>{this.state.imageUrl == null ? 'UPLOAD IMAGE' : 'REMOVE IMAGE'}</Text>*!/*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </View>*/}

                    {/*</View>*/}

                    <View style={{
                        borderRadius: 2,
                        marginTop: 20, padding: 5, marginHorizontal: 70,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}>

                        <TouchableOpacity style={{backgroundColor: 'transparent'}}
                                          onPress={() => this.state.imageUrl == null ? this.showActionSheet() : this.showActionSheet()}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}>
                                <Image source={imageUrl != null ? {uri: imageUrl} : gallaryblack} style={{
                                    width: 45,
                                    height: 45,
                                    marginLeft: 0
                                }}>
                                </Image>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() =>  this.doComment()}
                                          style={{
                                              marginLeft: 20,
                                              backgroundColor: '#4AAFE3',
                                              height: 35, flex: 1,
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
                            }}> Update </Text>
                        </TouchableOpacity>


                    </View>

                    {/*<View style={{marginTop: 20, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'}}>*/}
                    {/*  <View style={{justifyContent: 'center', alignItems: 'center'}}>*/}
                    {/*    <TouchableOpacity*/}
                    {/*        style={{alignItems: 'center',*/}
                    {/*        justifyContent: 'center',*/}
                    {/*        backgroundColor: '#008CE3',*/}
                    {/*        borderWidth: 1, paddingVertical: 8,*/}
                    {/*        borderColor: 'lightgray', marginHorizontal: 0,*/}
                    {/*        borderRadius: 25, marginBottom: 0, marginTop: 0}}*/}
                    {/*        onPress={() => this.doComment()}*/}
                    {/*    >*/}
                    {/*        <Text*/}
                    {/*            style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold', paddingVertical: 0, paddingHorizontal: 35}}>*/}
                    {/*            Update</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*  </View>*/}
                    {/*</View>*/}
                </View>

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
                        }else if (index == 2) {
                            this.setState({imageUrl: null})
                        }
                        // alert(optionArray[index]);
                    }}
                />


            </View>


        )
            ;

    }
}





const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
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
      width: 38,
      height: 28,
      marginLeft: 20,


    },

    profile: {
        width: 60,
        height: 60,
    },

    name_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: 42,
        width: '100%',
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        marginTop: 8
    },
    upload_imageView: {

        flexDirection: 'row',
        height: 75, alignItems: 'center', justifyContent: 'center',
        width: '100%',
        marginHorizontal: 0,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        marginTop: 8
    },
    image_continer: {
        marginLeft: 8,
        width: 11,
        height: 14
    },
    passwordimage_continer: {
        marginLeft: 12,
        width: 18,
        height: 13
    },
});
