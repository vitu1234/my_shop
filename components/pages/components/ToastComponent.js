import React from "react";

import {Center} from "@/components/ui/center"
import {Box} from "@/components/ui/box"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {HStack} from "@/components/ui/hstack"
import {VStack} from "@/components/ui/vstack"
import {Text} from "@/components/ui/text"
import {Image} from "@/components/ui/image"
import {useToast, Toast} from "@/components/ui/toast"
import {Spinner} from "@/components/ui/spinner"
import {Heading} from "@/components/ui/heading"
import {Input} from "@/components/ui/input"
import {Link} from "@/components/ui/link"
import {Pressable} from "@/components/ui/pressable"
import {Icon} from "@/components/ui/icon"
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert"


function ToastComponent(props) {
    const toast = useToast();
    const ToastDetails = {
        status: props.status,
        title: props.title,
        variant: props.variant,
        description: props.description,
        isClosable: props.isClosable,
        duration: props.duration,
    };
    // <Icon as={CloseIcon} className="text-typography-500 m-2 w-4 h-4" />


    const ToastAlert = ({

                            status,
                            variant,
                            title,
                            description,
                            isClosable,
                            duration,
                            ...rest
                        }) => <Alert maxWidth="100%" alignSelf="center" flexDirection="row"
                                     status={status ? status : "info"} variant={variant} {...rest}>
        <VStack space={1} flexShrink={1} w="95%">
            <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                    <Icon as={CloseIcon} className="text-typography-500 m-2 w-4 h-4"/>
                    <Text fontSize="md" fontWeight="medium" flexShrink={1}
                          color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                        {title}
                    </Text>
                </HStack>
                {isClosable ? <Button variant="unstyled" icon={<CloseIcon size="3"/>} _icon={{
                    color: variant === "solid" ? "lightText" : "darkText",
                }} onPress={() => toast.closeAll()}/> : null}
            </HStack>
            <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                {description}
            </Text>
        </VStack>
    </Alert>;
    return <ToastAlert  {...ToastDetails} />;
    // return <Center>
    //   <VStack space={2}>
    //     {ToastDetails.map((item, index) =>
    //       <Button key={index} onPress={() =>
    //         toast.show({
    //       render: ({
    //                  id,
    //                }) => {
    //         return <ToastAlert id={id} {...item} />;
    //       },
    //     })}>
    //       {item.variant}
    //     </Button>)}
    //   </VStack>
    // </Center>;
}

export default ToastComponent;
