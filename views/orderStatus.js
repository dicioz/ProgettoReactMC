import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import useOrderViewModel from '../viewmodels/orderViewModel';

const OrderStatus = () => {
  const { orderStatus, updateOrderStatus, location, getOrderStatusViewModel, sid, oid, getMenuDetailsViewModel } = useOrderViewModel();
  const [statusResult, setStatusResult] = useState(null);
  const [menuDetails, setMenuDetails] = useState(null); // Nuovo stato per i dettagli del menu e per la posizione di partenza

  // Nuovo useEffect basato su sid e oid
  useEffect(() => {
    let interval = null; // serve a fare polling ogni 5 secondi
    // Spiegazione: funzione che recupera lo stato ordine e gestisce la logica di 'false' e 'COMPLETED'
    const fetchStatus = async () => {
      try {
        const result = await getOrderStatusViewModel();
        let menuDetails = null;
        if (result !== false) {
          menuDetails = await getMenuDetailsViewModel();
        }
        if (result === false) {
          // Spiegazione: se non ci sono ordini, settiamo false e saltiamo il polling
          setStatusResult(false);
          console.log("Non hai effettuato alcun ordine");
        } else {
          console.log(result.oid);
          setStatusResult(result);
          setMenuDetails(menuDetails);
          // Spiegazione: se ordine completato, interrompe il polling
          if (result.status === 'COMPLETED' && interval) {
            clearInterval(interval);
          }
        }
        return result;
      } catch (error) {
        console.error('Error fetching order status:', error);
      }
    };

    fetchStatus();      // Esegui subito
    interval = setInterval(fetchStatus, 5000); // Polling

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [oid]); // Spiegazione: array di dipendenze vuoto, esegue solo al mount e al unmount

  if (statusResult === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notfound}>Non hai effettuato alcun ordine</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text>Caricamento posizione...</Text>
      </View>
    );
  }

  if (!statusResult) {
    return (
      <View style={styles.centered}>
        <Text>Caricamento stato ordine...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Stato Ordine: {statusResult.status}</Text>
      <Button title="Aggiorna Ordine" onPress={() => updateOrderStatus(statusResult.oid)} />
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="La tua posizione"
          description="Posizione attuale"
        />
        <Marker
          coordinate={{
            latitude: statusResult.currentPosition.lat,
            longitude: statusResult.currentPosition.lng,
          }}
          title="Posizione ordine"
          description="Posizione attuale dell'ordine"
        >
          <Image
            source={require('../assets/drone.webp')}
            style={{ width: 40, height: 40, borderRadius: 5 }}
          />
        </Marker>
        <Polyline
          coordinates={[
            { latitude: statusResult.currentPosition.lat, longitude: statusResult.currentPosition.lng },
            { latitude: location.latitude, longitude: location.longitude },
          ]}
          strokeColor="#000"
          strokeWidth={3}
          lineDashPattern={[5, 5]}
        />
        <Marker 
          coordinate={{
            latitude: menuDetails.location.lat,
            longitude: menuDetails.location.lng,
          }}
          title='Partenza'
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
  },
  map: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },
  notfound: {
    color: 'red',
    flex: 1,
    justifyContent: 'center',
    textAlignVertical: 'center',  
    textAlignHorizontal: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderStatus;
