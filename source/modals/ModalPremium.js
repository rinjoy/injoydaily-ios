import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    FlatList,
    Image,
    ScrollView,
    Button,
    ImageBackground,
    RefreshControl,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, StatusBar, TextInput
} from 'react-native';

import Modal from 'react-native-modal';
import SideMenu from 'react-native-side-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';

import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

const crossarrow = require('./../../images/close.png');
const backg = require('./../../images/bg_popup.png');
const unlock = require('./../../images/sun_animation.gif');
const star = require('./../../images/checkorange1.png');

const apiUrl = global.base_url_live+'v1/api/get-current-user-basic-and-active-challenge-details-temp';
const checkyellow = require('./../../images/checkyellow.png');
const nextarrow = require('./../../assets/nextarrow.png');


console.disableYellowBox = true;
const HEADER_MAX_HEIGHT = 125;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 92 : 92;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;
const itemSkus = Platform.select({
ios: [
  '08112020',
  '08102020',
],
});

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

export default class ModalPremium extends Component {
purchaseUpdateSubscription = null
purchaseErrorSubscription = null

    constructor(props) {
        super(props);


        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            navig: this.props.nav,
            premiumModal: false,
            accessToken: '',
            UID: 0,
            purchase: false,
            receipt: '',
            coupanStatus: false,
            coupanCode: '',
            selectType: '',
            setModalVisible: false,
            productList:[],
            monthly: false,
            showloader: true,
            annually: true,
        };
          this.toggleModal = this.toggleModal.bind(this);
          this.toggleModalClose = this.toggleModalClose.bind(this);
          this.premium = this.premium.bind(this);
          this.handlePayment = this.handlePayment.bind(this);
          this.requestPurchase = this.requestPurchase.bind(this);
    }

    async componentDidMount() {
      RNIap.clearTransactionIOS()
      RNIap.clearProductsIOS()
      getUserId().then(id =>
          this.setState({UID: id}),
      );
      this.getAccessToken();
    }

    goNext = (): void => {
    //Alert.alert('Receipt', this.state.receipt);
  };

    componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    RNIap.clearProductsIOS()
    RNIap.endConnection();
  }

    async getAccessToken() {
        var token = await SecureStore.getItemAsync('token');
        this.setState({accessToken: JSON.parse(token)});
        // console.log('accessTokenmm', this.state.accessToken);
        if (this.state.accessToken = !'') {
          this.getCodeStatus();
          this.iapConfig();
        }
    }

    async getCodeStatus() {
        const token_  =await SecureStore.getItemAsync('token');
        const url = global.base_url_live+'v1/api/coupon-test';

        var token = `Bearer ${JSON.parse(token_)}`;

        var parameters = {
        };

        fetch(url,
            {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                }),body: JSON.stringify(parameters),
            })
            .then(async (response) => response.text())
            .then(async (responseText) => {
                    //this.setState({showloader:false});
                    var dataobject = JSON.parse(responseText);
                    if(dataobject.status) {
                        this.setState({coupanStatus: dataobject.value});
                          // alert(dataobject.value);
                    }
                }
            )
            .catch((error) => {
                alert(' Exception causes' + error);
                this.props.closeModal();
            })
    }


    async iapConfig() {

      try {
      const result = await RNIap.initConnection();
       // await RNIap.consumeAllItemsAndroid();
        console.log('result', result);
      } catch (err) {
        console.warn(err.code, err.message);
      }

      try {
      const products: Product[] = await RNIap.getProducts(itemSkus);
      console.log('ProductsGenerated', products);
      this.setState({productList: products});
      this.setState({showloader: false});
       //console.log('products', products);
      // this.requestPurchase(products[0].productId);
      } catch(err) {
        alert(err.message); // standardized err.code and err.message available
        this.setState({showloader: false});
      }

      this.purchaseUpdateSubscription = purchaseUpdatedListener(
     async (purchase: InAppPurchase | SubscriptionPurchase) => {
       const receipt = purchase.transactionReceipt;
       if (receipt) {
         try {
           if(this.state.purchase){
             this.update_db(purchase);
           }
         } catch (ackErr) {
           console.warn('ackErr', ackErr);
         }

         this.setState({receipt}, () => this.goNext());
       }
     },
   );

   this.purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.warn('purchaseErrorListener', error);
    });

    }

    async update_db(data) {

      //this.setState({showloader:true});
      const token_  =await SecureStore.getItemAsync('token');
      const url = global.base_url_live+'v1/api/app-stripe-payment-transaction';
      if(data.productId == '08112020'){
        var type = 'm';
      }
      else{
        var type = 'a';
      }
      var token = `Bearer ${JSON.parse(token_)}`;

      var parameters = {
          token_id: data.transactionId,
          client_created_at: data.transactionDate,
          plan_type: type,
          uid:this.state.UID,
          payment_receipt: data.transactionReceipt,
      };

      //console.log('parametersparametersparametersparameters', parameters);

      fetch(url,
          {
              method: 'POST',
              headers: new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': token,
              }),body: JSON.stringify(parameters),
          })
          .then(async (response) => response.text())
          .then(async (responseText) => {
                  //this.setState({showloader:false});
                  console.log('rererererrerererrere',responseText);
                  var dataobject = JSON.parse(responseText);
                  if(dataobject.status) {
                    Alert.alert(
                         'Payment Message',
                         dataobject.userMsg,
                         [
                             {text: 'OK', onPress: () => {
                                 this.props.nav.navigate('DashBoard');
                             }},
                         ]
                    );
                    this.props._handelePaymentUpdate();
                    this.props.closeModal();


                  }
              }
          )
          .catch((error) => {
              alert(' Exception causes' + error);
              this.props.closeModal();
          })
    }

    premium() {
      this.setState({premiumModal: !this.state.premiumModal})
    }

    switchAnnually() {
      this.setState({annually: !this.state.annually})
      this.setState({monthly: !this.state.monthly})
    }

    switchMonthly() {
      this.setState({annually: !this.state.annually})
      this.setState({monthly: !this.state.monthly})
    }

        handlePayment() {
        this.props.closeModal()
        this.props.nav.navigate('Payment');
    }

    requestPurchase = async (sku: string) => {
    //  alert('Here123');

      this.setState({purchase: true});
      try {
        const response = await RNIap.requestPurchase(sku, false);
        // if(response.transactionReceipt !== ''){
        //   alert('Item already purchased.');
        // }
        console.log('response123', response);
      } catch (err) {
        alert(err.message);
      }
    }

    toggleModal(type) {
        this.setState({selectType: type});
        this.setState({setModalVisible: !this.state.setModalVisible});
    }

    toggleModalClose() {
        this.setState({setModalVisible: false});
    }

    async applyCode() {
        if(this.state.coupanCode == '') {
            alert('Please enter coupan code.');
            return false;
        }


        this.setState({showloader: true})


        const url = global.base_url_live+'v1/api/avail-coupon-plan'

        var token = await SecureStore.getItemAsync('token');


        var parameters = {
            uid : this.state.UID,
            coupon_code : this.state.coupanCode,
            plan_type: this.state.selectType
        };

        //console.log('parameters', parameters);

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

                    if (dataobject.status) {
                        this.setState({showloader: false})
                        this.setState({setModalVisible: false});
                        Alert.alert(
                            'Success',
                            'Coupan Applied',
                            [
                                {text: 'OK', onPress: () => {
                                        this.props.nav.navigate('DashBoard');
                                    }},
                            ]
                        );
                        this.props._handelePaymentUpdate();
                        this.props.closeModal();
                    } else {
                        Alert.alert('Injoy', dataobject.userMsg, [{
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

    render() {
      if(this.state.productList.length !== 0) {
        var annualProdId = this.state.productList[0].productId;
        var monthProdId = this.state.productList[1].productId;
         var top = 80;
        return (
          <View>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
          <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>
              <View style={{flex: 1}}>

                  <Modal isVisible={this.state.setModalVisible}>
                      <View style={{flex: 1, marginTop: top}}>
                          <View style={{backgroundColor: '#fff'}}>
                              <TouchableOpacity
                                  style={{zIndex:99,backgroundColor:'transparent', width: 20, height: 25,left:-15,right:0,bottom:0,top:30,alignItems:'center',alignSelf:'flex-end'}}
                                  onPress={this.toggleModalClose}>
                                  <View style={{justifyContent: 'flex-end', paddingTop: 0, paddingRight: 15, backgroundColor: 'transparent', alignItems: 'flex-end'}}>
                                      <Image source={crossarrow} style={{width: 12, height: 12, marginLeft: 0}}/>
                                  </View>
                              </TouchableOpacity>

                              <View style={{justifyContent: 'center', marginHorizontal: 25, borderBottomColor: 'lightgray', borderBottomWidth: 1, alignItems: 'center', marginTop:20}}>
                                  <Text style={{fontSize: 22, fontFamily: 'PoppinsBold', marginBottom: 15}}>Apply Coupan</Text>
                              </View>
                              <View style={{marginHorizontal: 25, paddingVertical: 20}}>
                                  <View style={{marginTop: 15}}>

                                      <TextInput style={{
                                          height: 40, paddingHorizontal: 5, width: '100%', marginBottom: 5,
                                          borderColor: 'black', borderWidth: 0.5
                                      }} placeholder='Apply Coupan Code'
                                                 value={this.state.coupanCode}
                                                 onChangeText={(text) => this.setState({coupanCode: text})}>
                                      </TextInput>


                                   <View style={{alignItems: 'center',
                                       justifyContent: 'center', alignSelf:'center'}}>

                                       <View style={{marginTop:30, marginBottom: 20, alignSelf: 'flex-start'}}>
                                           <TouchableOpacity
                                               style={{
                                                   alignItems: 'center',
                                                   justifyContent: 'center',
                                                   backgroundColor: '#4AAFE3',
                                                   borderWidth: 1, paddingVertical: 8,
                                                   flexDirection: 'row',
                                                   paddingHorizontal: 40,
                                                   borderColor: 'lightgray', marginHorizontal: 0,
                                                   borderRadius: 25, marginBottom: 0, marginTop: 0
                                               }}
                                               onPress={() =>
                                                   this.applyCode()}
                                           >
                                               <Text
                                                   style={{
                                                       fontSize: 13,
                                                       color: 'white',
                                                       marginLeft: 7,
                                                       fontFamily: 'PoppinsSemiBold',
                                                       paddingVertical: 0
                                                   }}>
                                                   Apply</Text>

                                           </TouchableOpacity>
                                       </View>

                                   </View>

                                  </View>

                              </View>
                          </View>
                      </View>
                  </Modal>
              </View>
          {this.state.monthly &&
            <View style={{padding: 15}}>
            <View style={{marginTop: 0, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 21, fontFamily:'PoppinsBold'}}>Unlock Premium</Text>
              <Image source={unlock} style={{width: 200, height: 170, marginTop: 0}}/>
                <Text style={{fontSize: 16, marginTop: 5, fontFamily:'PoppinsBold', textAlign: 'center'}}>Auto Renewal Plan for 30 days</Text>
              <Text style={{fontSize: 16, marginTop: 5, fontFamily:'PoppinsBold'}}>Start Injoy Premium today!</Text>
            </View>
            </View>


            <View style={{height: 25}}>
            </View>
            <View style={{marginLeft: 20, backgroundColor: 'transparent', marginRight: 30, justifyContent: 'center'}}>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Join our global community living in joy.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Exclusive library of 100+ videos and micro-coaching pieces</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Life-changing tools to track your personal progress.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>A personal journal to record your gratitudes, wins and more.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Earn points. Win prizes.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <TouchableOpacity style={styles.facebook_button} onPress={() => this.requestPurchase(monthProdId)}>
              <View style={{marginTop: 10, justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center'}}>
                <View style={{borderColor: '#F7D100', borderWidth: 1, borderRadius: 30, paddingVertical: 6, paddingHorizontal: '10%', backgroundColor: '#F7D100'}}>
                <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 16}}>Subscribe for $2.99/month</Text></View>
              </View>
              </TouchableOpacity>


                {this.state.coupanStatus &&
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.toggleModal('m')}>
                        <View style={{
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottomColor: 'lightgray',
                            borderBottomWidth: 1
                        }}>
                            <Text style={{
                                fontFamily: 'PoppinsSemiBold',
                                borderBottomColor: 'black',
                                fontSize: 15,
                                color: 'gray'
                            }}>Apply coupan</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                }

              <View style={{marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 15}}>Cancel anytime.</Text>
              </View>

              <View style={{justifyContent: 'center', backgroundColor: 'transparent', marginTop: 12, alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this.switchAnnually()}>
                    <View style={{backgroundColor: 'transparent', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                    <Text style={{textAlign: 'center', marginBottom: -2, fontFamily: 'PoppinsSemiBold', fontSize: 16, color: 'gray'}}>Switch to annual plan</Text>
                    </View>
                </TouchableOpacity>
              </View>

            </View>
            </View>
          }

          {this.state.annually &&
            <View style={{padding: 15}}>
            <View style={{marginTop: 0, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 21, fontFamily:'PoppinsBold'}}>Unlock Premium</Text>
                <Image source={unlock} style={{width: 200, height: 170, marginTop: 0}}/>
                <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    <Text style={{fontSize: 16, marginTop: 5, fontFamily:'PoppinsBold', textAlign: 'left'}}>Start 7-Day Free trial, then 29.99/year.</Text>
                    <Text style={{fontSize: 16, marginTop: 5, fontFamily:'PoppinsBold', textAlign: 'left'}}>Cancel anytime.</Text>
                </View>

            </View>
            </View>
            <View style={{height: 25}}>
            </View>
            <View style={{marginLeft: 20, backgroundColor: 'transparent', marginRight: 30, justifyCojustifyContentntent: 'center'}}>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Join our global community living in joy.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Exclusive library of 100+ videos and micro-coaching pieces</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Life-changing tools to track your personal progress.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>A personal journal to record your gratitudes, wins and more.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                <Image source={star} style={{width: 15, height: 15, marginRight: 8, marginTop: 2}}/>
                <Text style={{fontFamily: 'PoppinsMedium', fontSize: 12}}>Earn points. Win prizes.</Text>
              </View>
              <View  style={{height: 10}}>
              </View>

              <TouchableOpacity style={styles.facebook_button} onPress={() => this.requestPurchase(annualProdId)}>
              <View style={{marginTop: 5, paddingVertical: 10, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
              <View style={{backgroundColor: 'transparent', borderBottomColor: 'black', borderBottomWidth: 1}}>
                <Text style={{fontSize: 15, marginBottom: -2, fontFamily: 'PoppinsSemiBold'}}>Start your 7-Day Free trial.</Text>
              </View>
              </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.facebook_button} onPress={() => this.requestPurchase(annualProdId)}>
              <View style={{marginTop: 10, justifyContent: 'center', backgroundColor: 'transparent', alignItems: 'center'}}>
                <View style={{borderColor: '#F7D100', borderWidth: 1, borderRadius: 30, paddingVertical: 6, paddingHorizontal: '10%', backgroundColor: '#F7D100'}}>
                <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 16}}>Subscribe for $29.99/year</Text></View>
              </View>
              </TouchableOpacity>


                {this.state.coupanStatus &&
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.toggleModal('y')}>
                        <View style={{
                            marginTop: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottomColor: 'lightgray',
                            borderBottomWidth: 1
                        }}>
                            <Text style={{
                                fontFamily: 'PoppinsSemiBold',
                                borderBottomColor: 'black',
                                fontSize: 15,
                                color: 'gray'
                            }}>Apply coupan</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                }

              <View style={{marginTop: 15, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'PoppinsSemiBold', fontSize: 15}}>Cancel anytime.</Text>
              </View>



              <View style={{justifyContent: 'center', backgroundColor: 'transparent', marginTop: 12, alignItems: 'center'}}>
               <TouchableOpacity onPress={() => this.switchMonthly()}>
                    <View style={{backgroundColor: 'transparent', borderBottomColor: 'lightgray', borderBottomWidth: 1}}>
                    <Text style={{textAlign: 'center', marginBottom: -2, fontFamily: 'PoppinsSemiBold', fontSize: 16, color: 'gray'}}>Switch to monthly plan</Text>
                    </View>
                </TouchableOpacity>
              </View>

            </View>
            </View>
          }

          </ScrollView>
          </View>
        );
      }
      else{
        return(
          <View>
            <Spinner visible={this.state.showloader} textContent={''} color={'black'}/>
          </View>
        )
      }

    }


}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: 'white'

    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // backgroundColor: 'orange',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 28 : 38,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0, flexDirection: 'column', backgroundColor: 'white'
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
//   Header Items
    container: {
        flex: 1,
        backgroundColor: 'red'
    },

    header_view: {
        height: 125,
        flex: 1,
    },

    header_items: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 20,
    },

    header_image: {
        flex: 1,
        height: 125,

    },

    menu: {
        width: 38,
        height: 28,
        marginLeft: 20,

    },

    profile: {
        width: 55,
        height: 55, marginRight: -14, marginTop: 3,
        borderRadius: 55 / 2
    },


//Challenges Items
    challenge_view: {
        flex: 1,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }

    },

    chalenge_profile: {
        flex: 1,
        height: 200,
        width: '100%',
        // resizeMode:'cover' ,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },


//Appreciation team member items
    appreciatio_view: {
        flex: 1,
        height: 380,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginTop: 15,
        marginBottom: 0,

        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }

    },

    appreciation_title: {
        marginLeft: 12,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 12,
        lineHeight: 20
    },

    appreciation_desc: {
        marginLeft: 12,
        fontFamily: 'PoppinsRegular',
        lineHeight: 15,
        fontSize: 11,
        marginTop: 5

    },


//Weekly Video items
    weekly_view: {
        flex: 1, height: 110,
        marginHorizontal: 15, padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 0, marginTop: 15,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    LeaderShipCorner: {
        flex: 1, height: 100,
        marginHorizontal: 15, padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 0, marginTop: 15,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1
        }
    },
    //Weekly Video items
    win_view: {
        flex: 1,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 15, marginTop: 15,
        height: 245
    },


//Top user items
    leaderboard_view: {
        height: 190,
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10

    },

    //Top user items
    topstreaks_view: {
        height: 190,
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 30,

    },

    topuser_itemsview: {
        width: 110,
        height: 130,
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 5,
        marginTop: 5,
        marginRight: 10,
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

    win_user_itemsview: {
        width: 250,
        height: 145,
        borderRadius: 10,
        marginLeft: 5,
        marginTop: 5,
        marginRight: 10,
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
    },

    tabbar_inner_view: {

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

});
