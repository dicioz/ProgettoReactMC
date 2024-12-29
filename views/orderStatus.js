import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import useOrderViewModel from '../viewmodels/orderViewModel';

const OrderStatus = () => {
  const { orderStatus, updateOrderStatus, location, getOrderStatusViewModel, sid, oid, getMenuDetailsViewModel } = useOrderViewModel();
  const [statusResult, setStatusResult] = useState(null);
  const [menuDetails, setMenuDetails] = useState(null); // Nuovo stato per i dettagli del menu e per la posizione di partenza

  const mapRef = useRef(null); // Riferimento alla MapView
  const [zoomLevel, setZoomLevel] = useState(0.01); // Stato per il livello di zoom


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

  //pulsante che utilizza il metodo animateToRegion per centrare la mappa sulla posizione dell'utente
  const centerOnUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      }, 1000); // 1000 ms per l'animazione
    }
  };

  //pulsante dello zoom, possiamo modificare lo stato zoomLevel e aggiornare la mappa di conseguenza.
  const zoomIn = () => {
    if (mapRef.current) {
      setZoomLevel((prevZoom) => Math.max(prevZoom / 2, 0.002)); // Zoom in (riduce latitudeDelta e longitudeDelta)
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      setZoomLevel((prevZoom) => Math.min(prevZoom * 2, 1)); // Zoom out (aumenta latitudeDelta e longitudeDelta)
    }
  };

  //pulsante che utilizza il metodo animateToRegion per centrare la mappa sulla posizione del drone
  const centerOnDrone = () => {
    if (statusResult?.currentPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: statusResult.currentPosition.lat,
        longitude: statusResult.currentPosition.lng,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      }, 1000); // 1000 ms per l'animazione
    }
  };




  return (
    <View style={styles.container}>
      {/* Visualizza lo stato dell'ordine */}
      <Text style={styles.textStatus}>Stato Ordine: {statusResult.status}</Text>
      {/* Pulsante per aggiornare lo stato dell'ordine */}
      <Button title="Aggiorna Ordine" onPress={() => updateOrderStatus(statusResult.oid)} />

      {/* Pulsanti per centrare la mappa, zoom e centrare il drone */}
      <View style={styles.buttonContainer}>
        <Button title="Centrami" onPress={centerOnUserLocation} />
        <Button title="Zoom +" onPress={zoomIn} />
        <Button title="Zoom -" onPress={zoomOut} />
        <Button title="Centra Drone" onPress={centerOnDrone} />
      </View>
      
      {/* Mappa che mostra la posizione dell'utente e del drone */}
      <MapView
        ref={mapRef}  // Aggiunge il riferimento
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          //latitudeDelta: 0.01,  ho modificato con l'uso di zoomLevel
          //longitudeDelta: 0.01,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}>
        {/* Marker per la posizione dell'utente */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="La tua posizione"
          description="Posizione attuale"
        />
        {/* Marker per la posizione dell'ordine */}
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
        {/* Linea che collega la posizione dell'utente e quella dell'ordine */}
        <Polyline
          coordinates={[
            { latitude: statusResult.currentPosition.lat, longitude: statusResult.currentPosition.lng },
            { latitude: location.latitude, longitude: location.longitude },
          ]}
          strokeColor="#000"
          strokeWidth={3}
          lineDashPattern={[5, 5]}
        />
        {/* Marker per la posizione di partenza del menu, se disponibile */}
        {menuDetails && menuDetails.location && (
          <Marker
            coordinate={{
              latitude: menuDetails.location.lat,
              longitude: menuDetails.location.lng,
            }}
            title='Partenza'
          />
        )}
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
  textStatus: {
    marginTop: 10,
    fontSize: 20,
    //fontWeight: 'bold',
    marginBottom: 10,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    zIndex: 10, // Assicurati che i pulsanti siano sopra la mappa

  },
  

  /*
  map: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
  },*/

  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 100,
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
