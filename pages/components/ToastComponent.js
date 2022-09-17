import React from "react";
import { Alert, Button, Center, CloseIcon, HStack, IconButton, Text, useToast, VStack } from "native-base";

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
          <Alert.Icon />
          <Text fontSize="md" fontWeight="medium" flexShrink={1}
                color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
            {title}
          </Text>
        </HStack>
        {isClosable ? <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
          color: variant === "solid" ? "lightText" : "darkText",
        }} onPress={() => toast.closeAll()} /> : null}
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
