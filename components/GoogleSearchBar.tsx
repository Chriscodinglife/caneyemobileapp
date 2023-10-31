import { useState, Dispatch, SetStateAction } from 'react';
import { StyleSheet } from 'react-native';
import { machineDB, auth } from '../firebaseConfig';
import { Location, apiKey } from './Location';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ref, child, update, get } from 'firebase/database';
import LocationModal from './LocationModal';

interface GoogleSearchBarProps {
  setLocations: Dispatch<SetStateAction<{[placeID: string] : Location}>>;
}

const GoogleSearchBar: React.FC<GoogleSearchBarProps> = (props: GoogleSearchBarProps) => {

  const dbRef = ref(machineDB);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [placeID, setPlaceID] = useState<string | null>(null);

  const updateLocationAtThisPlaceID = (location: Location, placeID: string | null) => {
    props.setLocations((prevLocations) => ({...prevLocations, [placeID as string]: location}));

  };

  const isLocationInDB = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    return new Promise<Location>((resolve, reject) => {
      const locationRef = child(dbRef, `machines/${data.place_id}`);
  
      get(locationRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const location = snapshot.val();
            resolve(location);
          } else {
            const location: Location = {
              name: details?.name as string,
              location: {
                latitude: details?.geometry.location.lat as number,
                longitude: details?.geometry.location.lng as number,
              },
              numMachines: 0,
              address: details?.formatted_address as string,
              placeID: data.place_id,
              imageURL: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${details?.photos[0].photo_reference}&key=${apiKey}`,
            };
            resolve(location);
          }
        })
        .catch((error) => {
          console.error("Error checking database: " + error);
          reject(error);
        });
    });
  };

  const locationProcessed = (location: Location, placeID: string) => {
    setCurrentLocation(location);
    setPlaceID(placeID);
    setLocationModalVisible(true);
  }

    return (
      <>
        <GooglePlacesAutocomplete
          placeholder="Search and Add a Location"
          onPress={(data, details = null) => {
            isLocationInDB(data, details)
              .then((location) => {
                locationProcessed(location, location.placeID);
              })
              .catch((error) => {
                // Handle any errors here
                console.error(error);
              });
          }}
          fetchDetails={true}
          textInputProps={{
            placeholderTextColor: 'black', // Text color
            style: searchBarStyle.searchBarStyle
          }}
          query={{
            key: `${apiKey}`, 
            language: 'en',
          }}
          styles={searchBarStyle} />
          { currentLocation ? (
          <LocationModal 
            placeID={placeID}
            location={currentLocation}
            isLocationModalVisible={isLocationModalVisible}
            setLocationModalVisible={setLocationModalVisible}
            updateLocationAtThisPlaceID={updateLocationAtThisPlaceID} />
          ) : (
            <>
            </>
          )}
          
        </>
    )
};

const searchBarStyle = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 70,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    textInputContainer: {
      width: '100%',
    },
    description: {
      fontWeight: 'bold',
    },
    searchBarStyle: {
      flex: 1,
      justifyContent: 'center',
      color: 'black', // Text color
      backgroundColor: 'white', // Background color
      borderRadius: 20, // Rounded edges
      marginHorizontal: 30,
      padding: 20, // Add padding to the input
      fontWeight: 'bold',
    }
});

export default GoogleSearchBar;