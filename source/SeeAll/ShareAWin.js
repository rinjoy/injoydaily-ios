import React, {Component} from 'react';
import {
    ActivityIndicator, Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView, StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from "react-native-loading-spinner-overlay";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import Modal from "react-native-modal";
import ModalUpdateShareWin from "../modals/ModalUpdateShareWin";
import Toast from "react-native-easy-toast";
import Emoji from "react-native-emoji";
const crossarrow = require('./../../images/close.png');
const deviceHeight = Dimensions.get("window").height;

const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const whitecheck = require('../../assets/checkwhite.png');
const backarrow = require('../../assets/backarrow.png');
const checkyellow = require('../../images/checkblue.png');
const checkgray = require('../../images/disable-check-1.png');
const dagger = require('../../images/dager.png');
const editblack = require('./../../assets/editblack.png');

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};


export default class ShareAWin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: true,
            loader: false,
            accessToken: '',itemCount:0,
            offSet:0,
            editIndex: '',
            offSetLoader: false,
            challengeId: this.props.navigation.state.params.challenge_details.challenge_id,
            categoryId: this.props.navigation.state.params.challenge_details.feature_category_id,
            featureId: 5,
            editPost:{},
            dropDowntext: '',
            day: this.props.navigation.state.params.challenge_details.day,
            data_list: [],
            uid: '',
            editModal:false,
            week: this.props.navigation.state.params.challenge_details.week,
            hederTitle: this.props.navigation.state.params.challenge_details.feature_name,
            contentData: [],
            question: '',
            textInoutHint: '',
            buttonHint: '',
            radioImageFirst: false,
            radioSecondbutton: false,
            countTodayCheckIn: 0
            , commentText: '',
            selectedItemId: null,
        }
        this.renderRow = this.renderRow.bind(this);
        this.editmodalVisible = this.editmodalVisible.bind(this);
        this.editUpdateData = this.editUpdateData.bind(this);
    }

    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken: token}),
        );


        getUserId().then(id =>
            this.setState({uid: id}),
        );

        this.getDataObject(this.props.navigation.state.params.DATA);
    }


    getDataObject(dataObject) {
        this.setState({buttonHint: dataObject.points});
        setTimeout(() => {
            if (this.state.challengeId != undefined) {
                if (this.state.day != undefined) {
                    this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.uid);
                }
            }
        }, 1000);
    }

    async getAllDew(challangeId, featureId, day, categoryId, week, uid) {
        this.setState({offSetLoader:true})
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-small-win-see-all-content';
        var parameters = {
            challenge_id: challangeId,
            feature_id: featureId,
            day: day,
            category_id: categoryId,
            week: week,
            uid: uid
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

                    this.setState({question: dataobject.small_win_content.question});
                    this.InheritedData(dataobject);
                }
            )
            .catch((error) => {
            })
    }
    InheritedData(data) {

        if (data.status == true) {
            //this.checkIn(this.state.countTodayCheckIn)

            var value = data.small_win_content.user_actions.action_status;
            this.setState({radioImageFirst: value});
            this.getShareAWinList();

        }
    }
    async submitData(challangeId, featureId, week, uid, commentText) {

        if (this.state.commentText == '') {
            alert('please fill the comment..')
        } else {
            this.setState({offSetLoader: true});
            const token_ = await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/submit-small-win-action';


            var parameters = {
                challenge_id: challangeId,
                feature_id: featureId,
                week: week,
                uid: uid,
                comment: commentText,
                type: 'c'
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

                    ///console.log("DATAAAAAAAAAAAAAAAAAAaaa", JSON.stringify(dataobject))
                        this.checkSuccessOrNot(dataobject);
                    }
                )
                .catch((error) => {
                })
        }

    }
    checkSuccessOrNot(dataObject) {
        console.log(JSON.stringify(dataObject))
        if (dataObject.status) {
           // alert('Submitted Successfully');

            this.setState({commentText: ''});
            this.setState({offSetLoader: false});

            this.getAllDew(this.state.challengeId, this.state.featureId, this.state.day, this.state.categoryId, this.state.week, this.state.uid);
            this.state.data_list.unshift(dataObject.updated_comment_obj);
            this.flatListRef.scrollToOffset(true, 10)
           // this.shiftBack();
            this.refs.toast.show(
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:'white',fontSize:12}}>Keep It Up! </Text>
                    <Emoji name="smile" style={{fontSize: 12,color:'White',backgroundColor:'transparent'}}
                    />

                </View>)

        } else {
            this.setState({offSetLoader: false});
            alert('failed')
        }
    }
    shiftBack() {
        //this.props.navigation.navigate('DashBoard');
        var obj = {'uid': this.state.uid}
        this.props.navigation.state.params.onGoBack(obj);
        this.props.navigation.goBack();
    }

    async getShareAWinList() {
        const token_ = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/get-small-win-all';
        var parameters = {
            challenge_id: this.state.challengeId,
            feature_id: this.state.featureId,
            day:  this.state.day,
            page_size: 7,
            data_offset: this.state.offSet,
            uid:  this.state.uid,
            week: this.state.week
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
                    this.setState({itemCount: dataobject.count_records});
                    this.InheritedDataFotList(dataobject);
                }
            )
            .catch((error) => {
            })
    }

    InheritedDataFotList(data) {
       // alert(JSON.stringify(data))
        if (data.status == true) {
            this.setState({offSetLoader: false});
            var list = data.small_win_all;
            this.setDataToList(list)
        }else{
            this.setState({offSetLoader: false});
            alert(data.message)
        }
    }
    setDataToList(list){
        this.setState({data_list: this.state.data_list.concat(list)})

    }
    handeLoadMoreItem = () => {
        if (this.state.itemCount != 0) {
            var offset = this.state.offSet;
            var addoffset = parseInt(offset + 7);
            this.setState({offSet: addoffset});
            this.getShareAWinList();
        }
    }

    onedit(data, index) {
        this.setState({editPost: data});
        this.setState({editIndex: index});
        this.editmodalVisible();
    }

    editmodalVisible() {
        this.setState({editModal: !this.state.editModal})
    }
    editUpdateData (dataGet) {
       // alert(JSON.stringify(dataGet))
        this.state.data_list[this.state.editIndex] = dataGet;
        this.setState({data_list: this.state.data_list});
    }
    textInputFocused() {
        this.flatListRef.scrollToOffset({animated: true, offset: 5});
    }
    renderRow(item, rowmap) {
        //console.log(dataHolder)
        return (

            <View>
                <View style={{
                    margin: 2,
                    flexDirection: 'row', marginTop: 10, paddingLeft:20,
                    paddingRight:15,
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
                                    {this.state.uid == item.uid &&
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
                <View style={{height: 0.5, marginLeft:20,marginRight:15, backgroundColor: 'rgba(54,69,79,0.35)', marginTop: 10}}></View>
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
                <Toast
                    ref="toast"
                    style={{backgroundColor: '#4AAFE3',borderRadius:90}}
                    position='top'
                    positionValue={240}
                    fadeInDuration={500}
                    fadeOutDuration={900}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
                <Modal style={{marginLeft: 10, marginRight: 10, marginTop: StatusBar.currentHeight}} transparent={true}
                       hasBackdrop = {true} isVisible={this.state.editModal} >
                    <KeyboardAvoidingView
                        enabled
                        behavior='position'
                        keyboardVerticalOffset={deviceHeight/12}>
                    <View style={{backgroundColor: '#fff', paddingBottom: 20, margin: 0}}>
                        <View style={{padding: 0}}>
                            <TouchableOpacity onPress={this.editmodalVisible}>
                                <View style={{justifyContent: 'flex-end', paddingTop: 10, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                                    <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                                </View>
                            </TouchableOpacity>
                            <Text style={{fontFamily: 'PoppinsRegular', fontSize: 17, textAlign: 'center', borderBottomWidth: 1, borderBottomColor:'lightgray', paddingBottom: 7}}>Edit Share a Win</Text>
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <ModalUpdateShareWin
                                    updateContent= {this.state.editPost}
                                    week = {this.state.week}
                                    challengeId = {this.state.challengeId}
                                    onGoBack={this.editUpdateData}
                                    onPopUp={this.editmodalVisible}
                                    nav = {this.props.nav}/>
                            </ScrollView>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </Modal>
                <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}
                                      behavior="padding" enabled keyboardVerticalOffset={0}>
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
                                          numberOfLines={1}> {this.state.hederTitle == "" ? '-' : this.state.hederTitle}
                                    </Text>
                                </View>

                            </View>
                        </ImageBackground>

                    </View>
                    {/* Ended Header View */}
                    {/*<Spinner*/}
                    {/*    visible={this.state.offSetLoader}*/}
                    {/*    textContent={''} color={'black'}/>*/}
                    {/*<ScrollView style={{paddingHorizontal: 15, backgroundColor: 'transparent'}}>*/}
                        {/*headercompo*/}
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginLeft: 0,
                            marginTop: 20,paddingHorizontal:20,
                            backgroundColor: 'transparent'
                        }}>

                            <Text style={{fontFamily: 'calibriRegular', marginLeft: 0, fontSize: 20}}
                            >{this.state.question}</Text>

                        </View>

                        <View style={styles.email_view}>
                            <TextInput
                                placeholder='Submit comment...'
                                value={this.state.commentText}
                                onFocus={this.textInputFocused.bind(this)}

                                onChangeText={(text) => this.setState({commentText: text})}
                                style={{
                                    width: "100%",
                                    paddingHorizontal: 10,
                                    textAlignVertical: 'top',
                                    backgroundColor: 'transparent',
                                    height: '100%',
                                    paddingVertical: 10
                                }}
                                numberOfLines={8}
                                multiline={true}>

                            </TextInput>
                        </View>

                        <View style={{marginTop: 25, backgroundColor: 'transparent', alignItems:'center'}}>
                            {/*<View style={{flex: 0.15}}>*/}
                            {/*</View>*/}
                            <View style={{
                                // flex: 0.51,
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                alignItems: 'center'
                            }}>
                                {!this.state.actionStatus && !this.state.commentOwn &&
                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#4AAFE3',
                                        borderWidth: 1, paddingVertical: 8,
                                        flexDirection: 'row',
                                        paddingHorizontal: 25,
                                        borderColor: 'lightgray', marginHorizontal: 0,
                                        borderRadius: 25, marginBottom: 0, marginTop: 0
                                    }}
                                    onPress={() => [this.submitData(this.state.challengeId, this.state.featureId, this.state.week, this.state.uid, this.state.commentText), Keyboard.dismiss()]}
                                >
                                    {this.state.radioImageFirst &&
                                    <Image source={checkyellow}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>
                                    }
                                    {!this.state.radioImageFirst &&
                                    <Image source={checkgray}
                                           style={{width: 18, height: 18, marginLeft: 0, marginTop: 0}}>
                                    </Image>
                                    }

                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: 'white',
                                            marginLeft: 7,
                                            fontFamily: 'PoppinsSemiBold',
                                            paddingVertical: 0
                                        }}>
                                        {"Submit " + this.state.buttonHint + " Points"}</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={{flex: 1, paddingHorizontal: 0, backgroundColor: 'transparent',marginTop:15}}>
                        <FlatList
                            ref={(ref) => {
                                this.flatListRef = ref;
                            }}
                            style={styles.flatlist}
                            showsVerticalScrollIndicator={false}
                            data={this.state.data_list}
                            //ListHeaderComponent={this.headerComponent}
                            ListFooterComponent={this.footerComponent}
                            onEndReached={this.handeLoadMoreItem}
                            onEndReachedThreshold={0.25}
                            ListEmptyComponent={this.renderEmptyContainer}
                            pagingEnabled={false}
                            extraData={this.state}
                            renderItem={({item, index}) => this.renderRow(item, index)}
                            keyExtractor={(item, index) => index.toString()}/>
                        </View>




                    {/*</ScrollView>*/}
                </KeyboardAvoidingView>



                {/*<View style={{backgroundColor:'red',flex:1}}></View>*/}
            </View>

        );

    }

}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
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
        height: 110, alignItems: 'flex-start',

        marginHorizontal:15,
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
        marginTop: 32, borderRadius: 5,
        alignItems: 'center',
        height: 45,
        backgroundColor: "black",
        width: '50%',
        justifyContent: 'center'
    },
    flatlist: {
        flex: 1, backgroundColor: 'white'
        , paddingHorizontal: 0, paddingVertical: 0
    },
});
