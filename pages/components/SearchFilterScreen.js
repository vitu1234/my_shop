import React, {useContext, useState} from 'react';
import {Button, FormControl, Input, View, VStack, Text, Modal, Radio, Icon} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CartContext, ProductFilterModalContext} from '../../app_contexts/AppContext';


function SearchFilterScreen(props) {
    // const [modalVisible, setModalVisible] = React.useState(false);
    const [isModalVisibleProducts, setIsModalVisibleProducts] = useContext(ProductFilterModalContext);

    // console.log('SEARCH SCREEN------------');
    // console.log(props);
    // console.log(props.searchStates);
    const name_asc_init = props.searchStates['0'].name_asc === true ? 1 : '';
    const name_desc_init = props.searchStates['0'].name_desc === true ? 2 : '';

    const newest_first_init = props.searchStates['0'].newest_first === true ? 1 : '';

    const price_asc_init = props.searchStates['0'].price_asc === true ? 1 : '';
    const price_desc_init = props.searchStates['0'].price_desc === true ? 2 : '';

    const name_asc = useState(name_asc_init);
    const name_desc = useState(name_desc_init);

    const newest_first = useState(newest_first_init);

    const price_asc = useState(price_asc_init);
    const price_desc = useState(price_desc_init);


    return (
        <View>

            <Modal isOpen={isModalVisibleProducts} onClose={() => setIsModalVisibleProducts(false)} avoidKeyboard
                   justifyContent="flex-end"
                   bottom="0" size="lg">
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Sort Products By</Modal.Header>
                    <Modal.Body>

                        <Radio.Group  size="lg" name="price_sort_radio" accessibilityLabel="pick a choice">
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
                        </Radio.Group>


                        <Radio.Group size="lg" name="age_sort_radio" accessibilityLabel="pick a choice">
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

                        </Radio.Group>

                        <Radio.Group size="lg" name="prod_name_radio" accessibilityLabel="pick a choice">
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
                        </Radio.Group>;
                    </Modal.Body>
                    <Modal.Footer>

                        <Button flex="1" onPress={() => {
                            setIsModalVisibleProducts(false);
                        }}>
                            Set
                        </Button>

                        <Button colorScheme={'danger'} mx={2} flex="1" onPress={() => {
                            setIsModalVisibleProducts(false);
                        }}>
                            Clear All filters
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <VStack space={8} alignItems="center">
                <Button w="104" onPress={() => {
                    setIsModalVisibleProducts(!isModalVisibleProducts);
                }}>
                    Open Modal
                </Button>
                <Text textAlign="center">
                    Open modal and focus on the input element to see the effect.
                </Text>
            </VStack>

        </View>
    );
}

export default SearchFilterScreen;
