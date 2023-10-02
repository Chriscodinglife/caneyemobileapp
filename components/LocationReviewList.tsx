import React from 'react';
import { Review } from './Location';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';

type LocationReviewListProps = {
    reviews?: Review[];
}



const LocationReviewList: React.FC<LocationReviewListProps> = ({ reviews }) => {
  return (
    <View style={styles.masterView}>
      <Text style={styles.usernameHeader}>
        See what others had to say about this place:
      </Text>
      <ScrollView>
        { reviews?.map( (review, index) => { 
          return ( 
            <View key={index} style={styles.listItem}>
                <Text>{review.date}</Text>
                <Text>{review.message}</Text>
                <Text>{review.user}</Text>
                { review.imageUri ? (
                  <>
                  <Image source={{ uri: review.imageUri}} style={styles.imageUriStyle} />
                  </>
                )
              : (<></>) }
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
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
      height: 120,
    },
    flatlist: {
      flex: 1
    },
    usernameHeader: {
      fontSize: 15,
      padding: 10
    },
    imageUriStyle: {
      height: 60,
      width: 60
    }
  });

export default LocationReviewList