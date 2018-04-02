import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Button } from 'react-native-elements';
// import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  login: {
    marginBottom: 'auto',
  },
});

const ModalContent = (props) => {
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
    <Modal style={styles.modalContent} isVisible={props.showState}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text h4>Next Location</Text>
        <ModalData />
        <Button
          onPress={props.closeModal}
          style={styles.login}
          buttonStyle={{
            backgroundColor: '#3a599a',
            width: 250,
            height: 60,
            marginTop: 400,
          }}
          text="Lets Go!"
        />
      </View>
    </Modal>
  );
};
export default ModalContent;
