import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import useMenuDetailsViewModel from '../viewmodels/menuDetailsViewModel';
import useOrderViewModel from '../viewmodels/orderViewModel';

const MenuDetails = ({ route, navigation }) => {
  const { menuId } = route.params;
  const { menuDetails, loading, error, order } = useMenuDetailsViewModel(menuId);
  const { location } = useOrderViewModel();
  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Errore: {error}</Text>
      </View>
    );
  }

  if (!menuDetails) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>Nessun dettaglio disponibile.</Text>
      </View>
    );
  }

  console.log('menuDetails: ', menuId);
  console.log('Location:', location);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {menuDetails.image ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${menuDetails.image}` }}
          style={styles.image}
        />
      ) : (
        <View style={styles.noImage}><Text style={styles.noImageText}>No Image Available</Text></View>
      )}
      <Text style={styles.title}>{menuDetails.name}</Text>
      <Text style={styles.price}>Prezzo: {menuDetails.price} €</Text>
      <Text style={styles.longDescription}>{menuDetails.longDescription}</Text>
      
      <Button
        mode="contained"
        onPress={async () => {
          const result = await order(menuId, location);
        }}
        style={styles.button}
      >
        Ordina Ora
      </Button>
      
      <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
        Torna Indietro
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#041c66',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0799ED',
    marginBottom: 12,
  },
  longDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 16,
  },
  noImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  },
  noImageText: {
    color: '#555',
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 8,
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: '600',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default MenuDetails;
