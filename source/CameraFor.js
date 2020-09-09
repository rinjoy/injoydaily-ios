import React from 'react';
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Camera} from 'expo-camera';

const headerback = require('./../images/image-8.png');
const menuImg = require('./../assets/menu.png');
const tickets = require('./../assets/downarrow.png');
const downarrow = require('./../assets/downarrow.png');
const gallaryblack = require('./../assets/gallaryblack.png');
const nextgray = require('./../assets/nextgray.png');
const cameraicon = require('./../assets/iconcamera.png');
const backarrow = require('./../assets/backarrow.png');
const leftBackArrow = require('./../assets/leftArrow.png');
const profile = require('./../images/image-9.png');
const messageopenblack = require('./../assets/messageopenblack.png');
import ModalUpdateShoutOut from './modals/ModalUpdateShoutOut';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);


export default class CameraFor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: Camera.Constants.Type.back,
            capturedImage:null
        }
    }


    componentDidMount() {

        //    // this.getPermissionAsync()
        //  getAccessToken().then(token =>
        //         this.setState({accessToken:token}),
        //         //this.getDailyInspirationApiData(token)
        //     );


        //     getUserId().then(id =>
        //         this.setState({id: id}),
        //     );


    }

    takePicture = () => {
        if (this.camera) {
            this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
         //   alert()
        }
    };

    onPictureSaved = photo => {
       // alert(JSON.stringify(photo.uri));
        this.setState({capturedImage:photo.uri});
        if (photo.uri!= null){
          <ModalUpdateShoutOut CAPTUREDIMAGE = {photo.uri}/>
            //this.props.navigation.navigate('ModalUpdateShoutOut',{CAPTUREDIMAGE:photo.uri});
        }
    }



    render() {

        return (
            <View style={{flex: 1}}>


                <Camera style={{flex: 1}}
                        type={this.state.type}
                        ref={(ref) => { this.camera = ref }}>
                    <TouchableOpacity style={{marginTop: 45}}
                      onPress={() => this.props.navigation.goBack()}>
                        <Image source={leftBackArrow} style={styles.menu}>
                        </Image>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>


                    </View>
                    <TouchableOpacity
                        style={{
                            bottom: 10, top: 0, justifyContent: 'center',
                            height: 65, width: 65, backgroundColor: 'white', borderRadius: 65 / 2
                            , alignItems: 'center', marginBottom: 15, alignSelf: 'center'
                        }}
                        onPress={() => this.takePicture()}>

                        <View
                            style={{width: 50, height: 50, borderRadius: 50 / 2, borderColor: 'black', borderWidth: 2}}>

                        </View>
                    </TouchableOpacity>
                   {/* {this.state.capturedImage !=null&&
                    <Image source={{uti:this.state.capturedImage}} style={{height:150,width:150}}>
                    </Image>
                    }*/}

                </Camera>


            </View>


        )
            ;

    }
}


const styles = StyleSheet.create({

    container: {
        flex: 1,

    },

    sheader_view: {
        height: 90,

    }, header_view: {
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
        marginLeft: 15, backgroundColor: 'transparent'


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
        height: 180, alignItems: 'flex-start',
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
