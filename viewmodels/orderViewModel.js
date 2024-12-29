import { useState, useEffect } from 'react';
import useLocationViewModel from './locationViewModel';
import {getOrderStatus} from '../models/orderStatusModel';
import { getMenuDetails } from '../models/orderStatusModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useMenuDetailsViewModel from './menuDetailsViewModel';

const useOrderViewModel = () => {
  const [orderStatus, setOrderStatus] = useState('In attesa');
  const [sid, setSid] = useState(null);
  const [oid, setOid] = useState(null);
  const { mid } = useMenuDetailsViewModel();

  // Utilizza il ViewModel della localizzazione per ottenere la posizione
  const { location, fetchLocation } = useLocationViewModel();

  useEffect(() => {
    const fetchSidAndOid = async () => {
      const sidValue = await AsyncStorage.getItem("SID");
      const oidValue = await AsyncStorage.getItem("OID");
      setSid(sidValue);
      setOid(oidValue);
    };
    fetchSidAndOid();

    if (!location) {
      fetchLocation();
    }
  }, [location, fetchLocation, orderStatus]);

  const updateOrderStatus = (status) => {
    setOrderStatus(status);
  };

  const getOrderStatusViewModel = async () => {
    /* if (!oid || !sid) {
      console.error('OID o SID mancanti. Impossibile ottenere stato ordine.');
      return null;
    } */
    try {
      const sid = await AsyncStorage.getItem("SID");
      const oid = await AsyncStorage.getItem("OID");
      console.log('nuovo oid orderviewmodel: ', oid);
      if(!oid){
        return false;
      }
      const status = await getOrderStatus(oid, sid);
      console.log("(orderViewModel)", status);
      return status;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  };

  const getMenuDetailsViewModel = async () => {
    try {
      const sid = await AsyncStorage.getItem("SID");
      // Se mid è assente o la location non è pronta, evitiamo l'errore
      if (!mid || !location) {
        return null;
      }
      const lat = location.latitude;
      const lng = location.longitude;
      console.log('(orderViewModel)lat: ', lat, 'lng: ', lng, 'mid: ', mid, 'sid: ', sid);  
      const response = await getMenuDetails(mid, lat, lng, sid);
      return response;
    } catch (error) {
      throw new Error('(OrderViewModel) Error fetching menu details:', error);
    }
  };



  return {
    orderStatus,
    updateOrderStatus,
    location,
    getOrderStatusViewModel,
    sid,
    oid, // aggiunta
    getMenuDetailsViewModel,
  };
};

export default useOrderViewModel;
