import React, { useContext, useEffect, useState } from "react";


import {Center} from "@/components/ui/center"
import {Box} from "@/components/ui/box"

import {HStack} from "@/components/ui/hstack"
import {Text} from "@/components/ui/text"

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetIcon,
} from '@/components/ui/actionsheet';

import Icon from "react-native-vector-icons/AntDesign";
import numbro from "numbro";


function AddtoCartActionSheet(props) {

  const cartItemsCount = props.cartItemsCount;
  const productsTotalAmount = props.productsTotalAmount;

  const close = () => {
    // console.log('closing bottom sheet');
    props.setStatus(false);
  };


  return <Center>
    <Actionsheet isOpen={props.isOpen} onClose={close}>
      <Actionsheet>
        <Box w="100%" h={60} px={4} justifyContent="center">
          <Text style={{ textAlign: "center", fontSize: 16, color: "#000" }}>
            Your Cart Total
          </Text>
        </Box>


        <Actionsheet onPress={props.openCart} style={{ backgroundColor: "black", alignItems: "center" }}>

          <HStack w={"100%"} space={2}>
            <Icon name="shoppingcart" size={18} color="#fff" />
            <Text style={{
              color: "#fff",
              fontSize: 12,
            }}>View Cart - {cartItemsCount} {(cartItemsCount > 1 ? "Items" : "Item")} (K{
              numbro(parseInt(productsTotalAmount)).format({
                thousandSeparated: true,
                mantissa: 2,
              })
            }) </Text>
          </HStack>
        </Actionsheet>

      </Actionsheet>
    </Actionsheet>
  </Center>;

}


export default AddtoCartActionSheet;
