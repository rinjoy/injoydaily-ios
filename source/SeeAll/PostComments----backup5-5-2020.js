import React, {Component, useReducer} from 'react';
import {Alert, FlatList, Image, ImageBackground, StyleSheet,
    Text, TouchableOpacity,ActivityIndicator, ScrollView,View,

 Animated} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Loader from './../loader/Loader';
//import { RadioButton } from 'react-native-paper';
const headerback = require('../../images/image-8.png');
const menuImg = require('../../assets/menu.png');
const tickets = require('../../assets/downarrow.png');
const downarrow = require('../../assets/downarrow.png');
const gallaryblack = require('../../assets/gallaryblack.png');
const nextgray = require('../../assets/nextgray.png');
const backarrow = require('../../assets/backarrow.png');
const profile = require('../../images/image-9.png');
const dagger = require('../../images/dager.png');
const unlike = require('../../images/unlike.png');
const like = require('../../images/like.png');
const flags = require('../../images/flag.png');
const comments = require('../../images/comment.png');
const commentblue = require('../../images/commentblue.png');
const messageopenblack = require('../../assets/messageopenblack.png');

const image12 = require('../../images/image-12.png');
const userImage = require('../../images/image-11.png');
const image14 = require('../../images/image-14.png');
const image16 = require('../../images/image-16.png');
const sahre = require('../../assets/sahre.png');
const listimg = require('../../images/image-18.png');
const checkblue = require('../../assets/checkblue.png');
import { SwipeListView } from 'react-native-swipe-list-view';
const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class PostComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data_list: [].fill('')
            .map((_, i) => ({key: `${i}`, text: `item #${i}`}))
            ,

            checked:true,

            listViewData: Array(2)
                .fill('')
                .map((_, i) => ({key: `${i}`, text: `item #${i}`})),

                accessToken:'',
                challengeId:'',
                itemCount: 0,
                featureId:'',
                offSet:0,offSetLoader:false,Alldata:{},

        }
        this.renderRow = this.renderRow.bind(this);
        this.messageDetails = this.messageDetails.bind(this);

        this.rowSwipeAnimatedValues = {};
        Array(20)
            .fill('')
            .forEach((_, i) => {
                this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
            });
    }


    componentDidMount() {
        getAccessToken().then(token =>
            this.setState({accessToken:token}),
        );

        getUserId().then(id =>
            this.setState({id: id}),
        );
        this.setState({Alldata:this.props.navigation.state.params.DATA});
        this.getDataObject(this.props.navigation.state.params.DATA);

    }

componentWillReceiveProps(nextProps) {
  if(nextProps.navigation.state.params.DATA !== undefined) {
    this.setState({offSetLoader:true});
     this.setState({data_list:[]});
     this.setState({offSet:0});
    this.getDataObject(nextProps.navigation.state.params.DATA);
  }

  if(nextProps.navigation.state.params.comment_count !== undefined) {

  }
}






    getDataObject(dataObject){

    //this.setState({offSetLoader:true});
      this.setState({challengeId:dataObject.challenge_id});
      this.setState({featureId:dataObject.feature_id});
    //  alert(dataObject.feature_id)


    setTimeout(()=>{

        if (this.state.challengeId != undefined){

            this.getDailyInspirationApiData(this.state.challengeId,this.state.featureId);
        }

    },1000);
    }



    async getDailyInspirationApiData(challangeId,featureId) {

this.setState({offSetLoader:true});

        const token_  =await SecureStore.getItemAsync('token');
       const url = global.base_url_live+'v1/api/get-shout-all';
 // alert(token_)
       var parameters = {
           token: JSON.parse(token_),
           challenge_id:challangeId,
           feature_id:featureId,
           page_size:10,
           data_offset:this.state.offSet
       };
       var token = `Bearer ${JSON.parse(token_)}`;
  //   alert(JSON.stringify(parameters));
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
                   console.log('FULL Data', dataobject);
                    //alert(JSON.stringify(responseText))
                   //this.setState = ({data_list: dataobject})
                   // Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])
                   this.setState({offSetLoader:false});
                   this.setState({itemCount: dataobject.count_records});

                   if(dataobject.count_records == 0){
                    ///  alert('countis xoe')
                      this.setState({offSetLoader:false});
                  }


                this.InheritedData(dataobject);


               }
           )
           .catch((error) => {
           })
   }


   setDataList(text) {
     //  alert(text)

    this.setState({data_list:this.state.data_list.concat(text)});

}


   InheritedData(data) {

       if (data.status == true) {
          //this.setState({offSetLoader:false});
          this.setDataList(data.shout_out_all.shout_out_category.high_five);
      }
  }

  handeLoadMoreItem = () =>{
    if(this.state.itemCount !== 0) {
    var offset = this.state.offSet;
    var addoffset = parseInt(offset+10);
    this.setState({offSet:addoffset});
    this.getDailyInspirationApiData(this.state.challengeId,this.state.featureId)
  }
}

    footerComponent = () =>{
        // const data = this.state.offSetLoader;

        if(this.state.offSetLoader){
            return(
                <Loader loaderVal = {this.state.offSetLoader} />
            )
        }
        return (<View style={{height:10}}></View>);



    }


   renderHiddenItems(data ,rowMap){
       <View style={styles.rowBack}>
           <TouchableOpacity
               style={[
                   styles.backRightBtn,
                   styles.backRightBtnRight,
               ]}
               onPress={() =>
                   this.deleteRow(rowMap, data.item.key)
               }
           >
               <Animated.View
                   style={[
                       styles.trash,
                       {
                           transform: [
                               {
                                   scale: this.rowSwipeAnimatedValues[
                                       data.item.key
                                       ].interpolate({
                                       inputRange: [
                                           45,
                                           90,
                                       ],
                                       outputRange: [0, 1],
                                       extrapolate:
                                           'clamp',
                                   }),
                               },
                           ],
                       },
                   ]}
               >
                   <Image
                       source={hands}
                       style={styles.trash}
                   />
               </Animated.View>
           </TouchableOpacity>
       </View>
   }

   messageDetails(data) {
     this.props.navigation.navigate('AddReply', {'DATA': data, 'featureID': this.state.featureId, 'challengeID': this.state.challengeId});
   }

   async messageHighFive(data) {

     this.setState({offSetLoader:true});

             const token_  =await SecureStore.getItemAsync('token');
            const url = global.base_url_live+'v1/api/app-insert-high-five';
      // alert(token_)
            var parameters = {
                token: JSON.parse(token_),
                type: 'l',
                uid: data.item.user_details.uid,
                linked_feature_id: data.item.shout_out.id,
                challenge_id: this.state.challengeId,
                feature_id: this.state.featureId,
            };
            var token = `Bearer ${JSON.parse(token_)}`;
       //   alert(JSON.stringify(parameters));
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
                        this.setState({data_list: []})
                        this.getDailyInspirationApiData(this.state.challengeId,this.state.featureId)
                    }
                )
                .catch((error) => {
                })
   }

     renderRow( dataHolder,rowmap,index){
     // console.log(dataHolder)
            return(


                <View style={{
                    flexDirection: 'row',
                    marginTop:13,
                    backgroundColor:'white',
                    //elevation: 3,
                    //shadowColor: "gray",
                    //shadowOpacity: 0.8,
                    borderBottomWidth: 0.3,
                    borderBottomColor: '#CACACA',
                    //borderRadius:4,
                    //shadowRadius: 2,
                    paddingHorizontal:15,
                    paddingVertical:10,
                    // shadowOffset: {
                    //     height: 1,
                    //     width: 1
                    // }

                }}>




                    <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row',alignItems:'flex-start'}}>
                        <Image source={{uri:dataHolder.item.user_details.profile_pic}} style={{height:50, marginTop: 0, width:50, borderRadius:50/2}}/>
                        <View style={{backgroundColor:"transparent",flex:1, marginLeft:10, marginTop:0,padding:1}}>

                        <TouchableOpacity onPress={() => this.messageDetails(dataHolder)}>
                            <View style={{backgroundColor:'transparent',alignItems:"center",flexDirection:'row',justifyContent:'space-between'}}>
                                        <Text style={{fontFamily:'PoppinsBold'}} >{dataHolder.item.user_details.name}</Text>
                                <Text style={{fontFamily:'PoppinsRegular',color:'gray',fontSize:10}} >{dataHolder.item.shout_out.time}</Text>
                            </View>
                            <View style={{flex:1,height:'100%',backgroundColor:'transparent',paddingTop:2}}>
                                        <Text  style={{fontSize:12,fontFamily:'PoppinsSemiBold',color:'gray',marginTop:-3}} numberOfLines={3}>{dataHolder.item.shout_out.comment}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 4, alignItems: 'center', backgroundColor: 'transparent'}}>

                        {dataHolder.item.shout_out.shout_image !== '' &&
                          <View style={{marginTop: 0, flex: 0.6}}>
                            <Image source={{uri:dataHolder.item.shout_out.shout_image}} style={{height:60, width:60, borderRadius:5}}/>
                          </View>
                        }
                        {dataHolder.item.shout_out.shout_image == '' &&
                          <View style={{flex: 0.6}}>
                          </View>
                        }
                        <View style={{marginTop: 0, flex: 0.4, justifyContent: 'center', alignItems: 'flex-end'}}>
                                <View style={{
                                  flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 0
                                }}>

                                    <View style={{flex: 0.33}}>
                                    { dataHolder.item.shout_out.if_you_high_fived &&
                                        <View style={{alignItems: 'center'}}>
                                              <Image source={like} style={{width: 28, height: 28}}>
                                              </Image>
                                              <Text style={{
                                                  fontSize: 10, marginTop: 2, fontFamily: 'PoppinsMedium',
                                              }}>{dataHolder.item.shout_out.total_high_fives}</Text>
                                          </View>
                                    }
                                    {!dataHolder.item.shout_out.if_you_high_fived &&
                                      <TouchableOpacity onPress={() => this.messageHighFive(dataHolder)}>
                                          <View style={{alignItems: 'center'}}>
                                              <Image source={unlike} style={{width: 28, height: 28}}>
                                              </Image>
                                              <Text style={{
                                                  fontSize: 10, marginTop: 2, fontFamily: 'PoppinsMedium',
                                              }}>{dataHolder.item.shout_out.total_high_fives}</Text>
                                              </View>
                                        </TouchableOpacity>
                                    }
                                    </View>


                                <View style={{flex: 0.33, alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => this.messageDetails(dataHolder)}>
                                    <View style={{alignItems: 'center'}}>
                                        <Image source={comments}
                                               style={{width: 28, height: 28 }}>
                                        </Image>
                                        <Text
                                            style={{marginTop: 2, fontSize: 10, fontFamily: 'PoppinsMedium'}}>{dataHolder.item.shout_out.total_replies}</Text>
                                     </View>
                                  </TouchableOpacity>
                                </View>

                                <View style={{alignItems: 'center', flex: 0.33}}>
                                      <Image source={flags}
                                           style={{width: 28, height: 28}}>
                                      </Image>
                                      <Text
                                      style={{marginTop: 2, fontSize: 10, fontFamily: 'PoppinsMedium'}}>0</Text>
                                  </View>
                                </View>
                        </View>

                        </View>

                        </View>

                    </View>

                </View>




          )

    }

    render() {

        return (
            <View style={styles.container}>
            {this.state.offSetLoader &&
              <Loader loaderVal = {this.state.offSetLoader} />
            }
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
                                marginLeft: 0,
                                alignContent: 'center',
                                justifyContent: 'center',backgroundColor:'transparent',
                                flex:1
                            }}>
                                <Text style={{fontFamily: 'PoppinsBold', fontSize: 18}}>Shout outs & digital high 5s
                                </Text>

                            </View>

                            <TouchableOpacity onPress={()=>alert("In Progress")}>
                                <Image source={dagger}  style={styles.menuSEC}>
                                </Image>
                            </TouchableOpacity>

                        </View>
                    </ImageBackground>

                </View>
                {/* Ended Header View */}



                                        {/* {this.state.offSetLoader &&

                                            <View style={styles.loader}>
                                                <ActivityIndicator size="large"/>
                                            </View>


                                        } */}


                    {!this.state.offSetLoader &&
                         <TouchableOpacity style={{borderWidth:1.5,backgroundColor:'black',
                         marginHorizontal:15,height:45,marginTop:10,alignItems:'center',
                         justifyContent:'center',borderRadius:2}}
                         onPress={()=>this.props.navigation.navigate('DoComment',{DATA:this.state.Alldata})}
                         >
                         <Text style={{fontFamily:'PoppinsBold',fontSize:11,color:'white'}}>POST YOUR COMMENT</Text>
                         </TouchableOpacity>
                     }

                    {this.state.data_list.length !== 0 &&
                      <FlatList
                          style={{flex: 1, marginTop: 10,backgroundColor:'transparent',paddingHorizontal:0}}
                          data={this.state.data_list}
                          renderItem={(data, rowMap) => this.renderRow(data, rowMap)}
                          onEndReached={this.handeLoadMoreItem}
                          onEndReachedThreshold={0.2}
                          ListFooterComponent={this.footerComponent}
                      />
                    }
                    {(this.state.data_list.length == 0 && !this.state.offSetLoader) &&
                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: 'PoppinsLight'}}>no shout out available now.</Text>
                      </View>
                    }




            </View>
        );


    }



    onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    onCheckBoxPressed(){

        if(this.state.checked){
            this.setState({checked:false})
        }else {
            this.setState({checked:true})
        }
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    header_view: {
        height: 90,

    },
    backTextWhite: {
        color: '#FFF',fontSize:10,fontFamily:'PoppinsSemiBold'
    },
    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:'transparent',
        marginTop: 35,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,borderBottomLeftRadius:5,borderTopLeftRadius:5
    },
    backRightBtn222: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 65,
    },
    column:{
      flexDirection:'column',justifyContent:'center',alignItems:'center'
    },
    trash: {
        height: 65,
        width: 65,backgroundColor:'yellow'
    },

    backRightBtnLeft: {
        backgroundColor: '#fcce85',
        right: 130,
    },

    backRightBtnRight: {
        backgroundColor: '#5cc9bd',
        right: 70,
    }, backRightBtnRightnew: {
        backgroundColor: '#eb6c63',
        right: 5,
    },
    header_image: {
        flex: 1,
        height: 90
    },
    rowBack: {
        marginTop:13,marginBottom: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',


    },

    menu: {
        width: 23,
        height: 16,
        marginLeft: 15,


    },hiddenImages:{
        width:18,
        height: 18,
    },
    menuSEC:{
        width: 5,
        height: 18,marginRight:15

    },
    login_button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,flexDirection:'row',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,marginBottom:5,marginTop:20
    },


    profile: {
        width: 60,
        height: 60,
    },

    name_view: {

        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        height: 50,
        width: '92%',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1
    },

    email_view: {

        flexDirection: 'row',
        alignItems: 'center',

        height: 50,
        width: '92%',
        marginHorizontal: 15,
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
    loader:{
        marginTop:5,alignItems:'center',height:60,
    }
});
