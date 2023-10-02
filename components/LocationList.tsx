import React, { useState } from 'react';
import LocationModal from './LocationModal';
import { useAppContext } from './AppContextProvider';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';


type LocationListProps = {
  locations: Location[];
};

const LocationList: React.FC<LocationListProps> = ({ locations }) => {
  const { user, updateUser } = useAppContext();
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);


  const openMarkerModal = (index: number) => {
    setSelectedLocationIndex(index);
  }


  const closeMarkerModal = () => {
    setSelectedLocationIndex(null);
  }

  
  return (
    <View style={styles.masterView}>
      <Text style={styles.usernameHeader}>
        Hi {user?.email}!
      </Text>
      <ScrollView style={styles.flatlist}
      contentContainerStyle={{ minHeight: '40%'}}>
        { locations.map( (location, index) => { 
          return (
            <TouchableOpacity
            key={index}
            style={styles.listItem}
            onPress={() => openMarkerModal(index)}>
              <Image style={{ height: "50%", width: "50%"}} source={{uri: location.imageURL}}/>
              <Text>{location.name}</Text>
              <LocationModal 
                selectedLocationIndex={selectedLocationIndex}
                closeMarkerModal={() => closeMarkerModal()}
                location={location}
                index={index}
              />
            </TouchableOpacity>
          )
        })}
       
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  masterView: {
    flex: 1
  },
  listItem: {
    padding: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    margin: 1,
    height: 150,
  },
  flatlist: {
    height: '300%'
  },
  usernameHeader: {
    fontSize: 15,
    padding: 10
  }
});

export default LocationList;
