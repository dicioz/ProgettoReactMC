// ModifyProfile.js
import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Keyboard, TouchableWithoutFeedback } from "react-native";
import useProfileViewModel from "../viewmodels/profileViewModel";

const ModifyProfile = ({ route, navigation }) => {
  const { userData, updateUserInfo } = route.params;

  // Stati per modificare i dati
  const [firstName, setFirstName] = useState(userData.nome);
  const [lastName, setLastName] = useState(userData.cognome);
  const [cardNumber, setCardNumber] = useState(userData.numero);
  const [expiryMonth, setExpiryMonth] = useState(userData.mese_scadenza.toString());
  const [expiryYear, setExpiryYear] = useState(userData.anno_scadenza.toString());
  const [cvv, setCvv] = useState(userData.cvv);

  
  const handleSave = () => {
    const updatedData = {
      nome: firstName,
      cognome: lastName,
      numero: cardNumber.toString(),
      mese_scadenza: parseInt(expiryMonth),
      anno_scadenza: parseInt(expiryYear),
      lastOid: userData.lastOid, // Usa il valore esistente o modifica se necessario
      orderStatus: userData.orderStatus, // Usa il valore esistente o modifica se necessario
      cvv: cvv.toString(),
      intestatario: `${firstName} ${lastName}`,
    }; 



    updateUserInfo(updatedData);  // Salva i dati

    // Torna alla schermata del profilo, che ora rifletterà i nuovi dati
    navigation.goBack();
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 80 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.container}>
              <Text style={styles.title}>Modifica Profilo</Text>

              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={styles.label}>Cognome:</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />

              <Text style={styles.label}>Numero della Carta:</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={setCardNumber}
              />

              <Text style={styles.label}>Mese di Scadenza:</Text>
              <TextInput
                style={styles.input}
                value={expiryMonth}
                onChangeText={setExpiryMonth}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Anno di Scadenza:</Text>
              <TextInput
                style={styles.input}
                value={expiryYear}
                onChangeText={setExpiryYear}
                keyboardType="numeric"
              />

              <Text style={styles.label}>CVV:</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
              />

              {/**Tasto salva, chiama updateUserInfo per salvare i dati */}
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salva</Text>
              </TouchableOpacity>

              {/**Tasto indietro, torna alla schermata precedente */}
              <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Indietro</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ModifyProfile;
