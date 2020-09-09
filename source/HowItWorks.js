import React, {Component} from 'react';
import {
    Alert, AsyncStorage,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
const profile = require('./../images/image-9.png');
const headerback = require('./../images/image-8.png')
const menuImg = require('./../assets/menu.png')
const tickets = require('./../assets/tickets.png')

const box1 = require('./../images/image-20.png')
const box2 = require('./../images/image-21.png')
const box3 = require('./../images/image-22.png')
const box4 = require('./../images/image-23.png')
const box5 = require('./../images/image-24.png')
const box6 = require('./../images/image-25.png')
const tabcalendar = require('../assets/calendar.png');
const library = require('./../assets/gallary.png');
const user = require('./../assets/user.png');

const screenwidth = Dimensions.get('window').width
const screenheight = Dimensions.get('window').height
const getUserName = async () => {
    return await SecureStore.getItemAsync('USERNAME');
};


export default class HowItWorks extends Component {

    constructor(props) {
        super(props)
        this.state = {
            contentarray: [],
            isOpen: false,
            profilePic: this.props.navigation.state.params.profilePic,
            selectedItem: 'DashBoard',
            userFbProfile:null,
            userName:''


        };

        this.toggle = this.toggle.bind(this);

    }

    // USERNAME
    componentDidMount() {
        getUserName().then((name)=>
            this.setState({userName:JSON.parse(name)})
        )
        this.getFacebookProfilePic();
        this.getApiData()

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

        return (

            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}>

                <View style={styles.container}>
                    {/* Started Header View */}
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
                                    <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}> How it works
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
                    <View style={{flexDirection: 'row', marginTop: 0, flex: 1}}>
                        <FlatList
                                  contentContainerStyle={{paddingVertical:20}}
                                  showsHorizontalScrollIndicator={false}
                                  vertical={true}
                                  numColumns={2}
                                  data={this.state.contentarray}
                                  renderItem={({item}) =>
                                      <TouchableOpacity style={{
                                          height: screenheight / 3.8,
                                          width: screenwidth / 2.2,
                                          marginBottom: 5,
                                          marginLeft: 12
                                      }}
                                      onPress={()=>this.props.navigation.navigate('HowItWorksSeeAll',{DATA:item.view_link, feature_name:item.heading})}
                                      >
                                          <ImageBackground source={{uri: item.image}} style={{
                                              height: '100%',
                                              width: '100%',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                          }}>
                                              <View style={{marginHorizontal: 15, height: 70}}>
                                                  <Text style={{
                                                      fontFamily: 'PoppinsSemiBold',
                                                      fontSize: 14,
                                                      color: 'white'
                                                  }}>{item.heading}
                                                  </Text>
                                                  <Text style={{
                                                      fontFamily: 'PoppinsRegular',
                                                      fontSize: 11,
                                                      color: 'white',
                                                      height: 50
                                                  }}>{item.content}
                                                  </Text>
                                              </View>
                                          </ImageBackground>
                                      </TouchableOpacity>
                                  }/>
                    </View>


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
        )
    }


    async getApiData() {

        this.setState({showloader: true})

        const url = global.base_url_live+'v1/api/get-how-it-works-content'

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
                    console.log('dataobject000000', dataobject)
                    //  Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])

                    if (dataobject.content.length > 0) {
                        this.setState({showloader: false})
                        this.setState({contentarray: dataobject.content})
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
    grid_itemsview: {
        width: '44%',
        height: 150,
        borderRadius: 10,
        marginLeft: 15,
        marginVertical: 7,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        }
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
