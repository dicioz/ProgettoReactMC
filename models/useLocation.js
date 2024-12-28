
//per ora non utilizzato, e forse mai...

/* // /hooks/useLocation.js
import { useState } from 'react';
import * as Location from 'expo-location';
import { fetchMenus } from '../models/menuModel'; // Assuming fetchMenus is in models

const useLocation = () => {
  const [location, setLocation] = useState(null); // State to store the location
  const [error, setError] = useState(null); // State to store error message
  const [menus, setMenus] = useState([]); // State to store fetched menus

  // Function to get the user's current position
  const getUserPosition = async () => {
    console.log('[getUserPosition] Requesting location permissions...');
    try {
      const permissionResponse = await Location.requestForegroundPermissionsAsync();
      console.log('[getUserPosition] Permission response:', permissionResponse);

      if (permissionResponse.status !== 'granted') {
        setError('Permission not granted');
        console.error('[getUserPosition] Permission denied');
        return null;
      }

      const userLocation = await Location.getCurrentPositionAsync();
      console.log('[getUserPosition] Location fetched:', userLocation);

      //controlliamo che userLocation non sia null e che abbia proprieta coords
      if (!userLocation || !userLocation.coords) {
        setError('Invalid location data');
        console.error('[getUserPosition] Invalid location data');
        return null;
      }

      setLocation(userLocation); // Save location in the state
      return userLocation;
    } catch (err) {
      console.error('[getUserPosition] Error while fetching location:', err);
      setError(err.message);
      return null;
    }
  };

  // Function to fetch menus based on the user's location
  const getMenuLocation = async () => {
    if (!location) {
      console.log('[getMenuLocation] Location not yet available');
      return;
    }

    const { latitude, longitude } = location.coords;
    console.log('[getMenuLocation] Current location:', { latitude, longitude });

    if (!latitude || !longitude) {
      setError('Invalid latitude or longitude');
      console.error('[getMenuLocation] Invalid latitude or longitude');
      return;
    }

    try {
      const fetchedMenus = await fetchMenus(latitude, longitude); // Fetch menus using the location
      setMenus(fetchedMenus); // Update the state with fetched menus
    } catch (err) {
      console.error('[getMenuLocation] Error fetching menus:', err);
      setError('Error fetching menus');
    }
  };

  // Function to fetch location and menus in sequence
  const fetchLocationAndMenus = async () => {
    const userLocation = await getUserPosition(); // Get user location
    if (userLocation) {
      await getMenuLocation(); // Fetch menus if location is available
    }
  };

  return { location, menus, error, fetchLocationAndMenus };
};

export default useLocation;
 */