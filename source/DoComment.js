import React, {Component} from 'react';
import {Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import Modal from "react-native-modal";
import Loader from './loader/Loader';
const headerback = require('./../images/image-8.png');
const menuImg = require('./../assets/menu.png');
const tickets = require('./../assets/downarrow.png');
const downarrow = require('./../assets/downarrow.png');
const gallaryblack = require('./../assets/gallaryblack.png');
const nextgray = require('./../assets/nextgray.png');
const backarrow = require('./../assets/backarrow.png');
const profile = require('./../images/image-9.png');
const messageopenblack = require('./../assets/messageopenblack.png');


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

export default class DoComment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            type: Camera.Constants.Type.back,
            data: true,
            loader: false,
            offSetLoader: false,
            hasCameraPermission: null,
            accessToken: '',
            challengeId:this.props.navigation.state.params.challenge_details.challenge_id,
            featureId: 2,
            day: '',
            data_list: [],
            hederTitle: '',
            question: '',
            UID: '',
            textInoutHint: '',
            buttonHint: '',
            buttonDisable: false,
            commentText: '',
            imageUrl: null,
            AllData: '',
            isDialogVisible: false,
            openCamera: false,
            image: null,
            imagetype:null,
            name:null,

        }
    }


    async componentDidMount() {
        //alert('hi')

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

           const uri    =  nextProps.navigation.state.params.CAPTUREDIMAGE;
        let filename = uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let fileType = match ? `image/${match[1]}` : `image`;


            this.setState({ imageUrl: uri , imagetype: fileType, name:`.${filename}`});

    }


    notDo() {

    }

    async doComment() {

        this.setState({offSetLoader:true});
        if (this.state.commentText != '') {

            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/app-insert-high-five';
            const formData = new FormData();


            formData.append('token', JSON.parse(token_));
            formData.append('challenge_id', this.state.challengeId);
            formData.append('feature_id', this.state.featureId);
            formData.append('type', 'c');
            formData.append('feature_value', this.state.commentText);
            formData.append('uid', this.state.UID);


            if (this.state.imageUrl != null) {
                // let imagefile = {
                //     uri: this.state.imageUrl, type: this.state.imagetype ,name:this.state.name
                // }
                // formData.append('image', imagefile);


                let photo = {uri: this.state.imageUrl};
                formData.append('image', {uri: photo.uri, name: 'image.jpg', type: 'image/jpeg'})
               // alert(JSON.stringify(imagefile));
            }
            // if(this.state.imageUrl!= null){
            //     var parameters = {
            //         token: JSON.parse(token_),
            //         challenge_id: this.state.challengeId,
            //         feature_id: this.state.featureId,
            //         type: "c",
            //         feature_value: this.state.commentText,
            //         uid: this.state.UID,
            //         image:formData
            //     };
            var token = `Bearer ${JSON.parse(token_)}`;

          //  alert(JSON.stringify(formData))
            console.log(formData);


            var object = {
                method: 'POST',
                body: formData,
                headers: new Headers({
                         //'Content-Type': 'application/json'
                         'Authorization': token,
                     })
            };

          //  alert(JSON.stringify(object));
            // {
            //     method: 'POST',
            //         headers: new Headers({
            //     //'Content-Type': 'application/json'
            //     'Authorization': token,
            // }), body: fromData,
            ///  alert(JSON.stringify(parameters));
            fetch(url, object)
                .then(async (response) => response.text())
                .then(async (responseText) => {
                        var dataobject = JSON.parse(responseText);
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
            this.props.navigation.navigate('PostComments',{DATA:this.state.AllData});
        }
    }


    pickImage = async () => {
        this.setDialogVisibility(true);


    };



    pickFromCamera() {
        this.setDialogVisibility(false);
        this.props.navigation.navigate('CameraFor');
        // this.setState({openCamera:true})


    }

    async pickFromGallery() {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        /// console.log(result);
        this.setDialogVisibility(false);
        if (!result.cancelled) {

            let filename = result.uri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let fileType = match ? `image/${match[1]}` : `image`;
            this.setState({imageUrl:result.uri , imagetype: fileType, name:`.${filename}`});
           /// alert(this.state.imageUrl);


        }

    }


    setDialogVisibility(text) {
        this.setState({isDialogVisible: text});
    }


    render() {
        return (
            <View style={styles.container}>
            {this.state.offSetLoader &&
              <Loader loaderVal = {this.state.offSetLoader} />
            }
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}> Shout outs & digital high 5s
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}


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
                        <Text style={{fontFamily: 'PoppinsRegular', marginLeft: 0}} numberOfLines={2}>Post your
                            Comment </Text>

                    </View>

                    {/* <View style={styles.name_view}>
                      <TextInput placeholder='Name' style={{width:'100%',marginLeft:10}}>
                         </TextInput>
                 </View> */}


                    {/*
 <TextInput style={styles.email_container} placeholder='Email address'
                                        value={this.state.email}
                                        onChangeText={(text) => this.setState({email: text})}>
                             </TextInput> */}

                    <View style={styles.email_view}>
                        <TextInput
                            multiline={true}
                            numberOfLines={8}
                            placeholder="Write your comment here..."
                            value={this.state.commentText}
                            onChangeText={(text) => this.setState({commentText: text})}
                            style={{width: '100%', height: 120, textAlignVertical: "top", paddingHorizontal: 10, marginTop: 12}}
                        >

                        </TextInput>
                    </View>


                    <View style={styles.upload_imageView}>

                        {this.state.imageUrl != null &&
                        <Image style={{width: 45, height: 35, backgroundColor: 'transparent', resizeMode: 'contain',}}
                               source={{uri: this.state.imageUrl}}>
                        </Image>
                        }
                        {this.state.imageUrl == null &&
                        <Image style={{width: 45, height: 35}} source={messageopenblack}>
                        </Image>
                        }

                        <TouchableOpacity style={{
                            borderWidth: 1, backgroundColor: 'white', borderColor: 'black',
                            marginHorizontal: 0, height: 33, marginTop: 0, alignItems: 'center', marginLeft: 15,
                            justifyContent: 'center', borderRadius: 2, width: 100
                        }}
                                          onPress={() => this.state.imageUrl != null ? this.notDo() : this.pickImage()}
                        >

                            <Text style={{
                                marginLeft: 0, fontFamily: 'PoppinsSemiBold', fontSize: 11, color: 'black'
                                , alignSelf: 'center'
                            }}>UPLOAD IMAGE</Text>
                        </TouchableOpacity>


                        {this.state.isDialogVisible &&


                        <Modal
                            //  hasBackdrop={true}
                            //   onBackdropPress={this.OnBackDrop.bind(this)}
                            //   ref={"modal1"}
                            // coverScreen={true}
                            isVisible={this.state.isDialogVisible}
                            // onSwipeComplete={() => this.setState({ isModalVisible: null })}
                            style={{
                                height: 200, width: '60%', backgroundColor: 'white', flex: 0.3,
                                borderRadius: 6
                                , alignItems: 'center', justifyContent: 'center', alignContent: 'center'
                                , alignSelf: 'center', marginTop: screenHeight / 2.1
                            }}
                            // backdropOpacity={0.2}
                            //  swipeDirection="down"
                            //scrollTo={this.handleScrollTo}
                            //scrollOffset={this.state.scrollOffset}

                        >

                            <View style={{flex: 1, width: '100%'}}>

                                <TouchableOpacity style={{
                                    backgroundColor: 'transparent',
                                    alignItems: 'center',
                                    flex: 0.5,
                                    justifyContent: 'center'
                                }}
                                                  onPress={() => this.pickFromCamera()}
                                >
                                    <Text style={{
                                        color: 'black',
                                        fontSize: 17,
                                        fontFamily: 'PoppinsMedium'
                                    }}>Camera</Text>
                                </TouchableOpacity>

                                <View style={{height: 1, backgroundColor: 'gray'}}></View>

                                <TouchableOpacity style={{
                                    backgroundColor: 'transparent',
                                    alignItems: 'center',
                                    flex: 0.5,
                                    justifyContent: 'center'
                                }}
                                                  onPress={() => [this.pickFromGallery()]}
                                >
                                    <Text style={{
                                        color: 'black',
                                        fontSize: 17,
                                        fontFamily: 'PoppinsMedium'
                                    }}>Gallery</Text>
                                </TouchableOpacity>

                            </View>

                        </Modal>


                        }

                    </View>

                    <TouchableOpacity
                        style={{
                            borderWidth: 1.5, backgroundColor: 'black', marginHorizontal: 0
                            , height: 45, marginTop: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 2
                        }}
                        onPress={() => this.doComment()}
                    >
                        <Text style={{marginLeft: 10, fontFamily: 'PoppinsBold', fontSize: 11, color: 'white'}}>POST
                            YOUR COMMENT</Text>
                    </TouchableOpacity>


                </View>


            </View>


        )
            ;

    }
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
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
        width: 28,
        height: 18,
        marginLeft: 15,


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
