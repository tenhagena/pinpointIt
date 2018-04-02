import React from 'react';
import { StyleSheet, View, Image, Dimensions, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Button } from 'react-native-elements';
// import { FontAwesome } from '@expo/vector-icons';

const ModalContent = (props) => {
  const deviceHeight = Dimensions.get('window').height;
  const deviceWidth = Dimensions.get('window').width;

  const getMarginTop = () => {
    const margin = Platform.OS === 'ios' ? deviceHeight / 4 : deviceHeight / 6;
    return margin;
  };

  const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 32,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      marginTop: getMarginTop(),
      marginBottom: deviceHeight / 4,
    },
  });


  const ModalData = () => {
    if (
      typeof props.modalData.name !== 'undefined' &&
      props.modalData.name !== undefined &&
      props.modalData.name != null
    ) {
      return (
        <React.Fragment>
          <Text>{props.modalData.name}</Text>
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSyB4oIF2s36OGPr_LugqibsU7fIuQ1kpjfk&photoreference=${
                props.modalData.image
              }`,
            }}
            style={{ width: 200, height: 200 }}
          />
        </React.Fragment>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Modal style={styles.modalContent} isVisible={props.showState}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Text h4>Next Location</Text>
          <ModalData />
          <Button
            onPress={props.closeModal}
            buttonStyle={{
              backgroundColor: '#3a599a',
              width: deviceWidth / 1.8,
              height: deviceHeight / 13,
              marginTop: deviceHeight / 20,
            }}
            text="Lets Go!"
          />
        </View>
      </Modal>
    </View>
  );
};
export default ModalContent;
