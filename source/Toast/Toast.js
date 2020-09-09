import Toast from "react-native-easy-toast";
import {View,Text} from "react-native";
import React from "react";


const ShowToast = ( props ) =>{
    return(
        <Toast
          ref={props.ref}
          style={{backgroundColor: '#4AAFE3',borderRadius:90}}
          position='top'
          positionValue={240}
          fadeInDuration={75}
          fadeOutDuration={900}
          opacity={0.8}
          textStyle={{color:'#fff'}}

      />
    )

}




export default ShowToast;