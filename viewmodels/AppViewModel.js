//Nell'AppViewModel.js ho spostato la logica di fetch dei dati
//così facendo App.js non deve capire quale testo mostrare ma solo mostrarlo

import { register } from "../models/profileModel";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchData() {
    try {
        await register();
    } catch (error) {
        return "Error: " + error.message;
    }
    return "data loaded";
};


export const saveLastPage = async (pageName) => {
    try {
        await AsyncStorage.setItem('lastPage', pageName);
    } catch (error) {
        console.error('Errore nel salvataggio della pagina:', error);
    }
}

export const getLastPage = async () => {
    try {
      const page = await AsyncStorage.getItem('lastPage');
      return page || null; // Ritorna null se non c'è nulla di salvato
    } catch (error) {
      console.error('Errore nel recupero della pagina:', error);
      return null;
    }
  };

