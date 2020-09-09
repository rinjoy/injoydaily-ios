import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, Dimensions
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {Video} from 'expo-av';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import ModalUpdateCommentJesfUpdates from './../modals/ModalUpdateCommentJesfUpdates';
import Modal from 'react-native-modal';
import Loader from './../loader/Loader';
import Emoji from "react-native-emoji";
import Toast from "react-native-easy-toast";

const notification = require('../../images/notitificationBell.png');
const whitebell = require('./../../images/whitebell.png');
const arrowfor = require('../../images/arrowfor.png');
const profile = require('../../images/image-9.png')
const headerback = require('../../images/image-8.png');
const profileGirl = require('../../images/image-92.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const backarrow = require('../../assets/backarrow.png');
const boxIcon = require('../../images/high-five-bar.png');
const handsBlack = require('../../images/hand-blck.png');
const handsBlue = require('../../images/hand-blue.png');
const comments1 = require('../../images/comments.png');
const commentblue = require('./../../images/commentblue.png');
const dagger = require('../../images/dager.png');
const flags = require('./../../images/1.png');
const editblack = require('./../../assets/editblack.png');
const flagblack = require('./../../assets/flagblack.png');
const crossarrow = require('./../../images/close.png');
const deviceHeight =  Dimensions.get("window").height;


const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class JeffUpdate extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',
            userFbProfile: null,
            challengeId: '',
            categoryId: '',
            shouldPlay: false,
            isPause: true,
            featureId: 13,
            itemCount: 0,
            offSet: 0,
            day: '',
            data_list: [],
            commentList: [],
            uid: '',
            _isEditable: false,
            week: '',
            totalItemCounts: 0,
            offSetLoader: false,
            gotItems: false,
            notificationCount: 0,
            commentText: '',
            editModal: false,
            editIndex: '',
            editPost: {},

        }
        this.renderRow = this.renderRow.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
        //this.renderInstantComment = this.renderInstantComment.bind(this);
    }

    componentDidMount() {
        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );

        this.getDataObject(this.props.navigation.state.params.challenge_details);
    }


    getDataObject(dataObject) {

        this.setState({challengeId: dataObject.challenge_id});
        this.setState({categoryId: dataObject.feature_category_id});
        this.setState({uid: this.state.id});
        //alert(this.state.day)

        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.setState({offSetLoader: true});
                    this.getAllDew(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.id);
                }
            }
        }, 1000);
    }

    async getAllDew(challangeId, featureCategoryId, featureId, uid) {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-jeff-updates-active-content-see-all';


        var parameters = {
            challenge_id: challangeId,
            category_id: featureCategoryId,
            feature_id: featureId,
            uid: uid,
            data_offset: 0,
            page_size: 0
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
                   // console.log('dataobject--->', dataobject);
                    var profile = dataobject.user_details.profile_pic
                    this.setState({userFbProfile:profile})
                    this.setState({itemCount: dataobject.jeff_updates.length});
                    var itemslength = dataobject.jeff_updates.length;

                 //   this.setItemEmptyOrNot(itemslength)
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    InheritedData(data) {
        //alert(JSON.stringify(data))
        if (data.status) {
            var list = data.jeff_updates;
            this.setState({data_list: this.state.data_list.concat(list)})
            this.getComments()
        }
    }


    setItemEmptyOrNot(itemslength) {
        if (itemslength == 0) {
            this.setState({totalItemCounts: dataobject.count_records, gotItems: true});

        }
    }

    async getComments() {
       // this.setState({offSetLoader: true});
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-jeff-updates-active-content-records';

        var parameters = {
            token: JSON.parse(token_),
            uid: this.state.id,
            category_id: this.state.categoryId,
            feature_id: this.state.featureId,
            page_size: 150,
            offset: this.state.offSet
        }

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
                    //alert(JSON.stringify(responseText))
                    var dataobject = JSON.parse(responseText);
                    //console.log('dataobject',dataobject);
                    if (dataobject.status) {
                        this.setState({offSetLoader: false});
                        this.setDataList(dataobject);
                    }


                  this.setState({itemCount: dataobject.count_records});
                  if (dataobject.count_records == 0) {
                    this.setState({offSetLoader: false,itemCount:0});
                }
                }
            )
            .catch((error) => {
            })

    }

    setDataList(dataObject){

         var array  = dataObject.jeff_updates.records
        this.setState({commentList: this.state.commentList.concat(array)})

    }
    async replyMessage(text) {
        this.setState({offSetLoader: true})
        if (this.state.commentText !== '') {
            const url = global.base_url_live+'v1/api/submit-jeff-updates-action';
            const token_ = await SecureStore.getItemAsync('token');

            var parameters = {
                token: JSON.parse(token_),
                type: 'c',
                uid: this.state.id,
                category_id: this.state.categoryId,
                feature_id: this.state.featureId,
                comment: text
            };
            var token = `Bearer ${JSON.parse(token_)}`;
            //return ;
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
                        if (dataobject.status) {
                            this.refs.toast.show(
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{color:'white',fontSize:12}}>Keep It Up </Text>
                                    <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                    />

                                </View>)
                            this.state.commentList.unshift(dataobject.this_saved_object);
                            this.setState({offSetLoader: false});
                            this.textInputComment.clear();
                            this.setState({commentText: ''});
                            var count = parseInt(this.state.data_list[0].total_comments) +1;
                            this.state.data_list[0].total_comments = count;
                            this.setState({data_list: this.state.data_list});
                            this.setState({total_comments: count});
                            this.flatListComment.scrollToOffset({animated: true, offset: 0});

                        } else {
                            alert(dataobject.message);
                            this.setState({offSetLoader: false});
                        }

                    }
                )
                .catch((error) => {
                })

        } else {
            alert('Please add comment.')
        }

    }
    async messageHighFive(data) {
        const url = global.base_url_live+'v1/api/submit-jeff-updates-action';
        const token_ = await SecureStore.getItemAsync('token');

        var parameters = {
            token: JSON.parse(token_),
            type: 'l',
            uid: this.state.id,
            category_id: this.state.categoryId,
            feature_id: this.state.featureId,
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
                   // alert(JSON.stringify(responseText))
                    if (dataobject.status) {
                        // alert('true..');
                        this.state.data_list[0].if_you_high_fived = true;
                        var count = parseInt(parseInt(this.state.data_list[0].total_high_fives) + 1);
                        this.state.data_list[0].total_high_fives = count;
                        this.setState({data_list: this.state.data_list});
                        this.refs.toast.show(
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Text style={{color:'white',fontSize:12}}>Yes!  </Text>
                                <Emoji name="clap" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                                />

                            </View>)
                    } else {
                        alert(dataobject.message);
                    }
                }
            )
            .catch((error) => {
            })
    }
    onedit(data, index) {
        this.setState({editPost: data});
        this.setState({editIndex: index});
        this.editmodalVisible();
    }
    editmodalVisible() {
        console.log(this.state.editModal);
        this.setState({editModal: !this.state.editModal})
    }

    editUpdateData(dataGet) {
      //console.log('dataGet', this.state.editIndex);
         this.state.commentList[this.state.editIndex] = dataGet;
         this.setState({commentList: this.state.commentList});
    }

    listEmptyComponent = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 45}}>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 10, color: 'gray'}}>No comments yet.</Text>
            </View>
        )
    }

    renderRow(dataHolder, rowMap) {
        return (

            <View>
                <View style={{
                    margin: 2, marginTop: 10,
                    backgroundColor: 'transparent', padding: 5, paddingHorizontal: 15
                }}>
                    <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
                        <Image source={{uri: dataHolder.item.dashboard_image}}
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
                                alignItems: "flex-start",
                                //flexDirection: 'row',
                                //justifyContent: 'space-between'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold'}}>{dataHolder.item.title}</Text>
                            </View>

                        </View>

                    </View>


                </View>
                <View style={{flex: 1, marginTop: 3}}>
                    {/*{(dataHolder.item.file_type == 'v' && dataHolder.item.file !== null) &&*/}
                    <Video
                        source={{uri: dataHolder.item.file}}
                        rate={1.0}
                        volume={1.0}
                        mute={false}
                        ref={videoplayer => {
                            this.videoPlayer = videoplayer
                        }}
                        resizeMode="stretch"
                        //onTouchStart={() => alert('start')}
                        isLooping={false}
                        shouldPlay={this.state.shouldPlay}
                        //  shouldCorrectPitch={true}
                        useNativeControls={true}
                        paused={this.state.isPause}
                        usePoster={false}
                        posterSource={{url: dataHolder.item.video_poster}}
                        posterStyle={{
                            width: '100%',
                            height: dataHolder.item.file == null ? 0 : 230,
                            resizeMode: 'stretch'
                        }}
                        style={{
                            width: '100%',
                            height: dataHolder.item.file == null ? 0 : 230,
                            borderRadius: 2,
                            marginTop: 5
                        }}
                    />

                    {/*}*/}

                </View>
                {dataHolder.item.description !== null &&
                <Text style={{
                    fontFamily: 'PoppinsRegular',
                    color: 'gray',
                    fontSize: 10,
                    paddingHorizontal: 15,
                    marginTop: 7
                }}>{dataHolder.item.description}</Text>
                }

                <View style={{
                    height: dataHolder.item.description == null ? 0 : 1,
                    backgroundColor: 'rgba(54,69,79,0.35)',
                    marginTop: 10
                }}></View>


                {/*start hive five and cmment sction from  here*/}
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingBottom: 15,
                    marginTop: 10,
                    backgroundColor: 'transparent',
                    paddingVertical: 5,
                    paddingHorizontal: 10
                }}>
                    <View style={{
                        flex: 0.40,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>

                        {/*if high five has done then return view*/}
                        {dataHolder.item.if_you_high_fived &&
                        <View style={{
                            backgroundColor: '#7BD1FD',
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 15
                        }}>
                            <Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High
                                Five</Text></View>
                        }

                        {/*  if high five not done then return toucahble opacity */}
                        {!dataHolder.item.if_you_high_fived &&
                        <TouchableOpacity onPress={() => {
                            this.messageHighFive(dataHolder.item)
                        }}>
                            <View style={{
                                backgroundColor: '#626E77',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                borderRadius: 15
                            }}><Text style={{fontSize: 10, fontFamily: 'PoppinsRegular', color: '#fff'}}>High
                                Five</Text></View>
                        </TouchableOpacity>
                        }
                        <View style={{backgroundColor: 'transparent', marginLeft: 6}}>
                            <ImageBackground source={boxIcon} resizeMode='contain' style={{width: 70, height: 30}}>
                                <View style={{flexDirection: 'row', flex: 1}}>
                                    <View style={{
                                        flex: 0.5,
                                        backgroundColor: 'transparent',
                                        justifyContent: 'center',
                                        marginLeft: 10
                                    }}>
                                        {dataHolder.item.if_you_high_fived &&
                                        <Image source={handsBlue} style={{height: 15, width: 15}}>
                                        </Image>
                                        }
                                        {!dataHolder.item.if_you_high_fived &&
                                        <Image source={handsBlack} style={{height: 15, width: 15}}>
                                        </Image>
                                        }
                                    </View>

                                    <View style={{
                                        flex: 0.5,
                                        backgroundColor: 'transparent',
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        marginRight: 8
                                    }}>

                                        <Text style={{
                                            color: dataHolder.item.if_you_high_fived ? '#7BD1FD' : 'gray',
                                            fontSize: 13, marginLeft: 0, fontFamily: 'PoppinsMedium'
                                        }}>{dataHolder.item.total_high_fives}</Text>

                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </View>

                    <View style={{
                        flex: 0.60,
                        flexDirection: 'row',
                        backgroundColor: 'transparent',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity style={{flexDirection: 'row'}}>
                            <Image source={comments1} style={{width: 15, height: 15}}>
                            </Image>
                            <Text style={{
                                color: 'gray',
                                fontSize: 12, marginLeft: 5, fontFamily: 'PoppinsMedium',
                            }}>Comments ({dataHolder.item.total_comments})</Text>
                        </TouchableOpacity>


                      {/*<TouchableOpacity
                            style={{
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={() => this.navigateToAll(this.state.challengeId, this.state.categoryId, this.state.featureId, this.state.id)}>
                            <Text style={{fontSize: 15, color: 'gray', borderBottomWidth: 1, fontFamily: 'PoppinsMedium'}}>See All ></Text>
                        </TouchableOpacity>*/}

                    </View>


                </View>

                    <FlatList
                        style={{backgroundColor: 'white', marginTop: 10}}
                        showsVerticalScrollIndicator={false}
                        data={this.state.commentList}
                        pagingEnabled={false}
                        extraData={this.state}
                        // disableVirtualization={false}
                        ListEmptyComponent={this.listEmptyComponent()}
                        //ListFooterComponent={this.footerComponent}
                        //onEndReached={this.handeLoadMoreItem}
                        // onEndReachedThreshold={100}
                        ref={ref => this.flatListComment = ref}
                        renderItem={({item, index}) => this.renderInstantComment(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        />



            </View>


        )

    }

    renderInstantComment(dataHolder, rowmap) {
        return (
            <View style={{
                marginRight: 0, marginBottom: 0,
                flexDirection: 'row',
                marginTop: 0,
                backgroundColor: 'transparent',
                borderBottomWidth: 0.3,
                borderBottomColor: '#CACACA',
                paddingLeft: 20,
                paddingRight: 15,
                paddingVertical: 10,

            }}>

                <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Image source={{uri: dataHolder.user_details.profile_pic}}
                           style={{height: 50, width: 50, marginLeft: 6, borderRadius: 50 / 2}}/>
                    <View style={{backgroundColor: "transparent", flex: 1, marginLeft: 12, marginRight: 0, padding: 1}}>

                        <View style={{
                            backgroundColor: 'transparent',
                            alignItems: "flex-start",
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                            flex: 1
                        }}>
                            <View style={{flex: 0.90, backgroundColor: 'transparent', alignItems: "flex-start"}}>
                                <Text style={{fontFamily: 'PoppinsBold'}}>{dataHolder.user_details.name}</Text>
                            </View>
                            <View style={{flex: 0.10, backgroundColor: 'transparent', alignItems: "flex-end"}}>
                              {this.state.id == dataHolder.user_details.id &&
                                <Menu>
                                    <MenuTrigger>
                                        <View style={{
                                            backgroundColor: 'transparent',
                                            paddingLeft: 10,
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                            paddingRight: 10
                                        }}>
                                            <Image source={dagger} style={{width: 6, height: 22}}>
                                            </Image>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions>
                                        <MenuOption onSelect={() => this.onedit(dataHolder, rowmap)}>
                                            <View style={{
                                                paddingTop: 8,
                                                backgroundColor: 'transparent',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingHorizontal: 5,
                                                flexDirection: 'row'
                                            }}>
                                                <Text style={{fontFamily: 'PoppinsMedium'}}>Edit</Text>
                                                <Image source={editblack}
                                                       style={{height: 12, width: 10, marginTop: 0}}/>
                                            </View>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                              }
                            </View>
                        </View>

                        <View style={{flex: 1, backgroundColor: 'transparent', alignItems: "flex-start"}}>
                            <Text style={{
                                fontFamily: 'PoppinsRegular',
                                color: 'gray',
                                fontSize: 10,
                                marginLeft: 0
                            }}>{dataHolder.comment_details.time}</Text>
                        </View>
                        <View style={{flex: 1, height: '100%', backgroundColor: 'transparent', padding: 0}}>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'PoppinsRegular',
                                color: '#000',
                                marginTop: 5
                            }}>{dataHolder.comment_details.comment}</Text>
                        </View>

                    </View>

                </View>

            </View>
        )

    }

    handeLoadMoreItem = () => {
        if (this.state.itemCount !== 0) {
            console.log("handelmoreitem calledd")
            this.setState({offSet: this.state.offSet + 10});
            this.getComments();

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
        return (<View style={{height: 100}}></View>);
    }

    renderNoItemView() {
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No data found.</Text>
        </View>
    }

    navigateToAll(challangeId, categoryId, featureId, uid) {
        //alert(categoryId)
        var parameters = {
            challenge_id: challangeId,
            category_id: categoryId,
            feature_id: featureId,
            uid: uid
        };

        // alert(JSON.stringify(parameters));
        this.props.navigation.navigate('JeffUpdateSeeAll', {DATA: parameters});
    }

    textInputFocused() {
     this.flatListRef.scrollToOffset({ animated: true, offset: 220});
    }

    render() {
        return (


            <View style={styles.container}>
                {this.state.offSetLoader &&
                <Loader loaderVal={this.state.offSetLoader}/>
                }
                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={240}
                    fadeInDuration={700}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
                       hasBackdrop={true} isVisible={this.state.editModal}>


                    <KeyboardAvoidingView
                        enabled
                        behavior='position'
                        keyboardVerticalOffset={deviceHeight/12}>
                    <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
                        <View style={{padding: 0}}>
                            <TouchableOpacity onPress={this.editmodalVisible}>
                                <View style={{
                                    justifyContent: 'flex-end',
                                    paddingTop: 10,
                                    paddingRight: 15,
                                    backgroundColor: 'transparent',
                                    alignItems: 'flex-end'
                                }}>
                                    <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                                </View>
                            </TouchableOpacity>
                            <Text style={{
                                fontFamily: 'PoppinsRegular',
                                fontSize: 17,
                                textAlign: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: 'lightgray',
                                paddingBottom: 7
                            }}>Edit COMMENT</Text>
                            <ScrollView>
                                <ModalUpdateCommentJesfUpdates
                                    updateContent={this.state.editPost}
                                    challengeId={this.state.challengeId}
                                    categoryId={this.state.categoryId}
                                    onGoBack={this.editUpdateData}
                                    onPopUp={this.editmodalVisible}
                                    nav={this.props.nav}/>
                            </ScrollView>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
                <KeyboardAvoidingView style={{
                    flex: 1, flexDirection: 'column',
                    justifyContent: 'center',
                }} enabled behavior={(Platform.OS === 'ios') ? 'padding' : null} keyboardVerticalOffset={0}>

                    <ImageBackground source={headerback} style={styles.header_image}>
                        {/* Header items View */}
                        <View style={styles.header_items}>
                            <TouchableOpacity style={{flex: 0.10,}} onPress={() => this.props.navigation.goBack()}>
                                <Image source={backarrow} style={styles.menu}>
                                </Image>
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: 'column',
                                marginLeft: 0,
                                backgroundColor: 'tranaparent',
                                flex: 0.90,
                                alignItems: 'center'
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', color: '#fff', fontSize: 18}}>InJoy
                                    Updates</Text>
                                {/*<View style={{flexDirection: 'row', marginTop: -5}}>*/}
                                {/*    <Text style={{fontFamily: 'PoppinsBold'}}>120</Text>*/}
                                {/*    <Text style={{fontFamily: 'PoppinsRegular'}}> Points*/}
                                {/*    </Text>*/}
                                {/*</View>*/}
                            </View>


                            {/*<View style={{
                                flex: 0.15,
                                alignItems: 'flex-end',
                                marginRight: 5,
                                backgroundColor: 'transparent'
                            }}>
                                {this.state.userFbProfile == null &&
                                <Image source={profileGirl} style={styles.profile}>
                                </Image>
                                }
                                {this.state.userFbProfile != null &&
                                <Image source={{uri: this.state.userFbProfile}} style={styles.profile}>
                                </Image>
                                }


                            </View>*/}

                            <View style={{height: 30, width: 35, backgroundColor: 'transparent', marginTop: -5}}>


                                    {this.state.notificationCount != 0 &&
                                    <View style={{
                                        backgroundColor: '#ffbe00',
                                        height: 13,
                                        width: 13,
                                        borderRadius: 13 / 2,
                                        marginRight: -3,
                                        marginTop: -8,
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>

                                        <Text style={{
                                            fontSize: 10,
                                            color: 'white',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold'
                                        }}>{this.state.notificationCount}</Text>
                                    </View>
                                    }
                            </View>

                        </View>
                    </ImageBackground>

                    {/*</View>*/}

                    {/* Ended Header View */}

                    <View style={{flex: 1, paddingHorizontal: 0, backgroundColor: 'white'}}>
                        {(this.state.totalItemCounts == 0 && this.state.gotItems) &&
                        this.renderNoItemView()
                        }
                        <FlatList
                            style={styles.flatlist}
                            ref={(ref) => { this.flatListRef = ref; }}
                            //  keyExtractor={this._keyExtractor}
                            //showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data_list}
                            keyExtractor={(item, index) => index.toString()}
                            //ListFooterComponent={this.footerComponent}
                            //onEndReached={this.handeLoadMoreItem}
                            //onEndReachedThreshold={100}
                            pagingEnabled={false}
                            extraData={this.state}
                            renderItem={this.renderRow}/>
                        <View style={{
                            zIndex: 99,
                            height: 40,
                            backgroundColor: 'transparent',
                            bottom: 0,
                            marginHorizontal: 10,
                            marginTop: 10,
                            marginBottom: 10
                        }}>
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <View style={{
                                    flex: 0.13,
                                    backgroundColor: 'transparent',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start'
                                }}>
                                    {this.state.userFbProfile == null &&
                                    <Image
                                        source={profile}
                                        style={{width: 40, height: 40, borderRadius: 40 / 2}}>
                                    </Image>
                                    }
                                    {this.state.userFbProfile != null &&
                                    <Image
                                        source={{uri: this.state.userFbProfile}}
                                        style={{width: 40, height: 40, borderRadius: 40 / 2}}>
                                    </Image>
                                    }
                                </View>
                                <View style={{flex: 0.68}}>
                                    <TextInput
                                        style={{
                                            width: '100%',
                                            minHeight: 40,
                                            backgroundColor: '#F0F0F6',
                                            paddingHorizontal: 10,
                                            elevation: 3,
                                            textAlignVertical: "center",
                                            shadowColor: "#000000",
                                            shadowOpacity: 0.3,
                                            shadowRadius: 2,
                                            shadowOffset: {
                                                height: 1,
                                                width: 1
                                            },
                                            paddingVertical: 5,
                                            borderRadius: 20
                                        }}
                                        placeholder="Comment here..."
                                        placeholderTextColor="grey"
                                        ref={input => {
                                            this.textInputComment = input
                                        }}
                                        onFocus={this.textInputFocused.bind(this)}
                                        onChangeText={text => this.setState({commentText: text})}
                                        underlineColorAndroid='transparent'
                                    />
                                </View>
                                <View style={{flex: 0.02}}>
                                </View>
                                <View style={{flex: 0.17}}>
                                    <TouchableOpacity onPress={() => [this.replyMessage(this.state.commentText), Keyboard.dismiss()]}>
                                        <View style={{
                                            height: 40,
                                            backgroundColor: '#4AAFE3',
                                            borderRadius: 25,
                                            justifyContent: 'center'
                                        }}>
                                            <Text style={{
                                                fontFamily: 'PoppinsBold',
                                                fontSize: 11,
                                                color: 'white',
                                                textAlign: 'center'
                                            }}>SEND</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
        justifyContent: 'center'
    },

    header_items: {
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
    header_image: {
        height: 90
    },

    menu: {
        width: 25,
        height: 25,
        marginLeft: 15,


    },

    // profile: {
    //     width: 60,
    //     height: 60,
    // },

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

    loader: {
        marginTop: 5, alignItems: 'center', height: 60, backgroundColor: "transparent"
    },
    profile: {
        width: 55,
        height: 55, borderRadius: 55 / 2
    },

});
