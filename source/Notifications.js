import React, {Component} from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    StyleSheet,
    Text,
    ActivityIndicator,
    KeyboardAvoidingView,
    TextInput,ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {Dropdown} from 'react-native-material-dropdown';
import {Video} from "expo-av";
import HTML from "react-native-render-html";
import Spinner from "react-native-loading-spinner-overlay";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
//import {  Radio  } from 'native-base';
const headerback = require('../images/image-8.png');
const menuImg = require('../assets/menu.png');
const whitecheck = require('../assets/checkwhite.png');

const checkyellow = require('../images/checkblue.png');
const checkgray = require('../images/disable-check-1.png');
const tickets = require('../assets/downarrow.png');
const downarrow = require('../assets/downarrow.png');
const gallaryblack = require('../assets/gallaryblack.png');
const nextgray = require('../assets/nextgray.png');
const backarrow = require('../assets/backarrow.png');
const profile = require('../images/image-9.png');
const messageopenblack = require('../images/injoycirclelogo.png');


const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class Notifications extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            challengeId: this.props.navigation.state.params.challengeId,
            challengeArray: this.props.navigation.state.params.challengeArray,
            basicArray: this.props.navigation.state.params.basicArray.details,
            data_list: [],
            data_list_new: [],
            offSetLoader: false,
            accessToken: '',
        }
        this.renderRow = this.renderRow.bind(this);
    }




    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

        this.getDataObject();
    }

    getDataObject() {
        setTimeout(() => {

            if (this.state.challengeId != undefined) {
                    this.getListData();
            }
        }, 1000);
    }

    async getListData() {
        this.setState({offSetLoader:true})
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-user-notifications';

        var parameters = {
            challenge_id: this.state.challengeId,
            uid : this.state.id,
            page_size : 35,
            data_offset: 0
        };
        var token = `Bearer ${JSON.parse(token_)}`;
        fetch(url,
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
                    console.log('NotificationData', dataobject);
                    this.setState({offSetLoader: false});
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
        if(data.status){
            this.setState({data_list_new: this.state.data_list.concat(data.content.new)});
            this.setState({data_list: this.state.data_list.concat(data.content.earlier)});
        }
    }


    shiftBack() {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
    }

    refresh = (data) => {

    }


    renderRow(item, rowmap) {

        //console.log(dataHolder)
        var chlObject = {
            'challenge_id': this.state.challengeId,
            'feature_category_id': item.feature.category_id,
            'day': this.state.basicArray.day,
            'week': this.state.basicArray.week,
            'feature_name': item.feature.name
        };


        return (

            <View>
                <TouchableOpacity  onPress={() => {
                    if (item.feature.id == 5) {
                        this.props.navigation.navigate('ShareAWin', {
                            DATA: this.state.challengeArray,
                            challenge_details: chlObject,
                            onGoBack: this.refresh
                        })
                    }
                    else if(item.feature.id == 2) {
                        const {navigate} = this.props.navigation;
                        navigate('AddReply', {
                            'DATA': item.shout_out_original_object,
                            'feature_array': chlObject,
                            'basic_array': this.props.navigation.state.params.basicArray,
                            'profile_pic': item.shout_out_original_object.user_details.profile_pic,
                            'onGoBack': this.refresh,
                            'challengeID': this.state.challengeId
                        });
                    }
                    else{

                    }
                }}>
                <View style={{
                    margin: 2,
                    flexDirection: 'row', marginTop: 10, paddingLeft:15,
                    paddingRight:15,
                    backgroundColor: 'white', padding: 0
                }}>
                    <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                        <Image source={{uri: item.user.profile_pic}}
                               style={{height: 50, width: 50, marginLeft: 6, borderRadius: 50 / 2, marginTop: 5}}/>
                        <View style={{
                            backgroundColor: "transparent",
                            flex: 1,
                            height: '100%',
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 5,
                            padding: 1
                        }}>


                            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'transparent', padding: 0}}>
                                <View style={{flex: 0.89}}>
                                    <Text numberOfLines={3}
                                        style={{fontSize: 12, fontFamily: 'PoppinsSemiBold', color: 'black', marginTop: -3}}
                                    >{item.notification.message}<Text
                                        style={{fontSize: 12, fontFamily: 'PoppinsSemiBold', color: 'gray', marginTop: -3}}
                                    >{' "'+item.comment_details.comment+'"'}</Text></Text>

                                </View>
                                <View style={{flex: 0.01}}>
                                </View>
                            </View>
                            <View style={{
                                backgroundColor: 'transparent',
                                alignItems: "center",
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{
                                    fontFamily: 'PoppinsRegular',
                                    color: 'gray',
                                    fontSize: 10
                                }}>{item.notification.time}</Text>
                            </View>

                        </View>

                    </View>


                </View>
                <View style={{height: 0.5, marginLeft:20,marginRight:15, backgroundColor: 'rgba(54,69,79,0.35)', marginTop: 10}}></View>
                </TouchableOpacity>
            </View>

        )
    }


    renderRowNew(item, rowmap) {

        //console.log(dataHolder)
        var chlObject = {
            'challenge_id': this.state.challengeId,
            'feature_category_id': item.feature.category_id,
            'day': this.state.basicArray.day,
            'week': this.state.basicArray.week,
            'feature_name': item.feature.name
        };


        return (

            <View>
                <TouchableOpacity  onPress={() => {
                    if (item.feature.id == 5) {
                        this.props.navigation.navigate('ShareAWin', {
                            DATA: this.state.challengeArray,
                            challenge_details: chlObject,
                            onGoBack: this.refresh
                        })
                    }
                    else if(item.feature.id == 2) {
                        const {navigate} = this.props.navigation;
                        navigate('AddReply', {
                            'DATA': item.shout_out_original_object,
                            'feature_array': chlObject,
                            'basic_array': this.props.navigation.state.params.basicArray,
                            'profile_pic': item.shout_out_original_object.user_details.profile_pic,
                            'onGoBack': this.refresh,
                            'challengeID': this.state.challengeId
                        });
                    }
                    else{

                    }
                }}>
                    <View style={{
                        margin: 2,
                        flexDirection: 'row', marginTop: 10, paddingLeft:15,
                        paddingRight:15,
                        backgroundColor: 'white', padding: 0
                    }}>
                        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                            <Image source={{uri: item.user.profile_pic}}
                                   style={{height: 50, width: 50, marginLeft: 6, borderRadius: 50 / 2, marginTop: 5}}/>
                            <View style={{
                                backgroundColor: "transparent",
                                flex: 1,
                                height: '100%',
                                marginLeft: 10,
                                marginRight: 10,
                                marginTop: 5,
                                padding: 1
                            }}>


                                <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'transparent', padding: 0}}>
                                    <View style={{flex: 0.89}}>
                                        <Text numberOfLines={3}
                                              style={{fontSize: 12, fontFamily: 'PoppinsSemiBold', color: 'black', marginTop: -3}}
                                        >{item.notification.message}<Text
                                            style={{fontSize: 12, fontFamily: 'PoppinsSemiBold', color: 'gray', marginTop: -3}}
                                        >{' "'+item.comment_details.comment+'"'}</Text></Text>

                                    </View>
                                    <View style={{flex: 0.01}}>
                                    </View>
                                </View>
                                <View style={{
                                    backgroundColor: 'transparent',
                                    alignItems: "center",
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={{
                                        fontFamily: 'PoppinsRegular',
                                        color: 'gray',
                                        fontSize: 10
                                    }}>{item.notification.time}</Text>
                                </View>

                            </View>

                        </View>


                    </View>
                    <View style={{height: 0.5, marginLeft:20,marginRight:15, backgroundColor: 'rgba(54,69,79,0.35)', marginTop: 10}}></View>
                </TouchableOpacity>
            </View>

        )
    }


    renderEmptyContainer = () => {
        return(
            <View style={{flex: 1, backgroundColor: 'transparent', marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'PoppinsLight'}}>no content available...</Text>
            </View>
        )
    }

    footerComponent = () => {
        if (this.state.offSetLoader) {
            return (
                <View style={{height: 50, justifyContent: 'center',backgroundColor:'transparent'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
        return (<View style={{height: 10}}></View>);

    }


    render() {
        return (
            <View style={styles.container}>
            {/*<Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>*/}
                {/* Header View */}
                <View style={styles.header_view}>
                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity onPress={() => this.shiftBack()}>
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
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}
                                      numberOfLines={1}> Notifications
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>


                </View>
                {/* Ended Header View */}
                <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}} behavior='padding' enabled   keyboardVerticalOffset={0}>
                <ScrollView ref={ref => {this.scrollView = ref}} style={{flex: 1, backgroundColor:'transparent'}}>
                    <View style={{ backgroundColor: 'transparent', marginTop: 0}}>

                        {this.state.data_list_new.length !== 0 &&
                            <View>
                                <View style={{flex: 1, marginHorizontal: 15, marginTop:15, backgroundColor:'#4AAFE3'}}>
                                    <Text style={{paddingLeft: 10, color: '#fff', fontFamily:'PoppinsSemiBold', fontSize: 18}}>
                                        New
                                    </Text>
                                </View>
                            <FlatList
                            ref={(ref1) => {
                            this.flatListRef = ref1;
                        }}
                            style={styles.flatlist}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data_list_new}
                            //ListHeaderComponent={this.headerComponent}
                            ListFooterComponent={this.footerComponent}
                            //onEndReached={this.handeLoadMoreItem}
                            //onEndReachedThreshold={0.25}
                            ListEmptyComponent={this.renderEmptyContainer}
                            pagingEnabled={false}
                            extraData={this.state}
                            renderItem={({item, index}) => this.renderRowNew(item, index)}
                            keyExtractor={(item, index) => index.toString()}/>

                            </View>
                        }


                        {this.state.data_list_new.length !== 0 &&

                        <View style={{flex: 1, marginHorizontal: 15, marginTop: 15, backgroundColor: '#4AAFE3'}}>
                            <Text style={{paddingLeft: 10, color: '#fff', fontFamily: 'PoppinsSemiBold', fontSize: 18}}>
                                Earlier
                            </Text>
                        </View>
                        }

                        <FlatList
                            ref={(ref) => {
                                this.flatListRef = ref;
                            }}
                            style={styles.flatlist}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data_list}
                            //ListHeaderComponent={this.headerComponent}
                            ListFooterComponent={this.footerComponent}
                            //onEndReached={this.handeLoadMoreItem}
                            //onEndReachedThreshold={0.25}
                            ListEmptyComponent={this.renderEmptyContainer}
                            pagingEnabled={false}
                            extraData={this.state}
                            renderItem={({item, index}) => this.renderRow(item, index)}
                            keyExtractor={(item, index) => index.toString()}/>
                    </View>
                </ScrollView>
                </KeyboardAvoidingView>
            </View>

        );

    }

}
    const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
        flatlist: {
            flex: 1, backgroundColor: 'transparent'
            , paddingHorizontal: 0, paddingVertical: 0
        },
    radiobuttonContainer:{
        height:20,width:20,borderRadius:20/2,marginLeft:10,
        backgroundColor:'black',borderColor:'white',borderWidth:1,justifyContent:'center',alignItems:'center'
    },radiobuttonImageContainer:{
        height: 20, width: 20, alignItems: 'center', justifyContent: 'center'
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
