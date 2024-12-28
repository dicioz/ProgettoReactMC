import * as Location from 'expo-location';
import {getCurrentLocation, locationModel} from '../models/locationModel';
import {fetchLocation} from '../models/locationModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://develop.ewlab.di.unimi.it/mc/2425'; // Base URL for your API
//const  = 'vC51NLdQlBnA4no63Ah4YGsiZn0w1MqXvqVRcyxx5lc2nQtYZSTnsVaq9d3EsklJ'; // Your session ID (replace with your own)
let sid;

// Funzione per ottenere la posizione corrente
const getCurrentPosition = async () => {
  try {
    // Verifica lo stato dei permessi
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Richiede i permessi se non sono stati concessi
      const permissionResponse = await Location.requestForegroundPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        throw new Error('Permesso di accesso alla posizione non concesso');
      }
    }

    const { coords } = await getCurrentLocation();
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    console.error('Errore durante l\'ottenimento della posizione:', error);
    throw error;
  }
}

// Function to fetch the image of a specific menu by its ID
const fetchMenuImage = async (menuId) => {
  
  try {
    if (!menuId) {
      throw new Error('Invalid menu ID');
    }

    const response = await fetch(`${BASE_URL}/menu/${menuId}/image?sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sid}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenuImage] Error fetching image:', data);
      throw new Error(data.error || 'Error fetching image');
    }

    const imageUrl = await response.json();
    return imageUrl.base64; // Return the base64 image data

  } catch (error) {
    console.error('[fetchMenuImage] Error during image fetch:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};

// Function to fetch menus based on current latitude and longitude
export const fetchMenus = async () => {
  try {
    // Ottiene la posizione corrente
    const { latitude, longitude } = await getCurrentPosition();
    // Recupera il sid in modo asincrono
    sid = await AsyncStorage.getItem('SID');
    console.log('sid: ', sid);
    if (!sid) {
      throw new Error('SID non trovato');
    }
    console.log(latitude, longitude);

    if (!latitude || !longitude) {
      throw new Error('Latitudine o longitudine non valida');
    }

    console.log('sid: ', sid);
    const response = await fetch(`${BASE_URL}/menu?lat=${latitude}&lng=${longitude}&sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenus] Error fetching menus:', data);
      throw new Error(data.error || 'Error fetching menus');
    }

    const menus = await response.json();

    // Fetch images for each menu and add other details
    const updatedMenus = await Promise.all(menus.map(async (menu) => {
      const menuId = menu.mid;
      let menuImage = null;

      if (menuId) {
        try {
          menuImage = await fetchMenuImage(menuId); // Fetch image for the menu
        } catch (error) {
          console.error(`[fetchMenus] Failed to fetch image for menuId ${menuId}:`, error);
        }
      }

      return {
        ...menu,
        image: menuImage || 'default-image-url', // Use a default image or null if no image fetched
        location: {
          lat: latitude,
          lng: longitude,
        },
      };
    }));

    return updatedMenus;

  } catch (error) {
    console.error('[fetchMenus] Error during menu fetch or image fetch:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};

// Function to fetch details of a specific menu (with image)
export const fetchMenuDetails = async (menuId) => {
  try {
    if (!menuId) {
      throw new Error('Menu ID non valido');
    }

    console.log(`[fetchMenuDetails] Fetching details for menuId: ${menuId}`);

    // Ottiene la posizione corrente
    const { latitude, longitude } = await getCurrentPosition();
    console.log('sid: ', sid);
    if (!sid) {
      throw new Error('SID non trovato');
    }

    // Fetch the menu details
    const response = await fetch(`${BASE_URL}/menu/${menuId}?lat=${latitude}&lng=${longitude}&sid=${sid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[fetchMenuDetails] Response status for menuId ${menuId}: ${response.status}`);

    if (!response.ok) {
      const data = await response.json();
      console.error('[fetchMenuDetails] Errore durante il fetch dei dettagli:', data);
      throw new Error(data.error || 'Errore durante il fetch dei dettagli del menu');
    }

    // Parse the response data
    const menuDetails = await response.json();

    // Fetch the menu image
    let menuImage = null;
    try {
      menuImage = await fetchMenuImage(menuId); // Fetch image for the menu
    } catch (error) {
      console.error(`[fetchMenuDetails] Failed to fetch image for menuId ${menuId}:`, error);
    }

    // Add the image to the menu details
    const updatedMenuDetails = {
      ...menuDetails,
      image: menuImage || 'default-image-url', // Use a default image if no image is fetched
    };

    return updatedMenuDetails;
  } catch (error) {
    console.error('[fetchMenuDetails] Errore durante il fetch dei dettagli del menu:', error);
    throw error; // Re-throw to be handled by the calling function
  }
};
