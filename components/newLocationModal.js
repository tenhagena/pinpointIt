import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

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

export default class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showState: false };
  }

  componentWillReceiveProps() {
    this.setState({ showState: this.props.showState });
  }

  closeModal = () => {
    this.setState({ showState: false });
  };

  render() {
    return (
      <Modal style={styles.modalContent} isVisible={this.state.showState}>
        <View style={{ flex: 1 }}>
          <Text>I am the modal content!</Text>
          <Button
            onPress={this.closeModal}
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
  }
}
