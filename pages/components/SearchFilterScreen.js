import React from 'react';
import {Button, FormControl, Input, View, VStack, Text, Modal, Radio, Icon} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function SearchFilterScreen(props) {
    const [modalVisible, setModalVisible] = React.useState(false);

    console.log('MODAL');
    console.log(props);
    return (
        <View>

            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} avoidKeyboard justifyContent="flex-end"
                   bottom="0" size="lg">
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>Sort Products By</Modal.Header>
                    <Modal.Body>
                        <Radio.Group size="lg" name="price_sort_radio" accessibilityLabel="pick a choice">
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
                            setModalVisible(false);
                        }}>
                            Set
                        </Button>

                        <Button colorScheme={'danger'} mx={2} flex="1" onPress={() => {
                            setModalVisible(false);
                        }}>
                            Clear All filters
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <VStack space={8} alignItems="center">
                <Button w="104" onPress={() => {
                    setModalVisible(!modalVisible);
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
