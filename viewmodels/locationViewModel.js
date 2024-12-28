// Importa le funzioni necessarie da React e dal modello di localizzazione
import { useState, useEffect } from 'react';
import {
  getPermissionsStatus,
  requestLocationPermissions,
  getCurrentLocation,
  setPermissionRequested,
  getPermissionRequestedBefore,
} from '../models/locationModel';

// Hook personalizzato per gestire la localizzazione
const useLocationViewModel = () => {
  const [location, setLocation] = useState(null);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentView, setCurrentView] = useState('menu');

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Verifica se i permessi sono stati richiesti in precedenza
        const permissionRequestedBefore = await getPermissionRequestedBefore();
        // Ottiene lo stato attuale dei permessi di localizzazione
        const status = await getPermissionsStatus();

        if (status.granted) {
          // Se i permessi sono concessi, aggiorna lo stato e ottiene la posizione
          setPermissionGranted(true);
          setCurrentView('menu');
          if (!location) fetchLocation(); // Ottiene la posizione solo se non già disponibile
        } else if (permissionRequestedBefore === 'true') {
          // Se i permessi sono stati negati in precedenza, mostra la schermata per abilitarli
          setShowPermissionPopup(false);
          setCurrentView('enableLocationScreen');
        } else {
          // Mostra il popup per richiedere i permessi per la prima volta
          setShowPermissionPopup(true);
        }
      } catch (error) {
        console.error('Errore durante il controllo dei permessi:', error);
      }
    };

    checkPermissions();
  }, [location]); // Esegue l'effetto quando 'location' cambia

  const requestPermissions = async () => {
    try {
      // Richiede i permessi di localizzazione all'utente
      const { status } = await requestLocationPermissions();
      if (status === 'granted') {
        // Se i permessi sono concessi, aggiorna lo stato e ottiene la posizione
        setPermissionGranted(true);
        setShowPermissionPopup(false);
        setCurrentView('menu');
        await setPermissionRequested();
        if (!location) fetchLocation(); // Ottiene la posizione solo se non già disponibile
      } else {
        // Se i permessi sono negati, aggiorna lo stato di conseguenza
        setPermissionGranted(false);
        setShowPermissionPopup(false);
        setCurrentView('enableLocationScreen');
        await setPermissionRequested();
      }
    } catch (error) {
      console.error('Errore durante la richiesta dei permessi:', error);
    }
  };

  // Funzione per ottenere la posizione attuale dell'utente
  const fetchLocation = async () => {
    try {
      // Chiama la funzione del modello per ottenere le coordinate
      const { coords } = await getCurrentLocation();
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } catch (error) {
      console.error('Errore durante l\'ottenimento della posizione:', error);
    }
  };

  return {
    location,
    showPermissionPopup,
    requestPermissions,
    fetchLocation,
    currentView,
    setCurrentView,
  };
};

export default useLocationViewModel;
