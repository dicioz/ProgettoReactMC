import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import useMenuViewModel from '../viewmodels/menuListViewModel';
import useLocationViewModel from '../viewmodels/locationViewModel';
import EnableLocationScreen from './enableLocation';


const MenuList = ({ navigation }) => {
  const { menus, loading, error } = useMenuViewModel();
  const { showPermissionPopup, currentView, requestPermissions } = useLocationViewModel();

  // Mostra EnableLocationScreen se i permessi non sono concessi
  useEffect(() => {
    const showPermission = async () => {
      if (showPermissionPopup) {
        console.log("Step 1");  
        await requestPermissions();
        console.log("Step 2");  
        if (showPermissionPopup) {
          console.log("Step 3");
          return <EnableLocationScreen />;
        }
      }
    }
    showPermission();
  }, [showPermissionPopup]);

  console.log("Step 4");
  // Stato di caricamento
  if (loading) {
    console.log("Step 5");
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Caricamento in corso...</Text>
      </View>
    );
  }

  // Stato di errore
  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Errore: {error}</Text>
      </View>
    );
  }

  // Renderizza l'elenco dei menu
  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('MenuDetails', { menuId: item.mid })}
    >
      {item.image ? (
        <Card.Cover
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      <Card.Content>
        <Title style={styles.cardTitle}>{item.name}</Title>
        <Paragraph style={styles.cardDescription}>{item.shortDescription}</Paragraph>
        <Paragraph style={styles.cardPrice}>Prezzo: {item.price} €</Paragraph>
        <Paragraph style={styles.cardDelivery}>Consegna: {item.deliveryTime} minuti</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={menus}
        renderItem={renderItem}
        keyExtractor={(item) => item.mid.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
  },
  cardImage: {
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0799ED',
    marginBottom: 8,
  },
  cardDelivery: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  noImage: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  noImageText: {
    color: '#555',
    fontStyle: 'italic',
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
});

export default MenuList;
