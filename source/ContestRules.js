import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import WebView from 'react-native-webview';
const profile = require('./../images/image-9.png');
const tabcalendar = require('../assets/calendar.png');
const library = require('./../assets/gallary.png');
const user = require('./../assets/user.png');

const headerback = require('./../images/image-8.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/tickets.png')

const getUserName = async () => {
    return await SecureStore.getItemAsync('USERNAME');
};
export default class ContestRules extends Component {

    constructor(props) {
        super(props)
        this.state = {
            htmlContent: '',
            userFbProfile: null,
            profilePic: this.props.navigation.state.params.profilePic,
            userName: '',
            isOpen: false,
            selectedItem: 'DashBoard',
        };

        this.toggle = this.toggle.bind(this);

    }


    componentDidMount() {
        getUserName().then((name) =>
            this.setState({userName: JSON.parse(name)})
        )
        this.getFacebookProfilePic();
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

    render() {
        const menu = <ContentView
            onItemSelected={this.onMenuItemSelected}
            userProfile={this.state.profilePic}
            userName={this.state.userName}

        />;
        //     const htmlContent = `
        //     <h1>This HTML snippet is now rendered with native components !</h1>
        //     <h2>Enjoy a webview-free and blazing fast application</h2>
        //     <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
        //     <em style="textAlign: center;">Look at how happy this native cat is</em>
        // `;
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
                                    <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}> Contest Rules/Prizes
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

                    {/* <ScrollView> */}

                    <WebView source={{uri: global.base_url_live+'v1/api/get-contest-rules-prizes'}}/>
                    {/* </ScrollView> */}
                    {/* <Text style={{fontFamily:'PoppinsSemiBold',fontSize:12,
                    marginHorizontal:20,textAlign:'center',marginTop:20}}> 
                        Raffle will be for all participants. 
                        Tickets will allow you to be entered for a chance to win some greate prizes. 
                        How do I earn raffle tickets?
                    </Text>

                    <View style={{justifyContent:'center',alignItems:'center',height:150,height:300,marginHorizontal:25}}> 
                        <Image style={{alignItems:'center',height: 200,width:280}} source={tickets} >
                            </Image>
                            <Text style={{fontFamily:'PoppinsRegular',fontSize:14,textAlign:'center',marginHorizontal:20,marginTop:15}}> 
                                Raffle tickets will be earned in the following manner:
                                </Text>
                    </View>

                        <View style={{borderWidth:1,borderColor:'lightgray',height:40,flexDirection:'row',alignItems:'center',justifyContent:'center'}}> 
                            <Text style={{fontFamily:'PoppinsRegular',fontSize:12,textAlign:'center',color:'gray'}}>
                                100 challenge pts = 1 raffle ticket
                                 </Text>
                        </View>

                        <Text style={{fontFamily:'PoppinsRegular',fontSize:12,textAlign:'center',color:'gray',marginHorizontal:40,marginTop:15}}>
                         At the end of challenge, all participants' raffle tickets will be put into the drawing. </Text>
                         
                         <Text style={{fontFamily:'PoppinsRegular',fontSize:12,textAlign:'center',color:'gray',marginHorizontal:40,marginTop:15}}>
                         Winner will be notified </Text>

                         <Text style={{fontFamily:'PoppinsRegular',fontSize:12,textAlign:'center',color:'gray',marginHorizontal:50,marginTop:15}}>
                         More points = more chance to win! </Text>

                        <View style={{backgroundColor:'lightgray',height:1, marginTop:10}}> 
                            </View>

                        <Text style={{fontFamily:'PoppinsSemiBold',fontSize:13,marginHorizontal:25,textAlign:'center',marginTop:20}}> 
                            Prizes will be:
                            </Text>

                        <Text style={{fontFamily:'PoppinsRegular',fontSize:13,marginHorizontal:25,textAlign:'center',marginTop:10}}> 
                            Tiered Amazon gift cards
                            </Text>

                        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:40,marginBottom:40,height:30}}>
                            
                            <View style={{fontFamily:'PoppinsRegular',fontSize:14,textAlign:'center',marginTop:20
                                    ,backgroundColor:'#ffdcb2',width:85,height:31,alignItems:'flex-end',justifyContent:'center',borderRadius:5}}>

                                <Text style={{fontFamily:'PoppinsRegular',width:'100%',fontSize:13,textAlign:'center'}}> 
                                     3 x $25
                                </Text>
                            </View>

                            <View style={{fontFamily:'PoppinsRegular',fontSize:14,textAlign:'center',marginTop:20
                                    ,backgroundColor:'#c9e9f8',width:85,height:31,alignItems:'flex-end',justifyContent:'center',borderRadius:5}}>

                                <Text style={{fontFamily:'PoppinsRegular',width:'100%',fontSize:13,textAlign:'center'}}> 
                                     1 x $50
                                </Text>
                            </View>

                            <View style={{fontFamily:'PoppinsRegular',fontSize:14,textAlign:'center',marginTop:20
                                    ,backgroundColor:'#8fdbd3',width:85,height:31,alignItems:'flex-end',justifyContent:'center',borderRadius:5}}>

                                <Text style={{fontFamily:'PoppinsRegular',width:'100%',fontSize:13,textAlign:'center'}}> 
                                     1 x $75
                                </Text>
                            </View>

                        </View> */}
                    {/* </ScrollView> */}

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
                                            //backgroundColor: '#84d3fd',
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

            </SideMenu>
        );

    }

    async logOutWithToken() {

        this.setState({showloader: true})

        const url_logout = global.base_url_live+'v1/api/app-logout'

        var token = await SecureStore.getItemAsync('token');

        var parameters = {
            token: JSON.parse(token)
        };
        var token = `Bearer ${JSON.parse(token)}`;
        fetch(url_logout,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }), body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    var dataobject = JSON.parse(responseText);

                    if (dataobject.status == 1) {
                        this.setState({email: ''})
                        this.setState({password: ''})
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
                this.setState({email: ''})
                this.setState({password: ''})
                Alert.alert('injoy', error, [{text: 'Ok', onPress: () => this.setState({showloader: false})}])


                console.log("Exception on login time is ===", error)
                // alert(error);
            })
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
        height: 26,
        marginLeft: 20,

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