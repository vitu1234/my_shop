import React, {useContext, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CartContext, ProductFilterModalContext} from '@/app_contexts/AppContext';

import {Button} from "@/components/ui/button"

import {CloseIcon, Icon} from "@/components/ui/icon"
import {Radio, RadioGroup} from "@/components/ui/radio"
import {Modal, ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal"
import {View} from "react-native";
import {ModalContext} from "@gluestack-ui/modal";


function SearchFilterScreen(props) {
    // const [modalVisible, setModalVisible] = React.useState(false);
    const [isModalVisibleProducts, setIsModalVisibleProducts] = useContext(ProductFilterModalContext);

    // console.log('SEARCH SCREEN------------');
    console.log(props);
    const name_sort_init = props.searchStates['0'].name_asc === true ? 1 : props.searchStates['0'].name_desc === true ? 2 : '';

    const age_sort_init = props.searchStates['0'].newest_first === true ? 1 : props.searchStates['0'].oldest_first === true ? 1 : '';

    const price_sort_init = props.searchStates['0'].price_asc === true ? 1 : props.searchStates['0'].price_desc === true ? 2 : '';


    const [name_sort, setNameSort] = useState(name_sort_init);

    const [age_sort, sortAgeSort] = useState(age_sort_init);

    const [price_sort, setPriceSort] = useState(price_sort_init);

    const clearFilters = () => {
        setPriceSort('');
        sortAgeSort('');
        setNameSort('');
        // setIsModalVisibleProducts(false);
    };

    const setFilters = () => {
        const price_asc = (price_sort == 1) ? true : false;
        const price_desc = price_sort == 2 ? true : false;
        const newest_first = age_sort == 1 ? true : false;
        const oldest_first = age_sort == 2 ? true : false;
        const name_asc = name_sort == 1 ? true : false;
        const name_desc = name_sort == 2 ? true : false;

        const filters = {
            price_asc: price_asc,
            price_desc: price_desc,
            newest_first: newest_first,
            oldest_first: oldest_first,
            name_asc: name_asc,
            name_desc: name_desc,
        };
        // console.log(filters);
        props.data.newFilters(filters);
        setIsModalVisibleProducts(false);


    };


    return (
        <View>

            <Modal isOpen={isModalVisibleProducts} onClose={() => setIsModalVisibleProducts(false)} avoidKeyboard
                   justifyContent="flex-end"
                   bottom="0" size="lg">
                <ModalContext>
                    <Icon as={CloseIcon} className="text-typography-500 m-2 w-4 h-4"/>
                    <ModalHeader>Sort Products By</ModalHeader>
                    <ModalBody>

                        <RadioGroup onChange={(value) => setPriceSort(value)}
                                     value={price_sort} size="lg" name="price_sort_radio"
                                     accessibilityLabel="pick a choice">
                            <Radio _text={{
                                mx: 2,
                            }} value="1" icon={<Icon as={<MaterialCommunityIcons name="check"/>}/>} my={1}>
                                Price Asc
                            </Radio>
                            <Radio _text={{
                                mx: 2,
                            }} value="2" icon={<Icon as={<MaterialCommunityIcons name="check"/>}/>} my={1}>
                                Price Desc
                            </Radio>
                        </RadioGroup>


                        <RadioGroup onChange={(value) => sortAgeSort(value)} value={age_sort} size="lg"
                                     name="age_sort_radio"
                                     accessibilityLabel="pick a choice">
                            <Radio _text={{
                                mx: 2,
                            }} value="1" icon={<Icon as={<MaterialCommunityIcons name="check"/>}/>}
                                   my={1}>
                                Newest First
                            </Radio>
                            <Radio _text={{
                                mx: 2,
                            }} value="2" icon={<Icon as={<MaterialCommunityIcons name="check"/>}/>}
                                   my={1}>
                                Oldest First
                            </Radio>

                        </RadioGroup>

                        <RadioGroup onChange={(value) => setNameSort(value)} value={name_sort} size="lg"
                                     name="prod_name_radio"
                                     accessibilityLabel="pick a choice">
                            <Radio _text={{
                                mx: 2,
                            }} value="1" icon={<Icon as={<MaterialCommunityIcons name="check"/>}/>} my={1}>
                                Name Asc
                            </Radio>
                            <Radio value="2" _text={{
                                mx: 2,
                            }} icon={<Icon as={<MaterialCommunityIcons name="check"/>}/>} my={1}>
                                Name Desc
                            </Radio>
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter>

                        <Button flex="1" onPress={setFilters}>
                            Set
                        </Button>

                        <Button colorScheme={'danger'} mx={2} flex="1" onPress={() => {
                            clearFilters();
                        }}>
                            Clear All filters
                        </Button>
                    </ModalFooter>
                </ModalContext>
            </Modal>
            {/*<VStack space={8} alignItems="center">*/}
            {/*    <Button w="104" onPress={() => {*/}
            {/*        setIsModalVisibleProducts(!isModalVisibleProducts);*/}
            {/*    }}>*/}
            {/*        Open Modal*/}
            {/*    </Button>*/}
            {/*    <Text textAlign="center">*/}
            {/*        Open modal and focus on the input element to see the effect.*/}
            {/*    </Text>*/}
            {/*</VStack>*/}

        </View>
    );
}

export default SearchFilterScreen;
