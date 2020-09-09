
import React,{Component} from 'react';
import {View,StyleSheet,Text,Image,ImageBackground,TouchableOpacity,ScrollView,Alert,Dimensions} from 'react-native';

import SideMenu from 'react-native-side-menu';
import ContentView from './ContentView';
import HTML from 'react-native-render-html';

import { WebView } from 'react-native-webview';
const profile = require('./../images/image-9.png')
const menuImg = require('./../assets/menu.png')
const headerback = require('./../images/image-8.png')
const tickets = require('./../assets/tickets.png')
const backarrow = require('./../assets/backarrow.png')
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from "expo-secure-store";

const getUserName = async () => {
    return await SecureStore.getItemAsync('USERNAME');
};
export default class PrivacyPolicy extends Component {

    componentDidMount() {
        getUserName().then((name) =>
            this.setState({userName: JSON.parse(name)})
        )
    }
    constructor(props) {
        super(props)

        this.state = {
            htmlContent:'',
            profilePic: this.props.navigation.state.params.profilePic,
            isOpen: false,
            feature_url: global.base_url_live+'v1/api/get-terms-conditions-content'
        }
        this.toggle = this.toggle.bind(this);
        this.goBackDashboard = this.goBackDashboard.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    goBackDashboard() {
      if(this.props.navigation.state.params.route !== undefined && this.props.navigation.state.params.route == 'signup') {
        this.props.navigation.navigate('SignUp');
      }
      else{
        this.props.navigation.navigate('DashBoard',{image_url: this.state.image, user_name: this.state.userName});
      }
        //console.log(this.props.navigation);

        //this.props.navigation.goBack();
    }

    updateMenuState(isOpen) {
        this.setState({isOpen});
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

    onMenuItemSelected = item =>
        this.setState({
            isOpen: false,
            selectedItem: item == 'logout' ? this.logOutWithToken() : this.props.navigation.navigate(item, {profilePic: this.state.profilePic}),
        })

    ActivityIndicatorLoadingView() {
   //making a view to show to while loading the webpage
   return (
        <Spinner visible={true} textContent={''} color={'black'}/>
   );
 }



    render() {
        const menu = <ContentView
            onItemSelected={this.onMenuItemSelected}
            userProfile={this.state.profilePic}
            userName={this.state.userName}
        />;

        return(
            <SideMenu
                menu={menu}
                isOpen={this.state.isOpen}
                onChange={isOpen => this.updateMenuState(isOpen)}>

            <View style={styles.container}>
              {/* Header View */}
              <View style={styles.header_view} >
                    <ImageBackground source={headerback} style={styles.header_image}>
                    {/* Header items View */}

                        <View style={styles.header_items}>
                            <View style={{width: '18%', backgroundColor: 'transparent'}}>
                                <TouchableOpacity onPress={() => this.goBackDashboard()}>
                                    <Image source={backarrow} style={styles.menu}>
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
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18, color:'#fff'}}> Privacy Policy
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

                 <WebView
                 startInLoadingState
                 renderLoading={this.ActivityIndicatorLoadingView}
                 source={{ uri: this.state.feature_url }}
                 style={{ marginTop: 15 }} />
                 <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>
            </View>
            </SideMenu>
        );

    }


}

const styles = StyleSheet.create ({

    container: {
        flex:1,
        backgroundColor:'white'
    },
    header_view: {
        height:100,

    },
    profile: {
        width: 55,
        height: 55, marginRight: 15, marginTop: 0,
        borderRadius: 55 / 2
    },

    header_items: {
        height:55,
        flexDirection:'row',
        alignItems:'center',

        marginTop:35,
    },
    header_image: {
        flex:1,
        height:100
    },


    menu: {
        width: 38,
        height: 28,
        marginLeft: 20,

    },
})
