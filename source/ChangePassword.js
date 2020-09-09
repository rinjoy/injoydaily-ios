import React, {Component} from 'react';
import {Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as SecureStore from "expo-secure-store";
const headerback = require('./../images/image-8.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/downarrow.png')
const downarrow = require('./../assets/downarrow.png')
const gallaryblack = require('./../assets/gallaryblack.png')
const nextgray = require('./../assets/nextgray.png')
const backarrow = require('./../assets/backarrow.png')
const profile = require('./../images/image-9.png')
const lockdarkgray = require('./../assets/lockdarkgray.png')
const passwordshow = require('./../assets/paswordshow.png')

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class ChangePassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstPass: '',
            secondPass: '',
            uid: ''

        }
    }

    componentDidMount() {
        getUserId().then(id =>
            this.setState({uid: id}),
        );
    }

    async updatePassword() {
        const url = global.base_url_live+'v1/api/update-user-password'
        //   this.setState({offSetLoader:true});
        if ((this.state.firstPass && this.state.secondPass != '')) {
            if ((this.state.firstPass == this.state.secondPass)) {
                const token_ = await SecureStore.getItemAsync('token');
                var token = `Bearer ${JSON.parse(token_)}`;
                const paramas =
                    {
                        uid: this.state.uid,
                        password: this.state.secondPass
                    }
                //alert(JSON.stringify(paramas))
                var object = {
                    method: 'POST',
                    body: JSON.stringify(paramas),
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    })
                };

                fetch(url, object)
                    .then(async (response) => response.text())
                    .then(async (responseText) => {
                            var dataobject = JSON.parse(responseText);
                            if (dataobject.status) {
                                this.setState({secondPass: '', firstPass: ''})
                                alert('Password updated');
                                this.props.navigation.navigate('Account');
                            }else{
                                alert('Falied.')
                            }
                        }
                    )
                    .catch((error) => {
                        //alert(JSON.stringify(error))
                    })

            } else {
                alert("Both password does't match.")
            }


        } else {
            // this.setState({offSetLoader:false});
            alert('Please fill password.')
        }

    }


    render() {
        return (
            <View style={styles.container}>
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
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}> My Account
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}


                <Text style={{fontFamily: 'PoppinsRegular', marginTop: 25, marginLeft: 10}}> Change password </Text>

                <View style={styles.passwordinput_view}>
                    <Image style={styles.image_continer} source={lockdarkgray}>
                    </Image>
                    <TextInput placeholder='Password'
                               onChangeText={(text) => this.setState({firstPass: text})}
                               style={{flex:1, marginLeft: 10,backgroundColor:'transparent',height:'100%'}}>
                    </TextInput>
                </View>

                <View style={styles.confirminput_view}>
                    <Image style={styles.image_continer} source={lockdarkgray}>
                    </Image>
                    <TextInput
                        placeholder='Confirm Password'
                        style={{flex:1, marginLeft: 10,backgroundColor:'transparent',height:'100%'}}
                        onChangeText={(text) => this.setState({secondPass: text})}
                    >
                    </TextInput>
                    <TouchableOpacity style={{marginRight: 20}}>
                        <Image style={styles.passwordimage_continer} source={passwordshow}>
                        </Image>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{
                        borderWidth: 1.5, backgroundColor: 'black', marginHorizontal: 15,
                        height: 45, marginTop: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 2
                    }}
                    onPress={() => this.updatePassword()}
                >
                    <Text style={{marginLeft: 10, fontFamily: 'PoppinsBold', fontSize: 12, color: 'white'}}> UPDATE
                        PASSWORD </Text>
                </TouchableOpacity>

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
        width: 28,
        height: 18,
        marginLeft: 15,


    },

    profile: {
        width: 60,
        height: 60,
    },

    passwordinput_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        height: 50,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    confirminput_view: {
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: '92%',
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
})