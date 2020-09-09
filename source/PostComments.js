import React, {Component, useReducer} from 'react';
import {Alert, FlatList, Image, ImageBackground, StyleSheet, 
    Text, TouchableOpacity,ActivityIndicator, ScrollView,View, 
    
 Animated} from 'react-native';
import * as SecureStore from 'expo-secure-store';
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
const hands = require('../../images/hand.png');
const flag = require('../../images/flag.png');
const comment = require('../../images/comment.png');

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
            data_list: [],
            checked:true,
            listViewData: Array(2)
                .fill('')
                .map((_, i) => ({key: `${i}`, text: `item #${i}`})),
           
                accessToken:'',
                challengeId:'',
                featureId:'',
                offSet:0,
                offSetLoader:false,
                Alldata:{},
                


        }
        this.renderRow = this.renderRow.bind(this);

        this.rowSwipeAnimatedValues = {};
        this.state.data_list.fill('')
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

        //this.setData(this.props.navigation.state.params.DATA);
        //alert(JSON.stringify(this.props));
        this.setState({Alldata:this.props.navigation.state.params.DATA});
        this.getDataObject(this.props.navigation.state.params.DATA);

    }




    
    getDataObject(dataObject){

    
    //this.setState({offSetLoader:true});
      this.setState({challengeId:dataObject.challenge_id});
      this.setState({featureId:dataObject.feature_id});
    //  alert(dataObject.feature_id)


    setTimeout(()=>{

        if (this.state.challengeId != undefined){
            this.setState({offSetLoader:true});
            this.getDailyInspirationApiData(this.state.challengeId,this.state.featureId);
        }
        
    },1000);

 

    }




    async getDailyInspirationApiData(challangeId,featureId) {

        const token_  =await SecureStore.getItemAsync('token');
       const url = global.base_url_live+'v1/api/get-shout-all';
 // alert(token_)
       var parameters = {
           token: JSON.parse(token_),
           challenge_id:challangeId,
           feature_id:featureId,
           page_size:6,
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
                    //alert(JSON.stringify(responseText))
                   //this.setState = ({data_list: dataobject})
                   // Alert.alert('injoy' ,JSON.stringify(dataobject),[{text: 'Ok', onPress: () => this.setState({showloader: false})}])



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


     async  onHighfivePressed(linkedFeatureId,uid){
         //alert(linkedFeatureId)
       // this.rowSwipeAnimatedValues  = new Animated.Value(0);
    //    this.state.data_list
    //    .forEach((_, i) => {
    //        this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    //    });
       
        const token_  = await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/app-insert-high-five';
        
//         "type" : "l",
//   "uid" : 140,
//   "linked_feature_id" : 4,
//   "challenge_id" : 41,
//   "feature_id" : 2
    




       var parameters = {
          // token: JSON.parse(token_),
           challenge_id:this.state.challengeId,
           feature_id:this.state.featureId,
           type : "l",
           linked_feature_id:linkedFeatureId,
           uid:uid  
        };
       var token = `Bearer ${JSON.parse(token_)}`;
        // alert(JSON.stringify(parameters));
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
                //  alert(responseText)
                  // console.log(responseText)
                //   if(dataobject.count_records == 0){
                //    //  alert('countis xoe')
                //       this.setState({offSetLoader:false});
                //   }
                
                //   this.InheritedData(dataobject);


              if(dataobject.status){
               
               // this.rowSwipeAnimatedValues  = new Animated.Value(0);
               alert("Highfive is successfull");
              
               
            }
            }
           )
           .catch((error) => {
          })
   
   
   
   
   
   
   
   
        
        

  }

  handeLoadMoreItem = () =>{

    this.setState({offSet:this.state.offSet+6});
    this.getDailyInspirationApiData(this.state.challengeId,this.state.featureId)

}

    footerComponent = () =>{
        // const data = this.state.offSetLoader;

        if(this.state.offSetLoader){
            return(
                <View style={styles.loader}>
                    <ActivityIndicator size="small"/>
                </View>
            )
        }
        return (<View style={{height:10}}></View>);



    }
 
  
   renderHiddenItems(data ,rowMap){
       console.log(data);
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

     renderRow( dataHolder,rowmap,index){
   //console.log(dataHolder)
            return(

                <View style={{margin:2,
                                
                    flexDirection: 'row',marginTop:13,
                    height:70,backgroundColor:'white',elevation: 3,
                    shadowColor: "gray",
                    shadowOpacity: 0.8,borderRadius:4,
                    shadowRadius: 2,padding:3,
                    shadowOffset: {
                        height: 1,
                        width: 1
                    }

                }}>


                
                      
                    <View style={{flex:1,backgroundColor:'transparent',flexDirection:'row',alignItems:'center'}}>
                        <Image source={{uri:dataHolder.item.user_details.profile_pic}} style={{height:50, width:50, marginLeft:6,borderRadius:50/2}}/>
                        <View style={{backgroundColor:"transparent",flex:1, height:'100%', marginLeft:12,marginRight:10,marginTop:5,padding:1}}>

                            <View style={{backgroundColor:'transparent',height:30,alignItems:"center",flexDirection:'row',justifyContent:'space-between'}}>
                                        <Text style={{fontFamily:'PoppinsBold'}} >{dataHolder.item.user_details.name}</Text>
                                <Text style={{fontFamily:'PoppinsRegular',color:'gray',fontSize:10}} >{dataHolder.item.shout_out.time}</Text>
                            </View>
                            <View style={{flex:1,height:'100%',backgroundColor:'transparent',padding:3}}>
            <Text  style={{fontSize:12,fontFamily:'PoppinsSemiBold',color:'gray',marginTop:-3}} numberOfLines={1}>{dataHolder.item.shout_out.comment}</Text>
                            </View>

                        </View>

                    </View>
              
                </View>
           

          
          
          )
        
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



                     <TouchableOpacity style={{borderWidth:1.5,backgroundColor:'black',
                     marginHorizontal:15,height:45,marginTop:10,alignItems:'center',
                     justifyContent:'center',borderRadius:2}}
                     onPress={()=>this.props.navigation.navigate('DoComment',{DATA:this.state.Alldata})}
                     >
                            <Text style={{marginLeft:10,fontFamily:'PoppinsBold',fontSize:11,color:'white'}}>POST YOUR COMMENT</Text>
                     </TouchableOpacity>                         

                    <SwipeListView
                        style={{flex: 1, marginTop: 10,backgroundColor:'transparent',paddingHorizontal:15}}
                        data={this.state.data_list}
                        renderItem={(data, rowMap) => this.renderRow(data, rowMap)}
                        renderHiddenItem={(data, rowMap) =>(
                          //  console.log("HIDDENITEM",data.item.shout_out.id),
                            <View style={styles.rowBack}>
                               {/* <Text>Left</Text>*/}
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnLeft,styles.column]}
                                    onPress={() => this.onHighfivePressed(data.item.shout_out.id,data.item.user_details.uid)}

                                >
                                    <Image source={hands} style={styles.hiddenImages}>
                                    </Image>
                                    <Text style={styles.backTextWhite}>High 5s</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.backRightBtn222, styles.backRightBtnRight,styles.column]}
                                    onPress={() => alert('Comment')}
                                >
                                    <Image source={comment} style={styles.hiddenImages}>
                                    </Image>
                                    <Text style={styles.backTextWhite}>Comment</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.backRightBtn222, styles.backRightBtnRightnew,styles.column]}
                                    onPress={() => alert('Flag')}
                                >
                                    <Image source={flag} style={styles.hiddenImages}>
                                    </Image>
                                    <Text style={styles.backTextWhite}>Flag</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        leftOpenValue={0}
                        stopLeftSwipe={true}
                      /*  disableRightSwipe={true}*/
                        rightOpenValue={-210}
                        previewRowKey={'0'}
                        previewOpenValue={1}
                        previewOpenDelay={2000}
                        friction={50}
                        swipeToOpenPercent={1}
                        swipeToOpenVelocityContribution={1}
                        swipeToClosePercent={1}
                        onRowDidOpen={this.onRowDidOpen()}
                        onEndReached={this.handeLoadMoreItem}
                        onEndReachedThreshold={0}
                        ListFooterComponent={this.footerComponent}
                    />

              

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