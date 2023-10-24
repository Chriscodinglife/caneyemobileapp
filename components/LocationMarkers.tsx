import { Location } from './Location';
import React, { useState } from 'react';
import LocationModal from './LocationModal';
import { Marker, Callout } from 'react-native-maps';
import { View, Text, StyleSheet, Modal, Button, Image } from 'react-native';

type LocationMarkersProps = {
  locations: Location[] | undefined;
};

const LocationMarkers: React.FC<LocationMarkersProps> = ({ locations }) => {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);


  const openLocationModal = (index: number) => {
    setSelectedLocationIndex(index);
  }


  const closeLocationModal = () => {
    setSelectedLocationIndex(null);
  }

  
  return locations?.map((location, index) => {
    return (
      <View key={index}>
        <Marker
          coordinate={location.location}
          style={styles.marker}
          title={location.name}
          onPress={() => openLocationModal(index)} // Pass the index to openMarkerModal
        >
        </Marker>
        <LocationModal 
          selectedLocationIndex={selectedLocationIndex}
          closeLocationModal={() => closeLocationModal()}
          location={location}
          index={index}/>
      </View>
    )
  });
};

const styles = StyleSheet.create({
  marker: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    marginTop: 200,
    padding: 30,
    paddingTop: 40,
    paddingBottom: 300,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%'
  },
  locationName: {
    fontSize: 20,
    paddingBottom: 15
  },
  machines: {
    fontWeight: "200",
    fontSize: 15
  },
  locationImage: {
    width: "40%",
    height: "40%"
  }
})

export default LocationMarkers;
