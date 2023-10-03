import { StyleSheet } from 'react-native';
import { Location, apiKey } from './Location';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type GoogleSearchBarProps = {
    openNewLocationModal: (newLocation: Location) => void;
}

const GoogleSearchBar: React.FC<GoogleSearchBarProps> = ({ openNewLocationModal }) => {

    return (
        <GooglePlacesAutocomplete
          placeholder="Where do you want to recycle?"
          onPress={(data, details = null) => {
            const newLocation: Location = {
              "name" : details?.name as string,
              "location" : {
                "latitude": details?.geometry.location.lat as number,
                "longitude": details?.geometry.location.lng as number
              },
              "numMachines": 0,
              "address" : details?.formatted_address as string,
              "placeID" : data.place_id,
              "imageURL" : `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${details?.photos[0].photo_reference}&key=${apiKey}`
            }
            openNewLocationModal(newLocation)
          }}
          fetchDetails={true}
          textInputProps={{
            placeholderTextColor: 'white', // Text color
            style: searchBarStyle.searchBarStyle
          }}
          query={{
            key: `${apiKey}`, 
            language: 'en',
          }}
          styles={searchBarStyle}
        />
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
      color: 'white', // Text color
      backgroundColor: '#53E601', // Background color
      borderRadius: 20, // Rounded edges
      marginHorizontal: 30,
      padding: 20, // Add padding to the input
      fontWeight: 'bold',
    }
});

export default GoogleSearchBar;