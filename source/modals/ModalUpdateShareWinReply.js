import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import Modal from "react-native-modal";
import Loader from './../loader/Loader';
import ActionSheet from 'react-native-actionsheet';

const headerback = require('./../../images/image-8.png');
const menuImg = require('./../../assets/menu.png');
const tickets = require('./../../assets/downarrow.png');
const downarrow = require('./../../assets/downarrow.png');
const gallaryblack = require('./../../assets/gallaryblack.png');
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

export default class ModalUpdateShareWinReply extends Component {
    showActionSheet = () => {
        //To show the Bottom ActionSheet
        this.ActionSheet.show();
    };

    constructor(props) {
        super(props);

       // alert(JSON.stringify(this.props.updateContent.comment_id))
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
            week: this.props.week,
            editObject: this.props.updateContent,
            linked_feature_id: this.props.updateContent.comment_id,
            textInoutHint: '',
            buttonHint: '',
            buttonDisable: false,
            commentText: this.props.updateContent.comment,
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
        //console.log('DataObject', this.state.editObject);
        // this.getPermissionAsync()
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

        // const camera = await Permissions.askAsync(Permissions.CAMERA);
        // const hasCameraPermission = (camera.status === 'granted');
        // this.setState({hasCameraPermission: hasCameraPermission});

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

        const  {challengeId,  featureId,  linked_feature_id,commentText ,UID  ,week} = this.state;
        this.setState({offSetLoader:true});
        if (this.state.commentText != '') {

            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-small-win-action';
            const formData = new FormData();
            formData.append('token', JSON.parse(token_));
            formData.append('type', 'e');
            formData.append('comment',commentText);
            formData.append('uid', UID);
            formData.append('week', week);
            formData.append('challenge_id',  challengeId);
            formData.append('linked_comment_id', linked_feature_id);
            formData.append('feature_id', 5);
          //  alert(JSON.stringify(formData))
            //return ;
            var token = `Bearer ${JSON.parse(token_)}`;
            //console.log('formData123=====', formData);
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
                        console.log(dataobject)
                        this.setState({offSetLoader:false});
                        //console.log('dataobject123=====', dataobject);
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
            //alert('hi')
            this.setState({commentText: ''});
            this.updatePrevious(dataObject);
        }
    }



    updatePrevious(obj) {
        console.log(JSON.stringify(obj))
        this.props.onGoBack(obj.updated_comment_obj);
        this.closePopUp();
    }

    closePopUp() {
        this.props.onPopUp();
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
                        <Text style={{fontFamily: 'PoppinsRegular', marginLeft: 0}} numberOfLines={2}>Edit your Comment </Text>

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

                    <View style={{marginTop: 20, backgroundColor: 'tranparent', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity
                                style={{alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#008CE3',
                                    borderWidth: 1, paddingVertical: 8,
                                    borderColor: 'lightgray', marginHorizontal: 0,
                                    borderRadius: 25, marginBottom: 0, marginTop: 0}}
                                onPress={() => this.doComment()}
                            >
                                <Text
                                    style={{fontSize: 13, color: 'white', fontFamily: 'PoppinsSemiBold', paddingVertical: 0, paddingHorizontal: 35}}>
                                    Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

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
