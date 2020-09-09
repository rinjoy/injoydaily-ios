import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StatusBar,
    ImageBackground,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import ModalUpdateShareWin from './../modals/ModalUpdateShareWin';
import Modal from 'react-native-modal';
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const crossarrow = require('./../../images/close.png');
const backarrow = require('../../assets/backarrow.png');
const dagger = require('../../images/dager.png');
const editblack = require('./../../assets/editblack.png');

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class MyGallery extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            challengeId: '',
            categoryId: '',
            featureId: '',
            itemCount: 0,
            offSet: 0,
            day: '',
            data_list: [],
            uid: '',
            week: '',
            editIndex: '',
            editPost: {},
            editModal: false,
            totalItemCounts: 0,
            offSetLoader: false,
            gotItems: false
        }
        this.renderRow = this.renderRow.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
    }

    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

    }

    editmodalVisible() {
      this.setState({editModal: !this.state.editModal})
    }

    onedit(data, index) {
      this.setState({editPost: data});
      this.setState({editIndex: index});
      this.editmodalVisible();
    }

    editUpdateData (dataGet) {
      this.state.data_list[this.state.editIndex] = dataGet;
      this.setState({data_list: this.state.data_list});
    }


    getDataObject(dataObject) {

        this.setState({challengeId: dataObject.challenge_id});
        this.setState({featureId: dataObject.feature_id});
        this.setState({day: dataObject.day});
        this.setState({week: dataObject.week});
        this.setState({uid: dataObject.uid});
        //alert(this.state.day)

        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.setState({offSetLoader: true});
                    this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.week, this.state.uid);
                }
            }
        }, 1000);
    }

    async getAllDew(challangeId, featureId, day, week, uid) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-user-small-win';


        var parameters = {
            challenge_id: challangeId,
            feature_id: featureId,
            day: day,
            page_size: 10,
            data_offset: this.state.offSet,
            uid: uid,
            week: week
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
                    this.setState({offSetLoader: false});
                    this.setState({itemCount: dataobject.count_records});
                    var itemslength = dataobject.count_records;
                    this.setItemEmptyOrNot(itemslength)
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
        if (data.status == true) {
            var list = data.small_win_all;
            this.setState({data_list: this.state.data_list.concat(list)})
        }
    }

    setItemEmptyOrNot(itemslength) {
        if (itemslength == 0) {
            this.setState({totalItemCounts: dataobject.count_records, gotItems: true});
        }
    }

    renderRow(item, rowmap) {
        //console.log(dataHolder)
        return (

            <View>
                <View style={{
                    margin: 2,
                    flexDirection: 'row', marginTop: 10,
                    backgroundColor: 'white', padding: 5
                }}>
                    <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                        <Image source={{uri: item.profile_pic}}
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

                            <View style={{
                                backgroundColor: 'transparent',
                                height: 30,
                                alignItems: "center",
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold'}}>{item.name}</Text>
                                <Text style={{
                                    fontFamily: 'PoppinsRegular',
                                    color: 'gray',
                                    fontSize: 10
                                }}>{item.time}</Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', backgroundColor: 'transparent', padding: 0}}>
                              <View style={{flex: 0.89}}>
                                <Text
                                    style={{fontSize: 12, fontFamily: 'PoppinsSemiBold', color: 'gray', marginTop: -3}}
                                >{item.comment}</Text>
                              </View>
                              <View style={{flex: 0.01}}>
                              </View>
                              <View style={{flex: 0.1, marginTop: 15, backgroundColor: 'transparent'}}>
                              {this.state.id == item.uid &&
                                <Menu>
                                  <MenuTrigger>
                                    <View style={{backgroundColor: 'transparent', paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10}}>
                                      <Image source={dagger} style={{width: 6, height: 22}}>
                                      </Image>
                                    </View>
                                  </MenuTrigger>
                                  <MenuOptions>

                                    <MenuOption onSelect={() => this.onedit(item, rowmap)}>
                                      <View style={{paddingTop: 8, backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, flexDirection: 'row'}}>
                                      <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                                      <Image source={editblack} style={{height: 12, width: 10, marginTop: 0}}/>
                                      </View>
                                    </MenuOption>
                                  </MenuOptions>
                                </Menu>
                                }
                              </View>
                            </View>

                        </View>

                    </View>


                </View>
                <View style={{height: 1, backgroundColor: 'rgba(54,69,79,0.35)', marginTop: 10}}></View>
            </View>


        )

    }

    handeLoadMoreItem = () => {
        if (this.state.itemCount !== 0) {
            this.setState({offSet: this.state.offSet + 10});
            this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.week, this.state.uid);
        }
    }

    footerComponent = () => {
        if (this.state.offSetLoader) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator size="small"/>
                </View>
            )
        }
        return (<View style={{height: 20}}></View>);
    }

    renderNoItemView() {
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No data found</Text>
        </View>
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
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}
                                      numberOfLines={1}>My Gallery
                                </Text>
                            </View>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}
                <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'PoppinsLight'}}>no content available now.</Text>
                </View>
            </View>

        );

    }

}
    const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },

    flatlist: {
        flex: 1, backgroundColor: 'transparent'
        , paddingHorizontal: 0, paddingVertical: 0
    },
    radiobuttonContainer: {
        height: 20, width: 20, borderRadius: 20 / 2, marginLeft: 0,
        backgroundColor: 'black', borderColor: 'white', borderWidth: 1, justifyContent: 'center', alignItems: 'center'
    }, radiobuttonImageContainer: {
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
    }, loader: {
        marginTop: 5, alignItems: 'center', height: 60, backgroundColor: "transparent"
    }
});
