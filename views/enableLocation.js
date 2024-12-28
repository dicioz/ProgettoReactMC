// screens/EnableLocationScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as Linking from 'expo-linking';

const EnableLocationScreen = () => {
  const openSettings = () => {
    // Apre le impostazioni dell'app per consentire all'utente di abilitare i permessi
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Per continuare, abilita i servizi di localizzazione nelle impostazioni dell'app.
      </Text>
      <Button title="Apri Impostazioni" onPress={openSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
});

export default EnableLocationScreen;
