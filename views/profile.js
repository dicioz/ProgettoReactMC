import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, View, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { Card, Button, Title } from 'react-native-paper'; // Usando react-native-paper
import useProfileViewModel from '../viewmodels/profileViewModel';
import ModifyProfile from './modifyProfile'; // Importa la schermata per la modifica
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



  const Profile = ({ navigation }) => {  // Aggiungi il parametro navigation, 
    //derivante dal fatto che la pagina "Profile" è registrata in App.js in uno stack navigator
    const { userData, updateUserInfo } = useProfileViewModel();

    /* // Gestore per il salvataggio dei dati modificati
    const handleSubmit = () => {
      // Qui puoi aggiungere la logica per aggiornare i dati
      updateUserInfo({
        nome: firstName,
        cognome: lastName,
        numero: cardNumber,
        scadenza: `${expiryMonth}/${expiryYear}`,
        cvv,
      });
    };
   */
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Title style={styles.title}>Profilo</Title>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.subtitle}>Dati Utente</Text>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Nome: {userData.nome}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Cognome: {userData.cognome}</Text>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.subtitle}>Carta di Credito</Text>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Intestatario: {userData.intestatario}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Numero: {userData.numero}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>Scadenza: {userData.mese_scadenza}/{userData.anno_scadenza}</Text>
                </Card.Content>
              </Card>
              <Card style={styles.subcard}>
                <Card.Content>
                  <Text style={styles.text}>CVV: {userData.cvv}</Text>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('ModifyProfile', {userData, updateUserInfo})} // Naviga alla schermata di modifica
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Modifica Profilo
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    //paddingTop: 20,
    paddingBottom: 30,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
    paddingTop: 40,
  },
  card: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 8,
    elevation: 3,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subcard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default Profile;
