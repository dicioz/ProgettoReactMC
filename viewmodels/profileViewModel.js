// /viewmodels/profileViewModel.js
import { useState, useEffect } from 'react';
import { saveProfile, getSid, getUserServer } from '../models/profileModel';
import * as SQLite from 'expo-sqlite';
import DBController from '../models/DBController';
import useOrderViewModel from '../viewmodels/orderViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';


const useProfileViewModel = () => {
  const [userData, setUserData] = useState({
    nome: '',
    cognome: '',
    intestatario: '',
    numero: '',
    mese_scadenza: 0,
    anno_scadenza: 0,
    cvv: '',
    uid: 0,
    lastOid: 0,
    orderStatus: '',
  });
  const { getOrderStatusViewModel, getMenuDetailsViewModel } = useOrderViewModel();
  const [menuDetails, setMenuDetails] = useState(null);
  const [resultDet, setResultDet] = useState(null);

// Funzione per caricare i dati dal database locale
  const loadUserData = async () => {
    let db = null;
    try {
      db = new DBController();
      await db.openDB();
      console.log('Database aperto:', db);
      const firstUser = await db.getFirstUser();
      if (firstUser) {
        console.log('Dati caricati dal database:', firstUser);
        console.log('Nome 1:', firstUser.nome);
        setUserData({
          nome: firstUser.nome || '',
          cognome: firstUser.cognome || '',
          intestatario: firstUser.nome + " " + firstUser.cognome,
          numero: firstUser.numeroCarta || '',
          mese_scadenza: firstUser.meseScadenza || 0,
          anno_scadenza: firstUser.annoScadenza || 0,
          cvv: firstUser.cvv || '',
          uid: firstUser.uid || 0,
          lastOid: firstUser.lastOid || 0,
          orderStatus: firstUser.orderStatus || '',
        });
      }
    } catch (error) {
      console.error('Errore durante il caricamento dei dati utente dal database:', error);
    }
  };

  const fetchStatus = async () => {
    // funzione per recuperare status e menu dal server
    try {
      const result = await getOrderStatusViewModel();
      if (result !== false) {
        const lat = result.deliveryLocation.lat;
        const lng = result.deliveryLocation.lng;
        const menu = await getMenuDetailsViewModel(result.mid, lat, lng);
        setMenuDetails(menu);
        setResultDet(result);
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
    }
  };

  // Effetto per caricare i dati al montaggio del componente
  useEffect(() => {
    loadUserData();
    fetchStatus();
  }, []);

  const refreshProfileData = async () => {
    await loadUserData();  // ricarica i dati dal DB locale
    await fetchStatus();   // ricarica lo stato ordine e i dettagli menu
  };

  const updateUserInfo = async (newData) => {
    // Aggiorna i dati utente con i nuovi dati
    console.log('Updating user data with:', newData);
    //aggiorna solamente i dati modificati 
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));

    console.log('(profileViewModel) sid: ', await getSid());

    // dati da inviare al server
    const datasToSave = {
      firstName: newData.nome,
      lastName: newData.cognome,
      cardFullName: "nome_carta_prova",
      cardNumber: newData.numero,
      cardExpireMonth: newData.mese_scadenza,
      cardExpireYear: newData.anno_scadenza,
      cardCVV: newData.cvv,
      sid: await getSid()
    }
    console.log('Dati da salvare:', datasToSave);

    // Salva i dati sul server
    try {
      await saveProfile(datasToSave);
      const temp = await getUserServer(); // Recupera i dati aggiornati
      console.log('[ProfileViewModel] Dati utente aggiornati:', temp);
      await refreshProfileData(); // ricarica i dati aggiornati dal DB e dal server
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }

  };

  return {
    userData,
    lastOrder,
    updateUserInfo,
    menuDetails,
    resultDet,
    refreshProfileData,
  };



};

export default useProfileViewModel;
