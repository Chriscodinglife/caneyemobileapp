import MapView from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { machineDB } from './firebaseConfig';
import AddButton from './components/AddButton';
import React, { useEffect, useState } from 'react';
import { ref, child, get} from 'firebase/database';
import LocationListModal from './components/LocationListModal';
import LocationMarkers from './components/LocationMarkers';
import GoogleSearchBar from './components/GoogleSearchBar';
import NewLocationModal from './components/newLocationModal';
import { AppContextProvider } from './components/AppContextProvider';
import { Location, PlaceDetailsResponse, apiKey } from './components/Location';
import { StyleSheet, Text, View, Modal, TouchableHighlight } from 'react-native';
import LocationModal from './components/LocationModal';


export default function App() {

  // Make a blank location so we can use this later
  const blankLocation: Location = {
    name: "",
    location: {
      latitude: 0,
      longitude: 0,
    },
    numMachines: 0,
    address: "",
    placeID: "",
    imageURL: "",
  }

  const dbRef = ref(machineDB);
  const [locations, setLocations] = useState<{[placeId:string]: Location}>({});
  const [isLocationListVisible, setLocationListVisible] = useState<boolean>(false);


  // Get the data from the database to list out to the map
  useEffect(() => {

    // Retrieve data from Firebase and update the state
    get(child(dbRef, 'machines')).then( (snapshot) => {
      if (snapshot.exists()) {
        const locationsObject: { [placeID: string]: Location } = {};

        snapshot.forEach((childSnapshot) => {
          const placeID = childSnapshot.key;
          const locationData = childSnapshot.val();
          locationsObject[placeID] = locationData;

        })

        setLocations(locationsObject);
          
      } else {
        console.log("No Data available");
      }
    }).catch( (error) => {
      console.error(error);
    });
  }, []);


  const addButtonClickHandler = () => {
    setLocationListVisible(!isLocationListVisible);
  };

  // Return back the MapView with the locations and a button to add
  return (
    <AppContextProvider>
      <View style={styles.mapContainer}>
        <GoogleSearchBar 
          setLocations={setLocations}/>
        <MapView 
          provider='google' 
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: 40.700690718242136, 
            longitude: -73.91815489689029,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1}}>
              <LocationMarkers 
                locations={locations} 
                setLocations={setLocations}/> 
        </MapView>
        <AddButton onClick={addButtonClickHandler}/>
        <LocationListModal 
          locations={locations} 
          setLocations={setLocations}
          isLocationListVisible={isLocationListVisible} 
          setLocationListVisible={setLocationListVisible} />
        <StatusBar style="auto" />
      </View>
    </AppContextProvider>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: '100%'
  },
});
