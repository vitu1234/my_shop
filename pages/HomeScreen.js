import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Container, FlatList, Heading, HStack, ScrollView, Text, VStack } from "native-base";
import { View, StyleSheet, ToastAndroid } from "react-native";
import ButtonCategory from "./components/ButtonCategory";
import { Dimensions } from "react-native";
import ProductCard from "./components/ProductCard";
import { CartContext } from "../app_contexts/AppContext";
import SQLite from "react-native-sqlite-storage";
import Divider from "native-base/src/components/composites/Divider/index";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const { width } = Dimensions.get("window");

import { base_url, getHomeScreen } from "../config/API";
import { db } from "../config/sqlite_db_service";
import ContentLoader from "react-native-easy-content-loader";




function HomeScreen(props) {
  const [categoryActive, setCategoryActive] = useState(-1);
  const [cartItemsCount, setCartItemsCount] = useContext(CartContext);
  const [IsAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
  const [IsAppDataFetchError, setIsAppDataFetchError] = useState(false);
  const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");

  const [categories, setCategories] = useState([]);
  const [products_first_row, setProductsFirstRow] = useState([]);
  const [flash_products, setFlashProducts] = useState([]);


  const btnCategoryAction = (category_id) => {
    console.log("GOES TO " + category_id + " CATEGORY");
    setCategoryActive(category_id);
  };

  const productCardAction = (product) => {
    // console.log(product);
    props.navigation.navigate("ProductDetails", { data: product });
  };

  const setCartCounterNumber = () => {
    //update cart counter
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cart",
        [],
        (tx, results) => {
          const len = results.rows.length;
          setCartItemsCount(len);

        },
      );
    });
  };

  const homeScreenLoading = (isFetchingDataError, message) => {
    setIsAppDataFetchLoading(false);
    if (isFetchingDataError) {
      setIsAppDataFetchError(true);
      setIsAppDataFetchMsg(message);
      ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      setIsAppDataFetchError(false);
      setIsAppDataFetchMsg(message);

      //get data from database
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM category ORDER BY RANDOM()",
          [],
          (tx, results) => {
            const len = results.rows.length;
            const temp = [];

            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setCategories(temp);

          },
        );
      });
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM products_homescreen ORDER BY RANDOM() LIMIT 10",
          [],
          (tx, results) => {
            const len = results.rows.length;
            const temp = [];

            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setProductsFirstRow(temp);

          },
        );
      });
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM products_homescreen ORDER BY RANDOM() LIMIT 20",
          [],
          (tx, results) => {
            const len = results.rows.length;
            const temp = [];

            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setFlashProducts(temp);

          },
        );
      });
    }
  };

  useEffect(() => {
    setCartCounterNumber();
    getHomeScreen({ homeScreenLoading });

  }, []);

  const renderCategoryList = categories.map((category) => {
    if (category.category_id === categoryActive) {
      return (
        <ButtonCategory key={category.category_id} data={{
          btnText: category.category_name,
          category_id: category.category_id,
          action: btnCategoryAction,
          bgColor: true,
        }}></ButtonCategory>
      );
    } else {
      return (

        <ButtonCategory key={category.category_id} data={{
          btnText: category.category_name,
          category_id: category.category_id,
          action: btnCategoryAction,
          bgColor: false,
        }}></ButtonCategory>
      );
    }


  });
  const renderProductList = products_first_row.map((product) => {
    return (
      <View key={product.product_id} style={{ width: "25%", marginEnd: 20 }}>
        <ProductCard data={{
          product: product,
          action: productCardAction,
          cardWidth: 200,
        }} />
      </View>
    );
  });

  if (IsAppDataFetchLoading) {
    console.log("loadingd");
    return (
      <View style={styles.container}>
        <ContentLoader
          active={true}
          loading={true}
          pRows={5}
          pHeight={[70, 100, 50, 70, 160, 77]}
          pWidth={[100, 300, 70, 200, 300, 300]}
        />
      </View>
    );
  } else {
    console.log("finished loading");
    if (IsAppDataFetchError) {
      return (
        <View style={styles.container}>
          <Heading style={styles.errorText} size="sm" fontWeight="bold">
            {appDataFetchMsg}
          </Heading>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Heading size="md" fontWeight="bold">
            Let's help you find what you want!
            {/*<Text color="emerald.500"> React Ecosystem</Text>*/}
          </Heading>
          <ScrollView
            ref={(scrollView) => {
              scrollView = scrollView;
            }}
            // style={s.container}
            //pagingEnabled={true}
            marginTop={5}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width - 60}
            snapToAlignment={"center"}
            contentInset={{
              top: 0,
              left: 30,
              bottom: 0,
              right: 30,
            }}>

            {
              (categoryActive === -1) ?
                <ButtonCategory
                  data={{ btnText: "All", category_id: -1, action: btnCategoryAction, bgColor: true }} />
                :
                <ButtonCategory
                  data={{
                    btnText: "All",
                    category_id: -1,
                    action: btnCategoryAction,
                    bgColor: false,
                  }} />
            }

            {renderCategoryList}
          </ScrollView>


          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <VStack>


              <ScrollView
                ref={(scrollView) => {
                  scrollView = scrollView;
                }}
                // style={s.container}
                //pagingEnabled={true}
                marginTop={5}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                decelerationRate={0}
                snapToInterval={width - 60}
                snapToAlignment={"center"}
                contentInset={{
                  top: 0,
                  left: 30,
                  bottom: 0,
                  right: 30,
                }}>


                {renderProductList}
              </ScrollView>
              <Divider style={{ marginTop: 10 }} />
              <View style={{ display: "flex", direction: "row" }}>
                <HStack style={{ marginTop: 15 }}>
                  <Heading size="md" fontWeight="bold">
                    Flash Products
                    {/*<Text color="emerald.500"> React Ecosystem</Text>*/}
                  </Heading>
                  <Button onPress={() => console.log("Go to all products")} variant={"outline"} size={"sm"}
                          style={{ alignSelf: "flex-end", marginLeft: "auto" }}><Text>View
                    All</Text></Button>
                </HStack>
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{ width: "100%", height: "100%" }}>
                  <FlatList
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={{ paddingBottom: 80 }}

                    numColumns={2} horizontal={false}
                    data={flash_products}
                    renderItem={({ item }) =>
                      <Box style={{ width: "45%" }}
                           py="2">
                        <ProductCard key={item.product_id} data={{
                          product: item,
                          action: productCardAction,
                          cardWidth: 200,
                        }} />
                      </Box>
                    } keyExtractor={item => item.product_id} />
                </ScrollView>
              </View>


            </VStack>
          </ScrollView>

        </View>
      );
    }
  }


}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "column",
  },
  errorText: {
    color: "#b60303",
    alignSelf: "center",
  },

  card: {
    flex: 1,
    margin: 10,
    flexBasis: "50%",
  },
});

export default HomeScreen;
