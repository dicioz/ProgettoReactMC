import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MenuList from './views/menuList';
import MenuDetails from './views/menuDetails';
import OrderStatus from './views/orderStatus';
import Profile from './views/profile';
import modifyProfile from './views/modifyProfile';
import EnableLocationScreen from './views/enableLocation';
import { useEffect } from 'react';
import { fetchData } from './viewmodels/AppViewModel';
import DBController from './models/DBController';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as Location from 'expo-location';

// Stack Navigator per il menù
const MenuStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();


const MenuStackScreen = () => (
  //menuStack è il nome dello stack
  //screeen è una singola pagina
  <MenuStack.Navigator>
    <MenuStack.Screen name="MenuList" component={MenuList} options={{ title: 'Menù' }} />
    <MenuStack.Screen name="MenuDetails" component={MenuDetails} options={{ title: 'Dettagli Menù' }} />
  </MenuStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="ProfileMain" component={Profile} options={{ title: 'Profilo' }} />
    <ProfileStack.Screen name="ModifyProfile" component={modifyProfile} options={{ title: 'Modifica Profilo' }} />
  </ProfileStack.Navigator>
)

// Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  const [locationPermission, setLocationPermission] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const permissionResponse = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(permissionResponse.status === 'granted');
      } else {
        setLocationPermission(true);
      }
    };

    checkPermissions();

    fetchData().then((textToShow) => {
      console.log(textToShow);
      setIsInitialized(true);
    }).catch((error) => {
      console.error(error);
    });

  }, []); //La dipendenza vuota [] assicura che venga eseguito solo una volta

  // Aggiungi questa condizione per attendere l'inizializzazioneC
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text>Inizializzazione in corso...</Text>
      </View>
    );
  }

  if (locationPermission === false) {
    return <EnableLocationScreen />;
  }

  if (locationPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Controllo dei permessi...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            //Ogni tab mostra un'icona che cambia in base alla schermata (route.name)
            if (route.name === 'Menu') {
              iconName = 'food'; //icona mostrata nella tab derivante dal pacchetto MaterialCommunityIcons
            } else if (route.name === 'Order') {
              iconName = 'truck-delivery';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200ee', //Colore dell'icona attiva
          tabBarInactiveTintColor: 'gray',//colore dell'icona inattiva
        })}
      >
        {/* Tab.Screen è una singola tab, name è utilizzato in route.name */}
        <Tab.Screen name="Menu" component={MenuStackScreen} options={{ headerShown: false }} />{/*headerShown: false nasconde l'header*/}
        <Tab.Screen name="Order" component={OrderStatus} options={{ title: 'Stato Ordine' }} /*usiamo title per definire il titolo da visualizzare nell'intestazione (barra in alto) della schermata -> da order cambia a Stato.*/ />
        <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
