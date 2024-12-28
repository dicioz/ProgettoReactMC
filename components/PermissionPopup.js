// components/PermissionPopup.js
import React from 'react';
import { View, Modal, Text, Button, StyleSheet } from 'react-native';

const PermissionPopup = ({ visible, onRequestPermission }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Questa app necessita dei permessi per accedere alla tua posizione per offrirti un servizio migliore. Per favore, concedi i permessi per il corretto funzionamento.
          </Text>
          <Button title="Concedi Permesso" onPress={onRequestPermission} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default PermissionPopup;
