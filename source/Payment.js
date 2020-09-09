import React, {Component} from 'react';
import {Dimensions, Image, Platform, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Spinner from "react-native-loading-spinner-overlay";
import HTML from "react-native-render-html";
const backarrow = require('../assets/backarrow.png');
const headerback = require('../images/image-8.png');
//import * as InAppPurchases from 'expo-in-app-purchases';
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

const getAccessToken = async () => {
    return await SecureStore.getItemAsync('token');
};

const getUserId = async () => {
    return await SecureStore.getItemAsync('id');
};

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =  Dimensions.get("window").height;

const itemSkus = Platform.select({
ios: [
  '07092020',
  '07102020',
],
});
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class Payment extends Component {

    constructor(props) {
        super(props);

        this.state = {
          productList: [],
          receipt: '',
          offSetLoader: false,
          availableItemsMessage: '',
        }
        this.purchaseItem = this.purchaseItem.bind(this);
    }

    async componentDidMount(): void {
      this.setState({offSetLoader: true});
      await RNIap.initConnection()
      try {
      const products: Product[] = await RNIap.getProducts(itemSkus);
      this.setState({offSetLoader: false});
      console.log('Products', products);
      this.setState({productList: products});
      // console.log('products', products);
      // this.requestPurchase(products[0].productId);
      } catch(err) {
        alert(err.message); // standardized err.code and err.message available
        this.setState({offSetLoader: false});
      }

        getAccessToken().then(token =>
                this.setState({accessToken: token}),
            //this.getDailyInspirationApiData(token)
        );


        getUserId().then(id =>
            this.setState({id: id}),
        );
    }


    _inApp = async () => {
      this.setState({offSetLoader: true});
      // const connectCheck = await InAppPurchases.connectAsync();
      // console.log('connectCheck123456798', connectCheck);
      // if(connectCheck.responseCode == 0){
      //   await InAppPurchases.connectAsync();
      // }
      // console.log('connectCheck', connectCheck);
      // return false;


      // const { responseCode, results } = await InAppPurchases.getProductsAsync(items);
      // if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      //   this.setState({ items: results });
      //   this.purchaseItem(results);
      // }

    };

    requestPurchase = async (sku: string) => {
      try {
        const response = await RNIap.requestPurchase(sku, false);
        console.log('response', response);
      } catch (err) {
        alert(err.message);
      }
    }

    requestSubscription = async (sku): void => {
      try {
        RNIap.requestSubscription(sku);
      } catch (err) {
        Alert.alert(err.message);
      }
    };

    purchaseItem(results) {
                  // Set purchase listener
              InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
                // Purchase was successful
                if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                  results.forEach(purchase => {
                    if (!purchase.acknowledged) {
                      console.log(`Successfully purchased ${purchase.productId}`);
                      // Process transaction here and unlock content...

                      // Then when you're done
                      InAppPurchases.finishTransactionAsync(purchase, true);
                    }
                  });
                }

                // Else find out what went wrong
                if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
                  console.log('User canceled the transaction');
                } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
                  console.log('User does not have permissions to buy but requested parental approval (iOS only)');
                } else {
                  console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
                }
              });
    }




    async requestPayment(object) {
        alert(JSON.stringify(object))
       console.log("object",object)
       this.props.navigation.navigate('DashBoard');
    }

    render() {
      const {productList} = this.state;
        return (
            <View style={styles.container}>
            {/* Header View */}
            <Spinner visible={this.state.offSetLoader} textContent={''} color={'black'}/>
            <View style={styles.header_view}>
                <ImageBackground source={headerback} style={styles.header_image}>
                    {/* Header items View */}
                    <View style={styles.header_items}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('DashBoard')}>
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
                                  numberOfLines={1}>Payment
                            </Text>
                        </View>

                    </View>
                </ImageBackground>


            </View>
            {/* Ended Header View */}

            <View style={{flex: 1,  justifyContent: 'center', alignItems: 'center'}}>
            {productList.map((product, i) => {
              return (
                <View
                  key={i}
                  style={{
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      marginTop: 20,
                      fontSize: 12,
                      color: 'black',
                      minHeight: 100,
                      alignSelf: 'center',
                      paddingHorizontal: 20,
                    }}>
                    {JSON.stringify(product)}
                  </Text>
                  <TouchableOpacity style={{paddingVertical:12, marginHorizontal: 20, paddingHorizontal: 40, borderRadius: 30, backgroundColor:'#4AAFE3',marginTop:20}}
                  //onPress={(): void => this.requestSubscription(product.productId)}
                  onPress={(): void => this.requestPurchase(product.productId)}
                  ><Text style={{color: '#fff', fontFamily: 'PoppinsBold', textAlign:'center'}}>{product.title}</Text></TouchableOpacity>
                </View>
              );
            })}

                 {this.state.loading &&
                 <View style={{marginTop:20}}><ActivityIndicator animating={true} size="small" color="#f1750c"  /></View>
                 }
              </View>
            </View>
        );
    }

}
const styles = StyleSheet.create({

    container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  menu: {
      width: 25,
      height: 25,
      marginLeft: 15,
  },

  header_items: {
      height: 55,
      flexDirection: 'row',
      alignItems: 'center',

      marginTop: 35,
  },

  header_image: {
      flex: 1,
      height: 90
  },
  header_view: {
      height: 90,

  },
});
