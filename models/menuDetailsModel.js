import React from "react";
import CommunicationController from "./CommunicationController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DBController from "./DBController";

export const orderMenu = async (mid, location) => { // mid = menuID
  try {
    const sid = await AsyncStorage.getItem('SID');
    console.log('sid: ', sid);
    if (!sid) {
      throw new Error('SID non trovato');
    }
    const body = { sid: sid, deliveryLocation: { lat: location.latitude, lng: location.longitude } };
    const response = await CommunicationController.genericRequest(`/menu/${mid}/buy`, 'POST', {}, body);

    console.log('response: ', response);
    //salva l'oid nell'async storage
    const oid = response.oid.toString();
    await AsyncStorage.setItem('OID', oid);
    console.log('nuovo oid: ', oid);
    const uid = await AsyncStorage.getItem('UID');

    //salva l'oid nel db locale
    const db = new DBController();
    await db.openDB("userDB");
    await db.saveOid(response.oid, uid);
    return response;
  } catch (error) {
    console.error('Error during menu request: ', error);
    throw error;
  }
};


//ottiene i dettagli dell'utente per vedere lo stato di un ordine
export const checkStatusOrderModel = async () => {
  try {
    const uid = await AsyncStorage.getItem('UID');
    const sid = await AsyncStorage.getItem('SID');
    const response = await CommunicationController.genericRequest(`/user/${uid}`, 'GET', { sid: sid }, {});
    return response;
  } catch (error) {
    console.error('Error during menu request: ', error);
    throw error;
  }
};