import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { Location } from './components/Location';
import LocationMarkers from './components/LocationMarkers';
import AddButton from './components/AddButton';
import LocationListModal from './components/LocationListModal';
import GoogleSearchBar from './components/GoogleSearchBar';

// Function to calculate the distance between two sets of coordinates (in this case, latitudes and longitudes).
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  // Convert distance to miles
  return distance * 0.621371;
}

export default function App() {
  const [userLocation, setUserLocation] = useState({
    latitude: 40.700690718242136,
    longitude: -73.91815489689029,
  });

  // Filter locations within a 5-mile radius
  const locationsWithinRadius = locations.filter((location) => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.location.latitude,
      location.location.longitude
    );

    return distance <= 5; // Filter locations within a 5-mile radius
  });

  // Your existing code to render the map and list
  return (
    <AppContextProvider>
      <View style={styles.mapContainer}>
        <GoogleSearchBar openNewLocationModal={openNewLocationModal} />
        {/* Other components */}
        <MapView
          provider="google"
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <LocationMarkers locations={locationsWithinRadius} />
        </MapView>
        <AddButton onClick={addButtonClickHandler} />
        <LocationListModal
          locations={locationsWithinRadius}
          closeListModal={closeListModal}
          isLocationListVisible={isLocationListVisible}
        />
      </View>
    </AppContextProvider>
  );
}
