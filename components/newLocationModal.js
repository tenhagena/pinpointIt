import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { Text, Button } from 'react-native-elements';
// import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  login: {
    marginBottom: 'auto',
  },
});

const ModalContent = props =>
  // const test = () => console.log('Test');

  (
    <Modal style={styles.modalContent} isVisible={props.showState}>
      <View style={{ flex: 1 }}>
        <Text h2>{props.modalData}</Text>
        <Button
          onPress={props.closeModal()}
          style={styles.login}
          buttonStyle={{
            backgroundColor: '#3a599a',
            width: 250,
            height: 60,
          }}
          text="Lets Go!"
        />
      </View>
    </Modal>
  );
export default ModalContent;
