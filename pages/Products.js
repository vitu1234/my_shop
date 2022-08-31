import React, { useContext, useEffect, useState } from "react";
import { Box, Button, FlatList, Heading, HStack, Input, ScrollView, Text, View, VStack } from "native-base";
import { Dimensions, StyleSheet, ToastAndroid } from "react-native";
import { CartContext } from "../app_contexts/AppContext";
import ButtonCategory from "./components/ButtonCategory";
import ProductCard from "./components/ProductCard";
import SQLite from "react-native-sqlite-storage";
import Icon from "react-native-vector-icons/AntDesign";
import SearchFilterScreen from "./components/SearchFilterScreen";
import { getProductsScreen } from "../config/API";
import ContentLoader from "react-native-easy-content-loader";

const { width } = Dimensions.get("window");
import { db } from "../config/sqlite_db_service";


function Products(props) {
  const [categoryActive, setCategoryActive] = useState(-1);
  const [cartItemsCount, setCartItemsCount] = useContext(CartContext);

  const [IsAppDataFetchLoading, setIsAppDataFetchLoading] = useState(true);
  const [IsAppDataFetchError, setIsAppDataFetchError] = useState(false);
  const [appDataFetchMsg, setIsAppDataFetchMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const productsScreenLoading = (isFetchingDataError, message) => {
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
          "SELECT * FROM category ORDER BY category_name ASC",
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
          "SELECT * FROM product",
          [],
          (tx, results) => {
            const len = results.rows.length;
            const temp = [];

            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setProducts(temp);

          },
        );
      });
    }
  };

  const initialSearchFilters = {
    price_asc: false,
    price_desc: false,
    newest_first: false,
    oldest_first: false,
    name_asc: false,
    name_desc: false,
  };

  const setFilters1 = (filters) => {
    setSearchFilters(filters);
    console.log(filters);
    console.log("filter products here");
  };
  const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

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

  useEffect(() => {
    setCartCounterNumber();
    getProductsScreen({ productsScreenLoading });
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
          <Heading size="lg" fontWeight="900">
            Your One Stop Shop!
            {/*<Text color="emerald.500"> React Ecosystem</Text>*/}
          </Heading>
          <Input mt={5} InputLeftElement={<Icon style={{ margin: 3 }} name="search1"
                                                size={18} ml="2" color="#000" />}
                 placeholder="Search Products..." />
          <ScrollView
            ref={(scrollView) => {
              scrollView = scrollView;
            }}
            // style={s.container}
            //pagingEnabled={true}
            marginTop={5}
            marginBottom={5}
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


              {/*<Divider style={{marginTop: 5}}/>*/}
              <View style={{ display: "flex", direction: "row" }}>

                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{ width: "100%", height: "100%" }}>
                  <FlatList
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={{ paddingBottom: 190 }}

                    numColumns={2} horizontal={false}
                    data={products}
                    renderItem={({ item }) =>
                      <Box style={{ width: "45%" }}
                           py="1">
                        <ProductCard key={item.product_id} data={{
                          product: item,
                          action: productCardAction,
                          cardWidth: 200,
                        }} />
                      </Box>
                    } keyExtractor={item => item.product_id} />
                </ScrollView>
              </View>

              <SearchFilterScreen data={{ newFilters: setFilters1 }} searchStates={[searchFilters]} />

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

  card: {
    flex: 1,
    margin: 10,
    flexBasis: "50%",
  },
});
export default Products;
