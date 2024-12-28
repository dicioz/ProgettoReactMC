import { useState, useEffect } from 'react';
import { fetchMenus } from '../models/menuModel';

const useMenuViewModel = () => {
  const [menus, setMenus] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    //carica i menu
    
    const loadMenus = async () => {
      try {
        //imposta lo stato di caricamento su true
        setLoading(true);
        //richiama la funzione fetchMenus
        const data = await fetchMenus(); 
        //imposta i menu ottenuti nello stato
        setMenus(data); 
      } catch (err) {
        setError(err.message || 'Errore durante il caricamento dei menù');
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  return { menus, loading, error };
};

export default useMenuViewModel;
